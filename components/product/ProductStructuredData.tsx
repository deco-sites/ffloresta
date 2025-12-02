import type { ProductDetailsPage } from "apps/commerce/types.ts";
import { Head } from "$fresh/runtime.ts";

export interface Props {
  page: ProductDetailsPage;
  siteUrl: string;
  logoUrl: string;
  storeName: string;
}

// Definir tipos para os diferentes schemas
type SchemaType =
  | { "@context": "https://schema.org"; "@type": "Product"; [key: string]: any }
  | {
      "@context": "https://schema.org";
      "@type": "Organization";
      [key: string]: any;
    }
  | {
      "@context": "https://schema.org";
      "@type": "BreadcrumbList";
      [key: string]: any;
    }
  | {
      "@context": "https://schema.org";
      "@type": "WebPage";
      [key: string]: any;
    };

export default function ProductStructuredData({
  page,
  siteUrl,
  logoUrl,
  storeName,
}: Props) {
  if (!page?.product) return null;

  const { product } = page;
  const {
    offers,
    brand,
    isVariantOf,
    additionalProperty,
    gtin,
    sku,
    productID,
    image,
    description,
    name,
  } = product;

  const mainOffer = offers?.offers[0];
  const availability = mainOffer?.availability || "https://schema.org/InStock";
  const price = mainOffer?.price;
  const priceCurrency = mainOffer?.priceCurrency || "BRL";

  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate).toISOString().split("T")[0]
    : undefined;

  const extractCategories = () => {
    if (product.category) {
      return product.category.split(">").map((cat: string) => cat.trim());
    }

    const categories =
      additionalProperty
        ?.filter(
          (prop: { name: string; propertyID: string }) =>
            prop.name === "category" || prop.propertyID?.match(/^[0-9]+$/)
        )
        .map((prop: { value: any }) => prop.value) || [];

    return categories;
  };

  const categories = extractCategories();

  const cleanDescription = description
    ? description
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : `Produto ${name} disponível na loja ${storeName}`;

  const productUrl = page.canonical
    ? page.canonical.startsWith("http")
      ? page.canonical
      : `${siteUrl}${page.canonical}`
    : product.url?.startsWith("http")
    ? product.url
    : `${siteUrl}${product.url}`;

  const images = image?.map((img: { url: any }) => img.url) || [];
  const firstImage = images[0];
  const ogDescription =
    cleanDescription.length > 200
      ? `${cleanDescription.substring(0, 197)}...`
      : cleanDescription;

  const additionalProperties =
    additionalProperty?.map(
      (prop: { name: any; value: any; propertyID: any; description: any }) => ({
        "@type": "PropertyValue" as const,
        name: prop.name,
        value: prop.value,
        propertyID: prop.propertyID,
        description: prop.description,
      })
    ) || [];

  let offerSchema;
  if (offers?.offerCount && offers.offerCount > 1) {
    offerSchema = {
      "@type": "AggregateOffer" as const,
      priceCurrency: priceCurrency,
      highPrice: offers.highPrice,
      lowPrice: offers.lowPrice,
      offerCount: offers.offerCount,
      offers: offers.offers?.map(
        (offer: {
          priceCurrency: any;
          price: any;
          availability: any;
          itemCondition: any;
        }) => ({
          "@type": "Offer" as const,
          priceCurrency: offer.priceCurrency,
          price: offer.price,
          availability: offer.availability,
          itemCondition:
            offer.itemCondition || "https://schema.org/NewCondition",
          url: productUrl,
        })
      ),
    };
  } else {
    offerSchema = {
      "@type": "Offer" as const,
      priceCurrency: priceCurrency,
      price: price,
      availability: availability,
      itemCondition:
        mainOffer?.itemCondition || "https://schema.org/NewCondition",
      url: productUrl,
      priceValidUntil:
        mainOffer?.priceValidUntil ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  const productSchema: SchemaType = {
    "@context": "https://schema.org" as const,
    "@type": "Product" as const,
    productID: productID,
    sku: sku,
    mpn: sku,
    gtin13: gtin,
    name: name,
    description: cleanDescription,
    url: productUrl,
    image: images,
    brand: {
      "@type": "Brand" as const,
      name: brand?.name || "Marca",
      logo: brand?.logo,
    },
    category: categories.length > 0 ? categories.join(" > ") : undefined,
    releaseDate: releaseDate,
    additionalProperty:
      additionalProperties.length > 0 ? additionalProperties : undefined,
    isVariantOf: isVariantOf
      ? {
          "@type": "ProductGroup" as const,
          productGroupID: isVariantOf.productGroupID,
          name: isVariantOf.name,
          model: isVariantOf.model,
          url: isVariantOf.url?.startsWith("http")
            ? isVariantOf.url
            : `${siteUrl}${isVariantOf.url}`,
        }
      : undefined,
    offers: offerSchema,
    aggregateRating: product.aggregateRating
      ? {
          "@type": "AggregateRating" as const,
          ratingValue: product.aggregateRating.ratingValue,
          reviewCount: product.aggregateRating.reviewCount,
          bestRating: product.aggregateRating.bestRating,
          worstRating: product.aggregateRating.worstRating,
        }
      : undefined,
  };

  const organizationSchema: SchemaType = {
    "@context": "https://schema.org" as const,
    "@type": "Organization" as const,
    name: storeName,
    url: siteUrl,
    logo: logoUrl,
    sameAs: [],
  };

  const breadcrumbItems = page.breadcrumbList?.itemListElement || [];
  const breadcrumbSchema: SchemaType = {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    itemListElement: breadcrumbItems.map(
      (item: { name: any; item: string }, index: number) => ({
        "@type": "ListItem" as const,
        position: index + 1,
        name: item.name,
        item: item.item?.startsWith("http")
          ? item.item
          : `${siteUrl}${item.item}`,
      })
    ),
  };

  const webPageSchema: SchemaType = {
    "@context": "https://schema.org" as const,
    "@type": "WebPage" as const,
    name: `${name} - ${storeName}`,
    description: cleanDescription,
    url: productUrl,
    mainEntity: {
      "@id": `${productUrl}#product`,
    },
  };

  // Criar array com todos os schemas
  const schemas: SchemaType[] = [
    productSchema,
    organizationSchema,
    breadcrumbSchema,
    webPageSchema,
  ];

  const scriptContent = JSON.stringify(schemas, null, 2);

  return (
    <Head>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      />

      {/* Open Graph para Facebook e outros */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={productUrl} />
      {firstImage && <meta property="og:image" content={firstImage} />}
      <meta property="og:image:alt" content={name} />
      {firstImage && <meta property="og:image:width" content="1200" />}
      {firstImage && <meta property="og:image:height" content="630" />}
      <meta property="og:site_name" content={storeName} />
      {price && <meta property="og:price:amount" content={price.toString()} />}
      <meta property="og:price:currency" content={priceCurrency} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={name} />
      <meta name="twitter:description" content={ogDescription} />
      {firstImage && <meta name="twitter:image" content={firstImage} />}
      <meta name="twitter:image:alt" content={name} />

      {/* Meta tags adicionais */}
      <meta name="description" content={ogDescription} />
      <link rel="canonical" href={productUrl} />

      {/* Product meta tags */}
      {brand?.name && <meta property="product:brand" content={brand.name} />}
      <meta
        property="product:availability"
        content={
          availability === "https://schema.org/InStock"
            ? "in stock"
            : "out of stock"
        }
      />
      <meta property="product:condition" content="new" />
      {price && (
        <meta property="product:price:amount" content={price.toString()} />
      )}
      <meta property="product:price:currency" content={priceCurrency} />
      {sku && <meta property="product:retailer_item_id" content={sku} />}
      {gtin && <meta property="product:ean" content={gtin} />}
    </Head>
  );
}
