// sections/AdvancedCanonical.tsx

import { Head } from "$fresh/runtime.ts";

export interface Props {
  /**
   * @title Tipo de Página
   * @description Selecione o tipo de página para definir a URL canônica automaticamente
   */
  pageType: "home" | "category" | "product" | "static" | "search" | "custom";

  /**
   * @title URL Canônica Personalizada
   * @description Digite a URL canônica completa (somente quando selecionar "Custom" no tipo de página)
   */
  customCanonical?: string;
}

export function loader(props: Props, req: Request) {
  const url = new URL(req.url);
  const { pageType, customCanonical } = props;

  // URL base canônica do site
  const canonicalBase = "https://www.ferragensfloresta.com.br";

  let canonicalUrl = "";

  switch (pageType) {
    case "home":
      canonicalUrl = canonicalBase;
      break;

    case "category":
      // Remove todos os parâmetros da categoria
      canonicalUrl = `${canonicalBase}${url.pathname}`;
      break;

    case "product":
      // Mantém apenas o skuId se existir, remove outros parâmetros
      const productParams = new URLSearchParams();
      const skuId = url.searchParams.get("skuId");
      if (skuId) {
        productParams.set("skuId", skuId);
      }
      canonicalUrl = `${canonicalBase}${url.pathname}${
        productParams.toString() ? `?${productParams.toString()}` : ""
      }`;
      break;

    case "static":
      // Remove parâmetros de páginas estáticas
      canonicalUrl = `${canonicalBase}${url.pathname}`;
      break;

    case "search":
      // Remove parâmetros da busca
      canonicalUrl = `${canonicalBase}${url.pathname}`;
      break;

    case "custom":
      canonicalUrl = customCanonical || "";
      break;

    default:
      canonicalUrl = canonicalBase;
  }

  // Remove trailing slash e normaliza
  if (canonicalUrl.endsWith("/") && canonicalUrl !== canonicalBase + "/") {
    canonicalUrl = canonicalUrl.slice(0, -1);
  }

  return {
    canonicalUrl,
    pageType,
    hasCustomUrl: !!customCanonical,
  };
}

function AdvancedCanonical({
  canonicalUrl,
  pageType,
}: ReturnType<typeof loader>) {
  if (!canonicalUrl) {
    console.warn(
      `AdvancedCanonical: URL canônica não definida para o tipo ${pageType}`,
    );
    return null;
  }

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export default AdvancedCanonical;
