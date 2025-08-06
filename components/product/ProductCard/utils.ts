// utils.ts
import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../../sdk/format.ts";

export const getClusterFlags = (product: Product) => {
  const flags = [];
  const clusters =
    product.additionalProperty?.filter((prop) => prop.name === "cluster") || [];

  for (const cluster of clusters) {
    switch (cluster.value) {
      case "Ofertas":
        flags.push({
          text: "Oferta relâmpago",
          color: "#18454E",
        });
        break;
      case "Novidades":
        flags.push({
          text: "Novidade",
          color: "#02A3AE",
        });
        break;
      case "Lançamentos":
        flags.push({
          text: "Lançamento",
          color: "#010101",
        });
        break;
      case "Encomendas":
        flags.push({
          text: "Encomenda",
          color: "#4C1717",
        });
        break;
    }
  }

  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate)
    : null;
  const now = new Date();
  const isNew = releaseDate &&
    now.getTime() - releaseDate.getTime() < 30 * 24 * 60 * 60 * 1000;

  if (isNew && !flags.some((f) => f.text === "Novidade")) {
    flags.push({
      text: "Novidade",
      color: "#02A3AE",
    });
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
