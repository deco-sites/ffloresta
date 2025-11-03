import { Product } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";

export interface Props {
  /** @title Store ID da Trustvox */
  storeId?: string;
  /** @title Produto (para página de produto) */
  product?: Product | null;
  /** @title ID do produto (manual) */
  productId?: string;
  /** @description Classe CSS customizada */
  customClass?: string;
}

// Script da Trustvox para as estrelas conforme documentação
const trustvoxStarsScript = (storeId: string) => {
  // Inicializa o array _trustvox_shelf_rate se não existir
  if (!window._trustvox_shelf_rate) {
    window._trustvox_shelf_rate = [];
  }

  // Configura o store ID
  window._trustvox_shelf_rate.push(["_storeId", storeId]);

  // Carrega o script da Trustvox se ainda não foi carregado
  if (!document.querySelector('script[src*="rate.trustvox.com.br"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "//rate.trustvox.com.br/widget.js";
    document.head.appendChild(script);
  }

  // Força a inicialização das estrelas após um pequeno delay
  setTimeout(() => {
    if (window.Trustvox && window.Trustvox.shelf) {
      window.Trustvox.shelf.init();
    }
  }, 1000);

  // Também tenta inicializar quando o script carregar
  const checkTrustvox = setInterval(() => {
    if (window.Trustvox && window.Trustvox.shelf) {
      window.Trustvox.shelf.init();
      clearInterval(checkTrustvox);
    }
  }, 500);

  // Para o intervalo após 10 segundos para evitar loop infinito
  setTimeout(() => {
    clearInterval(checkTrustvox);
  }, 10000);
};

export default function TrustvoxStars({
  storeId = "125156",
  product,
  productId,
  customClass = "",
}: Props) {
  // Determina o ID do produto - PRIORIZA inProductGroupWithID conforme documentação atualizada
  const refId = product?.additionalProperty?.find(
    (prop) => prop.name === "RefId",
  )?.value;
  const vtexProductId = product?.inProductGroupWithID; // ID do produto na VTEX
  const sku = product?.sku;
  const productIdFallback = product?.productID;

  // Ordem de prioridade igual ao TrustvoxClickableRating: productId > vtexProductId > refId > sku > productID
  const finalProductId = productId || vtexProductId || refId || sku ||
    productIdFallback || "";

  // Se não há ID do produto, não renderiza
  if (!finalProductId) {
    return null;
  }

  return (
    <>
      <div class={`trustvox-stars ${customClass}`}>
        {/* Div onde as estrelinhas serão renderizadas - Conforme documentação oficial da Trustvox */}
        <div
          class="trustvox-shelf-container"
          data-trustvox-product-code-js={finalProductId}
          data-trustvox-should-skip-filter="true"
          data-trustvox-display-rate-schema="false"
        >
        </div>
      </div>

      {/* Script da Trustvox */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(trustvoxStarsScript, storeId),
        }}
      />
    </>
  );
}
