export const setPageQuerystring = (page: string, id: string) => {
  const element = document
    .getElementById(id)
    ?.querySelector("[data-product-list]");
  if (!element) return;

  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");

    for (const entry of entries) {
      if (entry.isIntersecting) {
        // Só adicionar page se for diferente de 1
        if (page !== "1") {
          url.searchParams.set("page", page);
        } else {
          url.searchParams.delete("page");
        }
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        // Só adicionar page se for diferente de 1
        if (history.state.prevPage !== "1") {
          url.searchParams.set("page", history.state.prevPage);
        } else {
          url.searchParams.delete("page");
        }
      }
    }

    // Garantir que todos os filtros sejam preservados no histórico
    history.replaceState(
      { prevPage, filters: url.searchParams.toString() },
      "",
      url.href
    );
  }).observe(element);
};
