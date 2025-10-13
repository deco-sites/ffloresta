import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { h } from "preact";

interface Props {
  filters: ProductListingPage["filters"];
  url: string;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

// 🔧 Converter query params (?filter.xxx=) em path VTEX (/xxx/yyy?map=a,b)
function convertToVtexPath(url: string, base: string): string {
  try {
    const targetUrl = new URL(url, base);

    // Coletar filtros aplicados
    const filters: { key: string; value: string }[] = [];
    for (const [key, value] of targetUrl.searchParams.entries()) {
      if (key.startsWith("filter.")) {
        filters.push({ key: key.replace("filter.", ""), value });
      }
    }

    // Limpar query string
    targetUrl.search = "";

    // Construir pathname e map
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

    // Se não tiver categoria, usar o primeiro filtro como initialQuery
    if (!initialQuery && filters.length > 0) {
      initialQuery = filters[0].value;
    }

    // Atualizar pathname
    targetUrl.pathname = pathname || targetUrl.pathname;

    // Adicionar parâmetros obrigatórios VTEX
    if (initialQuery) {
      targetUrl.searchParams.set("initialMap", "c");
      targetUrl.searchParams.set("initialQuery", initialQuery);
    }
    if (map.length > 0) {
      targetUrl.searchParams.set("map", map.join(","));
    }

    // Sempre resetar para página 1 quando filtros mudarem
    targetUrl.searchParams.set("page", "1");

    return targetUrl.pathname + "?" + targetUrl.searchParams.toString();
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
  const href = convertToVtexPath(url, baseUrl);

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
            : "border-[#CCCCCC] bg-white",
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
          selected ? "text-[#1F251C] font-medium" : "text-[#1F251C]",
        )}
      >
        {label}
      </span>
      {/* {quantity && <span class="text-sm text-gray-500">({quantity})</span>} */}
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
              <a href={convertToVtexPath(url, baseUrl)} rel="nofollow">
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
                  label={`${formatPrice(range.from)} - ${
                    formatPrice(
                      range.to,
                    )
                  }`}
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
    (filter) => !(isToggle(filter) && filter.key === "price"),
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
