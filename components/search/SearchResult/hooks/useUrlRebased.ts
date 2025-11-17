export const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;

    // Primeiro, preservar todos os parâmetros da URL base (filtros atuais)
    const baseUrl = new URL(base);
    for (const [key, value] of baseUrl.searchParams.entries()) {
      // Não preservar o parâmetro page da URL base se estivermos mudando de página
      if (key !== "page" || !temp.searchParams.has("page")) {
        final.searchParams.set(key, value);
      }
    }

    // Depois, aplicar os overrides (principalmente a página)
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
