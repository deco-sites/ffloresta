import type { Product } from "apps/commerce/types.ts";
import { getClusterFlags } from "./utils.ts";
import type { Flag } from "../../../loaders/flags-config.ts";

interface Props {
  product: Product;
  flagsConfig?: Flag[];
}

function ProductFlags({ product, flagsConfig = [] }: Props) {
  const flags = getClusterFlags(product, flagsConfig);

  if (flags.length === 0) return null;

  return (
    <div class="absolute top-0 left-0 flex flex-wrap gap-2">
      {flags.map((flag, index) =>
        flag.type === "text" ? (
          <span
            key={index}
            class="text-xs h-[15px] flex items-center px-2 w-max"
            style={{
              color: flag.textColor || "#fff",
              backgroundColor: flag.backgroundColor || "#000",
            }}
          >
            {flag.text}
          </span>
        ) : flag.type === "image" && flag.image ? (
          <img key={index} src={flag.image} alt="" class="object-contain" />
        ) : null
      )}
    </div>
  );
}

export default ProductFlags;
