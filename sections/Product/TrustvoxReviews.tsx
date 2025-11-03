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
  /** @title Título da seção */
  title?: string;
  /** @description Classe CSS customizada */
  customClass?: string;
}

// Script da Trustvox seguindo exatamente a documentação oficial
const trustvoxScript = (
  storeId: string,
  productId: string,
  productName: string,
  productPhotos: string[],
) => {
  // Aguarda um pouco para garantir que a página carregou
  setTimeout(() => {
    // IMPORTANTE: Limpa COMPLETAMENTE qualquer configuração anterior
    if (window._trustvox) {
      delete window._trustvox;
    }

    // Reinicializa o array _trustvox conforme documentação
    window._trustvox = [];

    // Configura as variáveis da Trustvox conforme documentação
    window._trustvox.push(["_storeId", storeId]);

    // Só adiciona o productId se ele existir e for válido
    if (productId && productId.trim() !== "") {
      window._trustvox.push(["_productId", productId]);
    } else {
      console.warn(
        "Trustvox: Nenhum ID de produto válido encontrado, mostrando avaliações da loja",
      );
    }

    if (productName && productName.trim() !== "") {
      window._trustvox.push(["_productName", productName]);
    }

    if (productPhotos && productPhotos.length > 0) {
      window._trustvox.push(["_productPhotos", productPhotos]);
    }

    // Remove scripts anteriores
    const existingScripts = document.querySelectorAll(
      'script[src*="sincero.js"]',
    );
    existingScripts.forEach((script) => script.remove());

    // Limpa o widget anterior
    const widget = document.getElementById("_trustvox_widget");
    if (widget) {
      widget.innerHTML =
        '<div class="flex items-center justify-center h-32 text-gray-500"><div class="text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div><p>Carregando avaliações...</p></div></div>';
    }

    // Carrega o script da Trustvox
    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = "//static.trustvox.com.br/sincero/sincero.js";
    document.head.appendChild(script);

    // Debug detalhado
  }, 200); // Aumentei o delay para 200ms
};

export default function TrustvoxReviews({
  storeId = "125156",
  product,
  page,
  productId,
  title = "Avaliações do Produto",
  customClass = "",
}: Props) {
  // Determina o produto a partir das props
  const finalProduct = product || page?.product;

  // Determina o ID do produto - Usa inProductGroupWithID (ID do produto na VTEX) para Trustvox
  const refId = finalProduct?.additionalProperty?.find(
    (prop) => prop.name === "RefId",
  )?.value;
  const vtexProductId = finalProduct?.inProductGroupWithID; // ID do produto na VTEX
  const finalProductId = productId ||
    vtexProductId ||
    refId ||
    finalProduct?.sku ||
    finalProduct?.productID ||
    "";

  // Validação adicional do ID do produto
  if (finalProductId && finalProductId.length < 3) {
    console.warn(
      "TrustvoxReviews - ID do produto muito curto:",
      finalProductId,
    );
  }

  // Se não há ID do produto, não renderiza
  if (!finalProductId) {
    return null;
  }

  // Dados do produto para a Trustvox
  const productName = finalProduct?.name || "";
  const productPhotos = finalProduct?.image?.map((img) => img.url) || [];

  return (
    <div
      id="trustvox-reviews"
      class={`trustvox-reviews-section ${customClass}`}
    >
      {title && <h2 class="text-2xl font-bold mb-6 text-center">{title}</h2>}

      {/* Widget da Trustvox conforme documentação oficial */}
      <div id="_trustvox_widget" class="min-h-[400px] w-full">
        {/* Placeholder enquanto carrega */}
        <div class="flex items-center justify-center h-32 text-gray-500">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2">
            </div>
            <p>Carregando avaliações...</p>
          </div>
        </div>
      </div>

      {/* Script da Trustvox */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            trustvoxScript,
            storeId,
            finalProductId,
            productName,
            productPhotos,
          ),
        }}
      />
    </div>
  );
}
