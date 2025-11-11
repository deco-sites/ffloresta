import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../../sdk/format.ts";
import type { Flag } from "../../../loaders/globalFlagsConfig.ts";

export interface ProductFlag {
  type: "text" | "image";
  text: string;
  backgroundColor?: string;
  textColor?: string;
  image?: string;
}

// Função principal para obter flags configuráveis
export const getConfigurableFlags = (
  product: Product,
  flagsConfig: Flag[],
): ProductFlag[] => {
  if (!flagsConfig.length) return [];

  const productCollectionIds = product.additionalProperty
    ?.filter((prop) => prop.name === "category" || prop.name === "collection")
    .map((prop) => prop.value)
    .filter((id): id is string => !!id) || [];

  const matchingFlags = flagsConfig.filter((flag) =>
    flag.collectionIds.some((collectionId) =>
      productCollectionIds.includes(collectionId)
    )
  );

  return matchingFlags.map((flag) => {
    if (flag.type === "text") {
      return {
        type: "text" as const,
        text: flag.text,
        backgroundColor: flag.backgroundColor,
        textColor: flag.textColor,
      };
    } else {
      return {
        type: "image" as const,
        text: flag.altText,
        image: flag.image,
      };
    }
  });
};

export const calculatePercent = (listPrice?: number, price?: number) => {
  if (!listPrice || !price) return 0;
  return Math.round(((listPrice - price) / listPrice) * 100);
};

export const formatCurrency = (value?: number, currency?: string) => {
  if (!value) return "";
  return formatPrice(value, currency).replace("R$", "");
};
