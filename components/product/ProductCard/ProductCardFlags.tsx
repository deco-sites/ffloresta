// components/ProductCard/ProductCardFlags.tsx

import type { Product } from "apps/commerce/types.ts";
import type { Flag } from "../../../loaders/globalFlagsConfig.ts";
import { getConfigurableFlags } from "./utils.ts";

interface Props {
  product: Product;
  /**
   * @title Configuração de Flags
   * @description Flags configuradas via loader
   */
  flagsConfig?: Flag[];
}

function ProductFlags({ product, flagsConfig = [] }: Props) {
  const flags = getConfigurableFlags(product, flagsConfig);

  if (flags.length === 0) return null;

  return (
    <div class="absolute top-0 left-0 flex flex-col gap-2 z-10">
      {flags.map((flag, index) => (
        <div
          key={index}
          class="flex items-center gap-1 h-[15px] px-2 w-max font-medium"
          style={flag.type === "text"
            ? {
              backgroundColor: flag.backgroundColor,
              color: flag.textColor,
            }
            : undefined}
        >
          {flag.type === "image"
            ? (
              <img
                src={flag.image}
                alt={flag.text}
                class="h-full w-auto object-contain"
                loading="lazy"
              />
            )
            : <span class="text-xs">{flag.text}</span>}
        </div>
      ))}
    </div>
  );
}

export default ProductFlags;
