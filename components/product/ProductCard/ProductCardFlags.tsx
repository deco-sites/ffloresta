import type { Product } from "apps/commerce/types.ts";
import { getClusterFlags } from "./utils.ts";

interface Props {
  product: Product;
}

function ProductFlags({ product }: Props) {
  const flags = getClusterFlags(product);

  if (flags.length === 0) return null;

  return (
    <div class="absolute top-0 left-0 flex gap-2">
      {flags.map((flag) => (
        <span
          class="text-xs text-white h-[15px] flex items-center px-2 w-max"
          style={{ backgroundColor: flag.color }}
        >
          {flag.text}
        </span>
      ))}
    </div>
  );
}

export default ProductFlags;
