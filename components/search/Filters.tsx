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

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <div
        aria-checked={selected}
        class="checkbox rounded-none w-4 h-4 max-w-4 max-h-4"
      />
      <span class="text-md text-[#1F251C]">{label}</span>
      {/* {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>} */}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2`, flexDirection)}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <a href={url} rel="nofollow">
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
                label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              />
            )
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function formatPriceRange(min: number, max: number): string {
  const format = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return `R$ ${format(min)} - R$ ${format(max)}`;
}

function enhancePriceFilter(
  priceFilter: FilterToggle,
  currentUrl: string,
): FilterToggle {
  const priceValues: number[] = [];
  const url = new URL(currentUrl);

  // Get current price filters from URL
  const currentPriceFilters = url.searchParams.getAll("filter.price");

  priceFilter.values.forEach((item) => {
    const range = item.value.split(":").map(Number);
    if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
      priceValues.push(range[0], range[1]);
    }
  });

  if (priceValues.length === 0) return priceFilter;

  const priceRanges = [
    { min: 20, max: 49.99, label: "R$ 20,00 - R$ 49,99" },
    { min: 50, max: 99.99, label: "R$ 50,00 - R$ 99,99" },
    { min: 100, max: 199.99, label: "R$ 100,00 - R$ 199,99" },
    { min: 200, max: 499.99, label: "R$ 200,00 - R$ 499,99" },
    { min: 500, max: 999.99, label: "R$ 500,00 - R$ 999,99" },
    { min: 1000, max: 1999.99, label: "R$ 1.000,00 - R$ 1.999,99" },
    { min: 2000, max: 4999.99, label: "R$ 2.000,00 - R$ 4.999,99" },
    { min: 5000, max: Infinity, label: "Acima de R$ 5.000,00" },
  ];

  const enhancedValues = priceRanges
    .filter((range) => range.min < Math.max(...priceValues))
    .map((range) => {
      let quantity = 0;
      priceFilter.values.forEach((item) => {
        const [from, to] = item.value.split(":").map(Number);
        if (!isNaN(from) && !isNaN(to)) {
          if (
            (from >= range.min && from < range.max) ||
            (to > range.min && to <= range.max) ||
            (from <= range.min && to >= range.max)
          ) {
            quantity += item.quantity;
          }
        }
      });

      const maxValue = range.max === Infinity
        ? Math.max(...priceValues)
        : range.max;
      const value = `${range.min}:${maxValue}`;

      // Create URL with current filters and toggle price filter
      const newUrl = new URL(currentUrl);
      const priceParams = newUrl.searchParams.getAll("filter.price");

      // Remove all existing price filters
      newUrl.searchParams.delete("filter.price");

      // Add all other filters back
      for (const [key, val] of url.searchParams.entries()) {
        if (key !== "filter.price") {
          newUrl.searchParams.append(key, val);
        }
      }

      // Check if this price range is currently selected
      const isSelected = currentPriceFilters.includes(value);

      // If not selected, add this price filter
      if (!isSelected) {
        newUrl.searchParams.append("filter.price", value);
      }

      return {
        value,
        quantity: Math.max(1, quantity),
        selected: isSelected,
        url: newUrl.toString(),
        label: range.label,
      };
    });

  if (enhancedValues.length === 0) {
    const value = `0:${Math.max(...priceValues)}`;
    const newUrl = new URL(currentUrl);
    newUrl.searchParams.delete("filter.price");
    newUrl.searchParams.append("filter.price", value);

    return {
      ...priceFilter,
      values: [
        {
          value,
          quantity: 1,
          selected: currentPriceFilters.includes(value),
          url: newUrl.toString(),
          label: `R$ 0,00 - R$ ${Math.max(...priceValues).toFixed(2)}`,
        },
      ],
    };
  }

  return {
    ...priceFilter,
    values: enhancedValues,
  };
}

function Filters({ filters, url }: Props) {
  const enhancedFilters = filters.map((filter) => {
    if (isToggle(filter) && filter.key === "price") {
      return enhancePriceFilter(filter, url);
    }
    return filter;
  });

  return (
    <ul class="flex flex-col gap-6 sm:p-0 divide-y divide-[#CCCCCC]">
      {enhancedFilters.filter(isToggle).map((filter) => (
        <li class="flex flex-col gap-4 pt-4 px-4 xl:px-0">
          <span class="text-md font-medium text-[#1F251C]">{filter.label}</span>
          <div class="md:max-h-80 md:overflow-auto">
            <FilterValues {...filter} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Filters;
