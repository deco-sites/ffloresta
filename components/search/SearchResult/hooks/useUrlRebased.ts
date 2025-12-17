export const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;

    const isSearch = final.searchParams.has("q") || final.pathname === "/s";

    if (isSearch && final.pathname !== "/s") {
      final.pathname = "/s";
    }

    const baseUrl = new URL(base);
    for (const [key, value] of baseUrl.searchParams.entries()) {
      if (key !== "page" || !temp.searchParams.has("page")) {
        final.searchParams.set(key, value);
      }
    }

    for (const [key, value] of temp.searchParams.entries()) {
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
