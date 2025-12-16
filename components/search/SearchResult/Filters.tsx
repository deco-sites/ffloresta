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

// Função para detectar se é uma página de busca (tem parâmetro q)
function isSearchPage(url: string): boolean {
  try {
    const urlObj = new URL(url, "http://localhost");
    return urlObj.searchParams.has("q") || urlObj.pathname === "/s";
  } catch {
    return false;
  }
}

// 🔧 Converter query params para o formato correto baseado no tipo de página
function convertFilterUrl(url: string, base: string): string {
  try {
    const baseUrl = new URL(base);
    const targetUrl = new URL(url, base);

    // Determinar se estamos em uma página de busca
    const isSearch = isSearchPage(base);

    // Coletar todos os filtros da URL target
    const filters: { key: string; value: string }[] = [];
    for (const [key, value] of targetUrl.searchParams.entries()) {
      if (key.startsWith("filter.")) {
        filters.push({ key: key.replace("filter.", ""), value });
      }
    }

    if (isSearch) {
      // Para página de busca: usar /s?q=termo&filter.xxx=valor
      const newUrl = new URL(baseUrl);

      // Manter o parâmetro q se existir
      const searchQuery = baseUrl.searchParams.get("q") || "";

      // Construir nova URL
      const finalUrl = new URL("/s", baseUrl.origin);

      // Adicionar parâmetro de busca
      if (searchQuery) {
        finalUrl.searchParams.set("q", searchQuery);
        finalUrl.searchParams.set("map", "ft");
      }

      // Adicionar todos os filtros aplicados
      for (const { key, value } of filters) {
        finalUrl.searchParams.set(`filter.${key}`, value);
      }

      // Adicionar parâmetros da URL base que não são filtros (como sort)
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

      // Remover parâmetro page se for 1 (padrão VTEX)
      if (finalUrl.searchParams.get("page") === "1") {
        finalUrl.searchParams.delete("page");
      }

      return finalUrl.pathname + finalUrl.search;
    } else {
      // Para página de categoria: manter formato VTEX original
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

function Filters({ filters, url }: Props) {
  const filteredFilters = filters.filter(
    (filter) => !(isToggle(filter) && filter.key === "price")
  );

  return (
    <ul
      class="flex flex-col gap-6 sm:p-0 divide-y divide-[#CCCCCC]"
      data-filters-container
    >
      {filteredFilters.filter(isToggle).map((filter) => (
        <li key={filter.key} class="flex flex-col gap-4 pt-4 px-4 xl:px-0">
          <span class="text-md font-medium text-[#1F251C]">{filter.label}</span>
          <div class="md:max-h-80 md:overflow-auto">
            <FilterValues {...filter} baseUrl={url} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Filters;
