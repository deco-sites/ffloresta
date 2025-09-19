import { Product } from "apps/commerce/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  /** @title Store ID da Trustvox */
  storeId?: string;
  /** @title Produto (para página de produto) */
  product?: Product | null;
  /** @title Página de produto */
  page?: ProductDetailsPage | null;
  /** @title ID do produto (manual) */
  productId?: string;
  /** @description Classe CSS customizada */
  customClass?: string;
}

export default function TrustvoxRatingWidget({
  storeId = "125156",
  product,
  page,
  productId,
  customClass = "",
}: Props) {
  // Determina o produto a partir das props
  const finalProduct = product || page?.product;

  // Determina o ID do produto - Usa inProductGroupWithID (ID do produto na VTEX) para Trustvox
  const refId = finalProduct?.additionalProperty?.find((prop) =>
    prop.name === "RefId"
  )?.value;
  const vtexProductId = finalProduct?.inProductGroupWithID; // ID do produto na VTEX
  const finalProductId = productId || vtexProductId || refId ||
    finalProduct?.sku || finalProduct?.productID || "";

  // Se não há ID do produto, não renderiza
  if (!finalProductId) {
    return null;
  }

  return (
    <div class={`trustvox-rating-widget ${customClass}`}>
      {/* Div onde as avaliações serão renderizadas - Conforme documentação oficial */}
      <div data-trustvox-product-code={finalProductId}></div>
    </div>
  );
}
