import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import AddToCartButtonPDP from "../../islands/AddToCartButtonPDP.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import { useOffer } from "../../sdk/useOffer.ts";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const id = useId();
  const platform = usePlatform();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const { price = 0, listPrice, seller = "1", availability } = useOffer(offers);

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  // Calculate best installment (copied from ProductCard)
  const priceSpecs = product.offers?.offers?.[0]?.priceSpecification ?? [];
  const noInterestInstallments = priceSpecs.filter(
    (spec) =>
      spec.priceComponentType === "https://schema.org/Installment" &&
      spec.priceType === "https://schema.org/SalePrice" &&
      spec.billingDuration &&
      spec.billingIncrement &&
      spec.billingIncrement * spec.billingDuration <= price,
  );
  const bestInstallment = noInterestInstallments.reduce(
    (max, curr) =>
      !max || curr.billingDuration > max.billingDuration ? curr : max,
    null,
  );

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* SKU and Product Name */}
      <div class="flex flex-col gap-0.5">
        <span class="font-['FS_Emeric'] font-normal text-[14px] leading-[140%] text-[#3A4332]">
          SKU: {product.sku}
        </span>
        <h1 class="font-['FS_Emeric'] leading-[140%] text-[#3A4332] text-[24px]">
          {title}
        </h1>
      </div>

      {/* Prices */}
      <div class="mt-1.5 md:mt-5 flex flex-col gap-0">
        <div class="flex flex-col items-start gap-0">
          {listPrice && (
            <span class="font-['FS_Emeric'] font-light text-[20px] leading-[170%] tracking-[3%] text-left text-[#3c4233] line-through">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-['FS_Emeric'] font-bold text-[24px] leading-[170%] text-left text-[#677357]">
            {formatPrice(price, offers?.priceCurrency)} à vista
          </span>
        </div>

        {/* Cash Price with SVG */}
        <div class="flex items-center gap-2 mt-1">
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="17"
              height="11"
              rx="1.5"
              stroke="#677357"
            />
            <rect y="3" width="18" height="2" fill="#677357" />
          </svg>

          <span class="font-gotham font-normal text-[12px] leading-[170%] text-[#677357]">
            {bestInstallment
              ? `${bestInstallment.billingDuration}x de ${
                formatPrice(
                  bestInstallment.billingIncrement,
                  offers?.priceCurrency,
                )
              } sem juros`
              : `1x de ${
                formatPrice(
                  price,
                  offers?.priceCurrency,
                )
              } no cartão de crédito`}
          </span>
        </div>
      </div>

      {/* Border bottom */}
      <div class="mt-5 md:mt-5 pb-5 border-b border-black" />

      {/* Variant Selector */}

      {/* Add to Cart Button */}
      <div class="mt-4 ">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              {hasValidVariants && (
                <div class="mb-6">
                  <ProductSelector product={product} />
                </div>
              )}
              <AddToCartButtonPDP
                item={item}
                seller={seller}
                product={product}
                platform={platform}
                class="mb-[14px]"
                disabled={false}
              />

              <div>
                <ShippingSimulationForm
                  items={[
                    { id: Number(product.sku), quantity: 1, seller: seller },
                  ]}
                />
              </div>
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
    </div>
  );
}

export default ProductInfo;
