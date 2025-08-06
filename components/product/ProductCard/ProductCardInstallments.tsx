// ProductCardInstallments.tsx
import type { PriceSpecification } from "apps/commerce/types.ts";
import { formatCurrency } from "./utils.ts";

interface Props {
  priceSpecs: PriceSpecification[];
  price?: number;
  priceCurrency?: string;
}

function ProductCardInstallments({ priceSpecs, price, priceCurrency }: Props) {
  const noInterestInstallments = priceSpecs.filter(
    (spec) =>
      spec.priceComponentType === "https://schema.org/Installment" &&
      spec.priceType === "https://schema.org/SalePrice" &&
      spec.billingDuration &&
      spec.billingIncrement &&
      price &&
      spec.billingIncrement * spec.billingDuration <= price,
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
        <rect y="2.93127" width="12.6501" height="1.40556" fill="#8D98A0" />
      </svg>
      <span class="text-[#8D98A0] font-bold text-[12px] leading-[170%] tracking-[0%]">
        {bestInstallment.billingDuration}x de R${" "}
        {formatCurrency(bestInstallment.billingIncrement, priceCurrency)}
      </span>
    </div>
  );
}

export default ProductCardInstallments;
