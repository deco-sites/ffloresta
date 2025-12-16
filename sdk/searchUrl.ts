/**
 * Helper para construir URLs de busca consistentemente
 */

// Função para detectar se é uma página de busca
export function isSearchPage(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname === "/s" || urlObj.searchParams.has("q");
  } catch {
    return false;
  }
}

// Função para extrair o termo de busca da URL
export function getSearchTerm(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("q") || "";
  } catch {
    return "";
  }
}

// Função para construir URL de busca com filtros
export function buildSearchUrl(
  baseUrl: string,
  filters: Record<string, string> = {},
  sort?: string,
  page?: number
): string {
  try {
    const url = new URL(baseUrl);
    const isSearch = isSearchPage(baseUrl);

    if (!isSearch) {
      return baseUrl; // Retorna URL original se não for busca
    }

    // Criar nova URL com /s como base
    const searchUrl = new URL("/s", url.origin);

    // Preservar parâmetro de busca
    const searchQuery = getSearchTerm(baseUrl);
    if (searchQuery) {
      searchUrl.searchParams.set("q", searchQuery);
      searchUrl.searchParams.set("map", "ft");
    }

    // Adicionar filtros
    Object.entries(filters).forEach(([key, value]) => {
      searchUrl.searchParams.set(`filter.${key}`, value);
    });

    // Adicionar ordenação se especificada
    if (sort) {
      searchUrl.searchParams.set("sort", sort);
    }

    // Adicionar página (remover se for 1)
    if (page && page > 1) {
      searchUrl.searchParams.set("page", page.toString());
    } else {
      searchUrl.searchParams.delete("page");
    }

    return searchUrl.pathname + searchUrl.search;
  } catch (error) {
    console.error("Error building search URL:", error);
    return baseUrl;
  }
}
