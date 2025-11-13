import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../../sdk/format.ts";
import type { Flag } from "../../../loaders/flags-config.ts";

export interface ProductFlag {
  type: "text" | "image";
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  image?: string;
}

export const getClusterFlags = (
  product: Product,
  flagsConfig: Flag[] = [],
): ProductFlag[] => {
  const flags: ProductFlag[] = [];

  // Obter os clusters/coleções do produto a partir de additionalProperty
  const productClusters =
    product.additionalProperty?.filter((prop) => prop.name === "cluster") || [];

  // Para cada cluster do produto, verificar se o propertyID está em alguma flagConfig
  for (const cluster of productClusters) {
    const clusterId = cluster.propertyID;

    // Encontrar todas as flagsConfig que contêm este clusterId em suas collections
    const matchingFlags = flagsConfig.filter((config) =>
      config.collections.includes(clusterId)
    );

    for (const flagConfig of matchingFlags) {
      // Evitar duplicatas
      const alreadyExists = flags.some(
        (flag) =>
          flag.type === flagConfig.type && flag.text === flagConfig.title,
      );

      if (!alreadyExists) {
        if (flagConfig.type === "text") {
          flags.push({
            type: "text",
            text: flagConfig.title,
            textColor: flagConfig.textColor,
            backgroundColor: flagConfig.backgroundColor,
          });
        } else if (flagConfig.type === "image" && flagConfig.image) {
          flags.push({
            type: "image",
            image: flagConfig.image,
          });
        }
      }
    }
  }

  return flags;
};

export const calculatePercent = (listPrice?: number, price?: number) => {
  if (!listPrice || !price) return 0;
  return Math.round(((listPrice - price) / listPrice) * 100);
};

export const formatCurrency = (value?: number, currency?: string) => {
  if (!value) return "";
  return formatPrice(value, currency).replace("R$", "");
};
