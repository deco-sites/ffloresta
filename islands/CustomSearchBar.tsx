// islands/SearchbarIsland.tsx

import { Suggestion } from "apps/commerce/types.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Icon from "../components/ui/Icon.tsx";
import { invoke } from "../runtime.ts";

export interface CustomSearchBarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /** @description Path to loader */
  loader: string;
}

export default function SearchbarIsland({
  placeholder = "O que você está procurando?",
  loader,
}: Props) {
  const query = useSignal("");
  const suggestions = useSignal<Suggestion | null>(null);
  const loading = useSignal(false);
  const focused = useSignal(false);

  // Busca sugestões quando o query muda
  useEffect(() => {
    if (query.value.length > 0) {
      loading.value = true;
      const timer = setTimeout(async () => {
        try {
          const data = await invoke[
            "deco-sites/std"
          ].loaders.vtex.intelligentSearch.suggestions({
            query: query.value,
            count: 5,
          });
          suggestions.value = data;
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
          suggestions.value = null;
        } finally {
          loading.value = false;
        }
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timer);
    } else {
      suggestions.value = null;
    }
  }, [query.value]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (query.value) {
      window.location.href = `/s?q=${encodeURIComponent(query.value)}`;
    }
  };

  return (
    <div class="relative w-full max-w-[500px]">
      <form onSubmit={handleSubmit} class="join w-full">
        <input
          class="input input-bordered join-item flex-grow"
          name="q"
          placeholder={placeholder}
          value={query.value}
          onInput={(e) => (query.value = e.currentTarget.value)}
          onFocus={() => (focused.value = true)}
          onBlur={() => setTimeout(() => (focused.value = false), 200)}
          autocomplete="off"
        />
        <button
          type="submit"
          class="btn join-item"
          aria-label="Search"
          disabled={loading.value}
        >
          {loading.value ? (
            <span class="loading loading-spinner loading-xs" />
          ) : (
            <Icon id="search" size={24} />
          )}
        </button>
      </form>

      {/* Sugestões */}
      {focused.value && suggestions.value && (
        <div class="absolute top-full left-0 right-0 bg-base-100 border border-base-200 rounded-b-lg shadow-lg z-10 mt-1">
          <ul class="menu">
            {suggestions.value.products?.map((product) => (
              <li>
                <a
                  href={product.url}
                  class="hover:bg-base-200"
                  key={product.productId}
                >
                  {product.name}
                </a>
              </li>
            ))}
            {suggestions.value.searches?.map((search) => (
              <li>
                <a
                  href={`/s?q=${encodeURIComponent(search.term)}`}
                  class="hover:bg-base-200"
                  key={search.term}
                >
                  {search.term}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
