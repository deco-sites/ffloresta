import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../../sdk/clx.ts";
import { relative } from "../../../sdk/url.ts";
import { useOffer } from "../../../sdk/useOffer.ts";
import { useSendEvent } from "../../../sdk/useSendEvent.ts";
import { useId } from "../../../sdk/useId.ts";
import AddToCartButton from "../../../islands/AddToCartButton.tsx";
// import ProductFlags from "./ProductCardFlags.tsx";
import ProductImage from "./ProductCardImage.tsx";
import ProductInfo from "./ProductCardInfo.tsx";
import ProductInstallments from "./ProductCardInstallments.tsx";
import { calculatePercent } from "./utils.ts";

interface Props {
  product: Product;
  preload?: boolean;
  itemListName?: string;
  index?: number;
  class?: string;
}

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];
  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const relativeUrl = relative(url);
  const percent = calculatePercent(listPrice, price);
  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  const priceSpecs = product.offers?.offers?.[0]?.priceSpecification ?? [];

  return (
    <div
      {...event}
      class={clx(
        "bg-white flex flex-col shadow-[5px_5px_7px_0px_rgba(0,0,0,0.15)] p-4 w-[95%] lg:w-[97%] h-[98%]",
        _class
      )}
    >
      <figure class="relative">
        {/* <ProductFlags product={product} /> */}

        <ProductImage
          front={front}
          back={back}
          alt={front?.alternateName ?? title}
          inStock={inStock}
          preload={preload}
          relativeUrl={relativeUrl}
        />

        {/* <div class="mt-2 min-h-[15px]">
          {inStock && (
            <span class="text-xs text-white bg-[#087D38] h-[15px] flex items-center px-2 w-max">
              Chegará amanhã
            </span>
          )}
        </div> */}
      </figure>

      <div class="mt-2 flex flex-col flex-grow">
        <ProductInfo
          title={title}
          listPrice={listPrice}
          price={price}
          percent={percent}
          priceCurrency={offers?.priceCurrency}
          relativeUrl={relativeUrl}
        />

        <div class="mt-1 flex flex-col items-start min-h-[20px]">
          <ProductInstallments
            priceSpecs={priceSpecs}
            price={price}
            priceCurrency={offers?.priceCurrency}
          />
        </div>

        <div class="mt-auto pt-4">
          {inStock ? (
            <AddToCartButton
              product={product}
              seller={seller}
              item={item}
              class={clx(
                "w-full bg-[#3A4332] border border-[#3A4332] text-white h-8 flex items-center justify-center",
                "font-bold text-[14px] leading-[170%] tracking-[16%]",
                "hover:bg-[#2a3124] transition duration-300 ease-in-out"
              )}
            />
          ) : (
            <a
              href={relativeUrl}
              class={clx(
                "w-full bg-transparent border border-[#3A4332] text-#3A4332 h-8 flex items-center justify-center",
                "font-bold text-[14px] leading-[170%] tracking-[16%] cursor-none"
              )}
            >
              INDISPONÍVEL
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
