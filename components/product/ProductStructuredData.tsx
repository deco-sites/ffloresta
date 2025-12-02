import type { ProductDetailsPage } from "apps/commerce/types.ts";
import { Head } from "$fresh/runtime.ts";

export interface Props {
  page: ProductDetailsPage;
  /**
   * @title URL do site
   * @description URL base do seu site (ex: https://www.seusite.com)
   */
  siteUrl: string;
  /**
   * @title URL da logo
   * @description URL completa da logo da sua loja
   */
  logoUrl: string;
}

export default function ProductStructuredData({
  page,
  siteUrl,
  logoUrl,
}: Props) {
  if (!page?.product) return null;

  const { product } = page;
  const { offers, brand, isVariantOf } = product;
  const mainOffer = offers?.offers[0];
  const availability = mainOffer?.availability || "https://schema.org/InStock";
  const price = mainOffer?.price;
  const priceCurrency = mainOffer?.priceCurrency || "BRL";
  const inStock = availability === "https://schema.org/InStock";
  const aggregateOffer =
    offers?.offers.length > 1
      ? {
          "@type": "AggregateOffer",
          highPrice: offers.highPrice,
          lowPrice: offers.lowPrice,
          offerCount: offers.offerCount,
          priceCurrency: priceCurrency,
        }
      : undefined;

  // Gerar descrição
  const description =
    product.description ||
    isVariantOf?.description ||
    `Produto ${product.name} disponível na loja`;

  // Garantir que a URL seja absoluta
  const productUrl = page.canonical
    ? page.canonical.startsWith("http")
      ? page.canonical
      : `${siteUrl}${page.canonical}`
    : `${siteUrl}${product.url}`;

  // Extrair SKU
  const sku = product.sku || product.productID;

  // Processar reviews se existirem
  const aggregateRating = product.aggregateRating
    ? {
        "@type": "AggregateRating",
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
      }
    : undefined;

  // Processar imagens
  const images = product.image?.map((img: { url: any }) => img.url) || [];

  // Schema principal do produto
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description,
    image: images,
    sku: sku,
    gtin: sku, // Pode ser EAN, UPC, etc
    mpn: sku, // Manufacturer Part Number
    brand: {
      "@type": "Brand",
      name: brand?.name || "Marca",
    },
    offers: aggregateOffer || {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: priceCurrency,
      price: price,
      availability: availability,
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil:
        mainOffer?.priceValidUntil ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
    },
    aggregateRating: aggregateRating,
  };

  // Schema Organization para o site
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: siteUrl,
    logo: logoUrl,
    name: "Nome da sua loja", // Você pode parametrizar isso também
  };

  // Breadcrumb Schema
  const breadcrumbItems = page.breadcrumbList?.itemListElement || [];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map(
      (item: { name: any; item: any }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item,
      })
    ),
  };

  const scriptContent = JSON.stringify([
    productSchema,
    organizationSchema,
    breadcrumbSchema,
  ]);

  return (
    <Head>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      />

      {/* Open Graph Tags para redes sociais
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={productUrl} />
      {images[0] && <meta property="og:image" content={images[0]} />}
      
      {/* Twitter Card */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={description} />
      {images[0] && <meta name="twitter:image" content={images[0]} />} */}

      {/* <link rel="canonical" href={productUrl} /> */}
    </Head>
  );
}
