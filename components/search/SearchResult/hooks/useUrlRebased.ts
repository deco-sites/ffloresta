export const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;

    // Se for uma página de busca, garantir que mantenha o formato correto
    const isSearch = final.searchParams.has("q") || final.pathname === "/s";

    if (isSearch && final.pathname !== "/s") {
      final.pathname = "/s";
    }

    // Primeiro, preservar todos os parâmetros da URL base
    const baseUrl = new URL(base);
    for (const [key, value] of baseUrl.searchParams.entries()) {
      // Não preservar o parâmetro page da URL base se estivermos mudando de página
      if (key !== "page" || !temp.searchParams.has("page")) {
        final.searchParams.set(key, value);
      }
    }

    // Depois, aplicar os overrides
    for (const [key, value] of temp.searchParams.entries()) {
      // SEMPRE remover o parâmetro page se for 1
      if (key === "page" && value === "1") {
        final.searchParams.delete("page");
      } else if (key === "page") {
        final.searchParams.set(key, value);
      } else {
        final.searchParams.set(key, value);
      }
    }

    url = final.href;
  }
  return url;
};
