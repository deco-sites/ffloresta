import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../ui/Avatar.tsx";
import { clx } from "../../../sdk/clx.ts";
import { formatPrice } from "../../../sdk/format.ts";

interface Props {
  filters: ProductListingPage["filters"];
  url: string;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function isSearchPage(url: string): boolean {
  try {
    const urlObj = new URL(url, "http://localhost");
    return urlObj.searchParams.has("q") || urlObj.pathname === "/s";
  } catch {
    return false;
  }
}

function convertFilterUrl(url: string, base: string): string {
  try {
    const baseUrl = new URL(base);
    const targetUrl = new URL(url, base);

    const isSearch = isSearchPage(base);

    const filters: { key: string; value: string }[] = [];
    for (const [key, value] of targetUrl.searchParams.entries()) {
      if (key.startsWith("filter.")) {
        filters.push({ key: key.replace("filter.", ""), value });
      }
    }

    if (isSearch) {
      const newUrl = new URL(baseUrl);

      const searchQuery = baseUrl.searchParams.get("q") || "";

      const finalUrl = new URL("/s", baseUrl.origin);

      if (searchQuery) {
        finalUrl.searchParams.set("q", searchQuery);
        finalUrl.searchParams.set("map", "ft");
      }

      for (const { key, value } of filters) {
        finalUrl.searchParams.set(`filter.${key}`, value);
      }

      for (const [key, value] of baseUrl.searchParams.entries()) {
        if (
          !key.startsWith("filter.") &&
          key !== "q" &&
          key !== "map" &&
          key !== "page"
        ) {
          finalUrl.searchParams.set(key, value);
        }
      }

      if (finalUrl.searchParams.get("page") === "1") {
        finalUrl.searchParams.delete("page");
      }

      return finalUrl.pathname + finalUrl.search;
    } else {
      targetUrl.search = "";

      let pathname = "";
      let map: string[] = [];
      let initialQuery = "";

      for (const { key, value } of filters) {
        pathname += `/${value}`;
        map.push(key);

        if (key.startsWith("category") && !initialQuery) {
          initialQuery = value;
        }
      }

      if (!initialQuery && filters.length > 0) {
        initialQuery = filters[0].value;
      }

      targetUrl.pathname = pathname || targetUrl.pathname;

      if (initialQuery) {
        targetUrl.searchParams.set("initialMap", "c");
        targetUrl.searchParams.set("initialQuery", initialQuery);
      }
      if (map.length > 0) {
        targetUrl.searchParams.set("map", map.join(","));
      }

      return targetUrl.pathname + "?" + targetUrl.searchParams.toString();
    }
  } catch (e) {
    console.error("Error converting URL:", e);
    return url;
  }
}

function ValueItem({
  url,
  selected,
  label,
  quantity,
  baseUrl,
}: FilterToggleValue & { baseUrl: string }) {
  const href = convertFilterUrl(url, baseUrl);

  return (
    <a
      href={href}
      rel="nofollow"
      class="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
      data-filter-item
    >
      <div
        aria-checked={selected}
        data-selected={selected}
        class={clx(
          "checkbox rounded-none w-4 h-4 max-w-4 max-h-4 border relative transition-all duration-200 flex items-center justify-center",
          selected
            ? "bg-[#1F251C] border-[#1F251C]"
            : "border-[#CCCCCC] bg-white"
        )}
      >
        {selected && (
          <svg
            class="w-3 h-3 text-white"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        )}
      </div>
      <span
        class={clx(
          "text-md transition-colors duration-200",
          selected ? "text-[#1F251C] font-medium" : "text-[#1F251C]"
        )}
      >
        {label}
      </span>
    </a>
  );
}

function FilterValues({
  key,
  values,
  baseUrl,
}: FilterToggle & { baseUrl: string }) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2`, flexDirection)}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <li key={`${key}-${value}`}>
              <a href={convertFilterUrl(url, baseUrl)} rel="nofollow">
                <Avatar
                  content={value}
                  variant={selected ? "active" : "default"}
                />
              </a>
            </li>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return (
            range && (
              <li key={`${key}-${value}`}>
                <ValueItem
                  {...item}
                  baseUrl={baseUrl}
                  label={`${formatPrice(range.from)} - ${formatPrice(
                    range.to
                  )}`}
                />
              </li>
            )
          );
        }

        return (
          <li key={`${key}-${value}`}>
            <ValueItem {...item} baseUrl={baseUrl} />
          </li>
        );
      })}
    </ul>
  );
}

// Função para traduzir os labels dos filtros
function translateFilterLabel(key: string, originalLabel: string): string {
  const translations: Record<string, string> = {
    Departments: "Departamentos",
    Categories: "Categorias",
    Brands: "Marcas",
    PriceRanges: "Faixa de Preço",
  };

  return translations[originalLabel] || originalLabel;
}

function Filters({ filters, url }: Props) {
  console.log(filters, url, "filters");

  // Filtrar para remover PriceRanges, "price" e também filtros sem valores
  const filteredFilters = filters.filter((filter) => {
    if (isToggle(filter)) {
      // Remover filtros de preço e PriceRanges
      const isPriceFilter =
        filter.key === "price" || filter.key === "PriceRanges";
      // Verificar se o filtro tem valores (não está vazio)
      const hasValues = filter.values && filter.values.length > 0;

      return !isPriceFilter && hasValues;
    }
    return true;
  });

  // Se não houver filtros para exibir, não renderiza nada
  if (filteredFilters.length === 0) {
    return null;
  }

  return (
    <ul
      class="flex flex-col gap-6 sm:p-0 divide-y divide-[#CCCCCC]"
      data-filters-container
    >
      {filteredFilters.filter(isToggle).map((filter) => {
        // Verificar novamente se tem valores (para garantir)
        if (!filter.values || filter.values.length === 0) {
          return null;
        }

        return (
          <li key={filter.key} class="flex flex-col gap-4 pt-4 px-4 xl:px-0">
            {/* Usar o label traduzido */}
            <span class="text-md font-medium text-[#1F251C]">
              {translateFilterLabel(filter.key, filter.label)}
            </span>
            <div class="md:max-h-80 md:overflow-auto">
              <FilterValues {...filter} baseUrl={url} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default Filters;
