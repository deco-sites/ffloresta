import { Product } from "apps/commerce/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";

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
  /** @title Texto do link clicável */
  clickText?: string;
}

// Script da Trustvox para o widget clicável conforme documentação 2.2
const trustvoxClickableScript = (storeId: string) => {
  // Adiciona comportamento de scroll suave para o link
  const addSmoothScroll = () => {
    const reviewsLink = document.querySelector('a[href="#trustvox-reviews"]');
    if (reviewsLink) {
      reviewsLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("trustvox-reviews");
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  };

  // Executa quando a página carrega
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSmoothScroll);
  } else {
    addSmoothScroll();
  }
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
};

export default function TrustvoxClickableRating({
  storeId = "125156",
  product,
  page,
  productId,
  customClass = "",
  clickText = "Clique e veja!",
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
    <>
      {/* Link clicável com estrelas da Trustvox - Conforme script fornecido */}
      <a
        class={`trustvox-fluid-jump trustvox-widget-rating ${customClass}`}
        href="#trustvox-reviews"
        title="Pergunte e veja opiniões de quem já comprou"
      >
        <div
          class="trustvox-shelf-container"
          data-trustvox-product-code-js={finalProductId}
          data-trustvox-should-skip-filter="true"
          data-trustvox-display-rate-schema="false"
        >
        </div>
        <span class="rating-click-here">{clickText}</span>
      </a>

      {/* CSS conforme fornecido */}
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
          .trustvox-widget-rating {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .trustvox-widget-rating .ts-shelf-container,
          .trustvox-widget-rating .trustvox-shelf-container {
            display: inline-block;
          }
          .trustvox-widget-rating span.rating-click-here {
            display: inline-block;
            color: #DAA81D;
            font-size: 14px;
            white-space: nowrap;
          }
          .trustvox-widget-rating:hover span.rating-click-here {
            text-decoration: underline;
          }
        `,
        }}
      />

      {/* Script da Trustvox conforme item 2.2 */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(trustvoxClickableScript, storeId),
        }}
      />
    </>
  );
}
