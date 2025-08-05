// ProductCardInfo.tsx
import { formatCurrency } from "./utils.ts";

interface Props {
  title: string;
  listPrice?: number;
  price?: number;
  percent: number;
  priceCurrency?: string;
  relativeUrl: string;
}

function ProductCardInfo({
  title,
  listPrice,
  price,
  percent,
  priceCurrency,
  relativeUrl,
}: Props) {
  return (
    <a href={relativeUrl} class="block">
      <h3 class="text-[#3A4332] text-[16px] leading-[137%] tracking-[0%] capitalize line-clamp-3 min-h-[66px]">
        {title}
      </h3>

      <div class="flex flex-col mt-1">
        <div class="min-h-[25px] max-h-[25px]">
          {listPrice && price && listPrice > price && (
            <div class="text-[#8D98A0]">
              <span class="font-bold text-[10px] leading-[170%] tracking-[3%]">
                R$
              </span>
              <span class="font-bold text-[14px] leading-[170%] tracking-[3%] line-through">
                {formatCurrency(listPrice, priceCurrency)}
              </span>
            </div>
          )}
        </div>

        <div class="flex items-center gap-1">
          <div class="text-[#3A4332]">
            <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
              R$
            </span>
            <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
              {formatCurrency(price, priceCurrency)}
            </span>
          </div>
          {percent > 0 && (
            <span class="min-w-[30px] bg-[#3A4332] text-white font-bold text-[10px] tracking-[3%] text-center px-1">
              {percent}% OFF
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default ProductCardInfo;
