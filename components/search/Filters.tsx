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

// Função para converter URL de query parameters para formato de caminho VTEX
function convertToVtexPath(url: string, base: string): string {
  try {
    const urlObj = new URL(url, base);
    const baseUrlObj = new URL(base);

    // Manter apenas o caminho base original (remover duplicações)
    const basePathParts = baseUrlObj.pathname.split("/").filter(Boolean);
    const searchParams = new URLSearchParams(urlObj.search);

    // Processar filtros
    const filters: Record<string, string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("filter.")) {
        const filterKey = key.replace("filter.", "");
        if (!filters[filterKey]) {
          filters[filterKey] = [];
        }
        // Evitar valores duplicados
        if (!filters[filterKey].includes(value)) {
          filters[filterKey].push(value);
        }
      }
    }

    // Criar novo caminho baseado no caminho original + valores dos filtros
    const newPathParts = [...basePathParts];

    // Adicionar valores dos filtros ao caminho (apenas valores únicos)
    for (const [key, values] of Object.entries(filters)) {
      for (const value of values) {
        const encodedValue = encodeURIComponent(value);
        // Evitar adicionar valores que já estão no caminho base
        if (!newPathParts.includes(encodedValue)) {
          newPathParts.push(encodedValue);
        }
      }
    }

    // Manter parâmetros iniciais da VTEX
    const vtexParams = new URLSearchParams();
    if (searchParams.has("initialMap"))
      vtexParams.set("initialMap", searchParams.get("initialMap")!);
    if (searchParams.has("initialQuery"))
      vtexParams.set("initialQuery", searchParams.get("initialQuery")!);

    // Construir parâmetro map apenas com filtros aplicados
    const mapParts = [];
    for (const [key, values] of Object.entries(filters)) {
      for (let i = 0; i < values.length; i++) {
        mapParts.push(key);
      }
    }
    if (mapParts.length > 0) {
      vtexParams.set("map", mapParts.join(","));
    }

    // Manter outros parâmetros importantes como page
    if (searchParams.has("page")) {
      vtexParams.set("page", searchParams.get("page")!);
    }

    return `/${newPathParts.join("/")}${
      vtexParams.toString() ? "?" + vtexParams.toString() : ""
    }`;
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
    <a href={href} rel="nofollow" class="flex items-center gap-2">
      <div
        aria-checked={selected}
        class={clx(
          "checkbox rounded-none w-4 h-4 max-w-4 max-h-4 border border-[#CCCCCC]",
          selected && "bg-[#1F251C] border-[#1F251C]"
        )}
      />
      <span class="text-md text-[#1F251C]">{label}</span>
      {quantity && <span class="text-sm text-gray-500">({quantity})</span>}
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
            <a href={convertToVtexPath(url, baseUrl)} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return (
            range && (
              <ValueItem
                {...item}
                baseUrl={baseUrl}
                label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              />
            )
          );
        }

        return <ValueItem {...item} baseUrl={baseUrl} />;
      })}
    </ul>
  );
}

function Filters({ filters, url }: Props) {
  const filteredFilters = filters.filter(
    (filter) => !(isToggle(filter) && filter.key === "price")
  );

  return (
    <ul class="flex flex-col gap-6 sm:p-0 divide-y divide-[#CCCCCC]">
      {filteredFilters.filter(isToggle).map((filter) => (
        <li class="flex flex-col gap-4 pt-4 px-4 xl:px-0">
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
