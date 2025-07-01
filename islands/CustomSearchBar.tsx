// islands/CustomSearchBar.tsx

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Icon from "../components/ui/Icon.tsx";
import { invoke } from "../runtime.ts";

export interface Props {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Mostrar sugestões de produtos
   * @default true
   */
  showProductSuggestions?: boolean;
  /**
   * @title Mostrar termos de busca
   * @default true
   */
  showSearchTerms?: boolean;
  /**
   * @title Nome da conta VTEX
   * @description Exemplo: 'minhaloja'
   */
  vtexAccount: string;
}

interface ProductSuggestion {
  productId: string;
  productName: string;
  link: string;
}

interface SearchTerm {
  term: string;
}

export default function CustomSearchBar({
  placeholder = "Buscar produtos...",
  showProductSuggestions = true,
  showSearchTerms = true,
  vtexAccount,
}: Props) {
  const query = useSignal("");
  const products = useSignal<ProductSuggestion[]>([]);
  const searchTerms = useSignal<SearchTerm[]>([]);
  const loading = useSignal(false);
  const focused = useSignal(false);
  const error = useSignal<string | null>(null);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      loading.value = true;
      error.value = null;

      // Chamada direta usando invoke do runtime.ts
      const [searchResponse, productsResponse] = await Promise.all([
        showSearchTerms
          ? invoke({
              key: "vtex/loaders/intelligentSearch/suggestions.ts",
              props: { query: searchQuery },
            })
          : Promise.resolve({ searches: [] }),

        showProductSuggestions
          ? invoke({
              key: "vtex/loaders/intelligentSearch/productSuggestions.ts",
              props: {
                query: searchQuery,
                count: 5,
                locale: "pt-BR",
              },
            })
          : Promise.resolve({ products: [] }),
      ]);

      searchTerms.value = searchResponse.searches || [];
      products.value =
        productsResponse.products?.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          link: p.link || `/s?q=${encodeURIComponent(p.productName)}`,
        })) || [];
    } catch (err) {
      console.error("Erro na busca:", err);
      error.value = "Erro ao carregar sugestões";
      searchTerms.value = [];
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    if (query.value.length > 2) {
      const timer = setTimeout(() => fetchSuggestions(query.value), 300);
      return () => clearTimeout(timer);
    } else {
      searchTerms.value = [];
      products.value = [];
    }
  }, [query.value]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const searchQuery = query.value.trim();
    if (searchQuery) {
      window.location.href = `/s?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const hasSuggestions = () =>
    (showProductSuggestions && products.value.length > 0) ||
    (showSearchTerms && searchTerms.value.length > 0);

  return (
    <div class="relative w-full max-w-xl">
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
          aria-label="Buscar produtos"
        />

        <button
          type="submit"
          class="btn join-item"
          aria-label="Buscar"
          disabled={loading.value}
        >
          {loading.value ? (
            <span class="loading loading-spinner loading-xs" />
          ) : (
            <Icon id="search" size={20} />
          )}
        </button>
      </form>

      {error.value && <div class="text-error text-sm mt-1">{error.value}</div>}

      {focused.value && hasSuggestions() && (
        <div class="absolute top-full left-0 right-0 bg-base-100 border border-base-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-auto">
          {/* Sugestões de Produtos */}
          {showProductSuggestions && products.value.length > 0 && (
            <div class="p-2">
              <h3 class="font-bold px-2 py-1">Produtos</h3>
              <ul>
                {products.value.map((product) => (
                  <li key={product.productId}>
                    <a
                      href={product.link}
                      class="block px-4 py-2 hover:bg-base-200 rounded"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {product.productName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Termos de Busca */}
          {showSearchTerms && searchTerms.value.length > 0 && (
            <div class="p-2 border-t border-base-200">
              <h3 class="font-bold px-2 py-1">Termos relacionados</h3>
              <ul>
                {searchTerms.value.map((term, index) => (
                  <li key={index}>
                    <a
                      href={`/s?q=${encodeURIComponent(term.term)}`}
                      class="block px-4 py-2 hover:bg-base-200 rounded"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {term.term}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
