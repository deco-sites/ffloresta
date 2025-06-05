import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
// import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
// import ShippingSimulationForm from "../shipping/Form.tsx";
// import WishlistButton from "../wishlist/WishlistButton.tsx";
// import AddToCartButton from "./AddToCartButton.tsx";
// import OutOfStock from "./OutOfStock.tsx";
// import ProductSelector from "./ProductVariantSelector.tsx";
import { useOffer } from "../../sdk/useOffer.ts";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const {
    // productID,
    offers,
    isVariantOf,
  } = product;
  // const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const {
    price = 0,
    listPrice,
    // seller = "1",
    // availability
  } = useOffer(offers);

  // const percent =
  //   listPrice && price
  //     ? Math.round(((listPrice - price) / listPrice) * 100)
  //     : 0;

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

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  // const hasValidVariants =
  //   isVariantOf?.hasVariant?.some(
  //     (variant) =>
  //       variant?.name?.toLowerCase() !== "title" &&
  //       variant?.name?.toLowerCase() !== "default title"
  //   ) ?? false;

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* SKU and Product Name */}
      <div class="flex flex-col gap-0.5">
        {" "}
        {/* 2px gap = 0.5rem */}
        <span class="font-['FS_Emeric'] font-normal text-xs leading-[140%] text-[#3A4332]">
          SKU: valor fiction por enquanto
        </span>
        <h1 class="font-['FS_Emeric'] font-bold uppercase text-[15px] leading-[140%] text-[#3A4332] md:text-[20px]">
          {title}
        </h1>
      </div>

      {/* Prices - 20px gap on desktop, 6px on mobile */}
      <div class="mt-1.5 md:mt-5 flex flex-col gap-0">
        <div class="flex flex-col items-start gap-0">
          {listPrice && (
            <span class="font-['FS_Emeric'] font-normal text-[20px] leading-[170%] tracking-[3%] text-center text-[#121212]">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-['FS_Emeric'] font-bold text-[35px] leading-[170%] tracking-[3%] text-center text-[#677357]">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>

        {/* Cash Price with SVG */}
        <div class="flex items-center gap-2 mt-1">
          {/* SVG do cartão - substitua pelo seu SVG real */}
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

          <span class="font-gotham font-normal text-[14px] leading-[170%] text-[#677357] md:text-[17px]">
            1x de {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>
      </div>

      {/* Border bottom with spacing */}
      <div class="mt-5 md:mt-5 pb-5 border-b border-black">
        {/* This div creates the spacing and border */}
      </div>

      {/*
      TODO: Comentei o restante dos componentes que podem ser adicionados depois
      {hasValidVariants && (
        <div className="mt-4 sm:mt-8">
          <ProductSelector product={product} />
        </div>
      )}

      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              <AddToCartButton
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation"
                disabled={false}
              />
              <WishlistButton item={item} />
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>

      <div class="mt-8">
        <ShippingSimulationForm
          items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        />
      </div>

      <div class="mt-4 sm:mt-6">
        <span class="text-sm">
          {description && (
            <details>
              <summary class="cursor-pointer">Description</summary>
              <div
                class="ml-2 mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </details>
          )}
        </span>
      </div>
      */}
    </div>
  );
}

export default ProductInfo;
