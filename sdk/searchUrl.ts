export function isSearchPage(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname === "/s" || urlObj.searchParams.has("q");
  } catch {
    return false;
  }
}

export function getSearchTerm(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("q") || "";
  } catch {
    return "";
  }
}

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
      return baseUrl;
    }

    const searchUrl = new URL("/s", url.origin);

    const searchQuery = getSearchTerm(baseUrl);
    if (searchQuery) {
      searchUrl.searchParams.set("q", searchQuery);
      searchUrl.searchParams.set("map", "ft");
    }

    Object.entries(filters).forEach(([key, value]) => {
      searchUrl.searchParams.set(`filter.${key}`, value);
    });

    if (sort) {
      searchUrl.searchParams.set("sort", sort);
    }

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
