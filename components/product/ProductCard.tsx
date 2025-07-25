import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import AddToCartButton from "./AddToCartButton.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  product: Product;
  preload?: boolean;
  itemListName?: string;
  index?: number;
  class?: string;
}

const WIDTH = 258;
const HEIGHT = 210;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();
  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];
  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;
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

  return (
    <div
      {...event}
      class={clx(
        "bg-white flex flex-col p-[18px_20px] w-full max-w-[258px] font-['FS_Emeric']",
        _class,
      )}
    >
      <figure class="relative">
        {/* Flags no topo */}
        <div class="absolute top-0 left-0 flex gap-2">
          <span class="w-full text-xs font-bold text-white bg-[#C60000] h-[15px] flex items-center px-2">
            NOVIDADE
          </span>
        </div>

        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "grid grid-cols-1 grid-rows-1",
            "w-full mt-10",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx("object-cover", "w-full", "col-span-full row-span-full")}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "w-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Flag "Chegará amanhã" */}
        {inStock && (
          <div class="mt-2">
            <span class="text-xs text-white bg-[#FF7315] h-[15px] flex items-center px-2 w-max">
              Chegará amanhã
            </span>
          </div>
        )}
      </figure>

      {/* Product Info */}
      <div class="mt-2 flex flex-col flex-grow">
        <a href={relativeUrl} class="block">
          {/* Product Title */}
          <h3 class="text-[#3A4332] text-[16px] leading-[137%] tracking-[0%] capitalize line-clamp-3 min-h-[66px]">
            {title}
          </h3>

          {/* Prices */}
          <div class="flex flex-col mt-1">
            {listPrice && price && listPrice > price && (
              <div class="text-[#8D98A0]">
                <span class="font-bold text-[10px] leading-[170%] tracking-[3%]">
                  R$
                </span>
                <span class="font-bold text-[14px] leading-[170%] tracking-[3%] line-through">
                  {formatPrice(listPrice, offers?.priceCurrency).replace(
                    "R$",
                    "",
                  )}
                </span>
              </div>
            )}
            <div class="flex items-center gap-1">
              <div class="text-[#3A4332]">
                <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
                  R$
                </span>
                <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
                  {formatPrice(price, offers?.priceCurrency).replace("R$", "")}
                </span>
              </div>
              {percent > 0 && (
                <span class="min-w-[30px] bg-[#3A4332] text-white font-bold text-[8px] tracking-[3%] text-center px-1">
                  {percent}% OFF
                </span>
              )}
            </div>
          </div>
        </a>

        {/* Linha unificada de pagamento */}
        <div class="mt-1 flex flex-col items-start">
          {
            /* <span class="text-[#8D98A0] font-bold text-[12px] leading-[170%] tracking-[0%]">
            A vista no pix
          </span> */
          }

          {(() => {
            const priceSpecs =
              product.offers?.offers?.[0]?.priceSpecification ?? [];

            const noInterestInstallments = priceSpecs.filter(
              (spec) =>
                spec.priceComponentType === "https://schema.org/Installment" &&
                spec.priceType === "https://schema.org/SalePrice" &&
                spec.billingDuration &&
                spec.billingIncrement &&
                spec.billingIncrement * spec.billingDuration === price,
            );

            const bestInstallment = noInterestInstallments.reduce(
              (max, curr) =>
                !max || curr.billingDuration > max.billingDuration ? curr : max,
              null,
            );

            if (!bestInstallment) return null;

            return (
              <div class="flex items-center gap-1">
                <svg
                  width="13"
                  height="9"
                  viewBox="0 0 13 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.351391"
                    y="0.471508"
                    width="11.9473"
                    height="7.7306"
                    rx="1.75695"
                    stroke="#8D98A0"
                    stroke-width="0.702782"
                  />
                  <rect
                    y="2.93127"
                    width="12.6501"
                    height="1.40556"
                    fill="#8D98A0"
                  />
                </svg>
                <span class="text-[#8D98A0] font-bold text-[12px] leading-[170%] tracking-[0%]">
                  {bestInstallment.billingDuration}x de R$ {formatPrice(
                    bestInstallment.billingIncrement,
                    offers?.priceCurrency,
                  ).replace("R$", "")}
                  {" "}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Add to cart button */}
        <div class="mt-auto pt-4">
          {inStock
            ? (
              <AddToCartButton
                product={product}
                seller={seller}
                item={item}
                class={clx(
                  "w-full bg-[#3A4332] text-white h-8 flex items-center justify-center",
                  "font-bold text-[14.06px] leading-[170%] tracking-[16%]",
                  "hover:bg-[#293023]",
                )}
              />
            )
            : (
              <a
                href={relativeUrl}
                class={clx(
                  "w-full bg-[#293023] text-white h-8 flex items-center justify-center",
                  "font-bold text-[14.06px] leading-[170%] tracking-[16%]",
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
