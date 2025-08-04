// islands/CustomSearchBar.tsx

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Icon from "../components/ui/Icon.tsx";
import { invoke } from "../runtime.ts";
import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { formatPrice } from "../sdk/format.ts";
import { relative } from "../sdk/url.ts";
import { useOffer } from "../sdk/useOffer.ts";

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

interface SearchTerm {
  term: string;
  count?: number;
}

function ProductCard({
  product,
  isMobile = false,
}: {
  product: Product;
  isMobile?: boolean;
}) {
  const { url, image: images, offers, name } = product;
  const [front] = images ?? [];
  const { listPrice, price } = useOffer(offers);
  const relativeUrl = relative(url);

  if (isMobile) {
    return (
      <div class="bg-white flex p-2 w-full border-solid border-[0.7px] border-[#8D98A0] font-['Lato']">
        {/* Imagem à esquerda */}
        <a href={relativeUrl} class="w-1/3 flex-shrink-0">
          <Image
            src={front?.url!}
            alt={front?.alternateName}
            width={80}
            height={80}
            class="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Nome e preço à direita */}
        <div class="ml-2 flex flex-col justify-center flex-grow">
          <a href={relativeUrl} class="block">
            <h3 class="text-[#3A4332] font-bold text-xs leading-tight uppercase line-clamp-2">
              {name}
            </h3>
            <div class="mt-1">
              {listPrice && price && listPrice > price && (
                <div class="text-[#8D98A0]">
                  <span class="font-bold text-xs line-through">
                    {formatPrice(listPrice, offers?.priceCurrency)}
                  </span>
                </div>
              )}
              <div class="text-[#3A4332]">
                <span class="font-bold text-sm">
                  {formatPrice(price, offers?.priceCurrency)}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // Versão desktop
  return (
    <div class="bg-white flex flex-col p-[12px_18px] w-full max-w-[258px] border-solid border-[0.7px] border-[#8D98A0] font-['Lato']">
      <figure class="relative">
        <a
          href={relativeUrl}
          aria-label="view product"
          class="grid grid-cols-1 grid-rows-1 w-full mt-10"
        >
          <Image
            src={front?.url!}
            alt={front?.alternateName}
            width={258}
            height={210}
            class="object-cover w-full col-span-full row-span-full"
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        </a>
      </figure>

      <div class="mt-2 flex flex-col flex-grow">
        <a href={relativeUrl} class="block">
          <h3 class="text-[#3A4332] text-[16px] leading-[137%] tracking-[0%] capitalize line-clamp-3 min-h-[66px]">
            {name}
          </h3>

          <div class="flex flex-col mt-1">
            {listPrice && price && listPrice > price && (
              <div class="text-[#8D98A0]">
                <span class="font-bold text-[10px] leading-[170%] tracking-[3%]">
                  R$
                </span>
                <span class="font-bold text-[14px] leading-[170%] tracking-[3%] line-through">
                  {formatPrice(listPrice, offers?.priceCurrency).replace(
                    "R$",
                    ""
                  )}
                </span>
              </div>
            )}
            <div class="text-[#3A4332]">
              <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
                R$
              </span>
              <span class="font-bold text-[18px] leading-[170%] tracking-[3%]">
                {formatPrice(price, offers?.priceCurrency).replace("R$", "")}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function CustomSearchBar({
  placeholder = "Buscar produtos...",
  showProductSuggestions = true,
  showSearchTerms = true,
  vtexAccount,
}: Props) {
  const query = useSignal("");
  const products = useSignal<Product[]>([]);
  const searchTerms = useSignal<SearchTerm[]>([]);
  const loading = useSignal(false);
  const focused = useSignal(false);
  const error = useSignal<string | null>(null);
  const isMobile = useSignal(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      isMobile.value = window.innerWidth < 768;
      const handleResize = () => {
        isMobile.value = window.innerWidth < 768;
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await invoke({
        key: "vtex/loaders/intelligentSearch/suggestions.ts",
        props: { query: searchQuery },
      });

      searchTerms.value = response.searches || [];
      products.value = response.products || [];
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
    <div class="relative w-full lg:max-w-[638px]">
      <div className="py-3 px-4 bg-[#3A4332] lg:p-0 lg:bg-transparent">
        <form
          onSubmit={handleSubmit}
          class="join w-full h-[36px] lg:h-9 bg-[#D9D9D9]"
        >
          <input
            class="input join-item flex-grow h-[36px] lg:h-9 rounded-none border-none outline-none focus:outline-none bg-[#D9D9D9] placeholder:text-[#1F251C] placeholder:font-['Lato']"
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
            class="btn join-item bg-[#D9D9D9] no-animation p-0 px-3 min-h-[unset] h-[36px] lg:h-9 lg:max-h-9 rounded-none border-none outline-none focus:outline-none hover:rounded-none hover:bg-[#D9D9D9] hover:no-animation"
            aria-label="Buscar"
            disabled={loading.value}
          >
            <Icon id="search" size={20} />
          </button>
        </form>
      </div>

      {error.value && <div class="text-error text-sm mt-1">{error.value}</div>}

      {focused.value && hasSuggestions() && (
        <div class="absolute top-full left-0 right-0 bg-white border border-base-200 rounded-none shadow-lg z-50 p-4 max-h-[638px] overflow-auto">
          <div class="flex flex-col md:flex-row gap-5">
            {/* Coluna de termos de busca */}
            {showSearchTerms && searchTerms.value.length > 0 && (
              <div class="w-full md:w-1/3 bg-white">
                <h3 class="font-bold text-lg mb-4">Termos de busca</h3>
                <ul class="space-y-1 md:space-y-2">
                  {(isMobile.value
                    ? searchTerms.value.slice(0, 3)
                    : searchTerms.value
                  ).map((term, index) => (
                    <li key={index}>
                      <a
                        href={`/s?q=${encodeURIComponent(term.term)}`}
                        class="block py-1 md:py-2 hover:bg-base-200 rounded"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <div class="flex justify-between items-center">
                          <span class="text-sm md:text-base text-capitalize">
                            {term.term}
                          </span>
                          {term.count && (
                            <span class="text-xs md:text-sm text-gray-500">
                              {term.count}
                            </span>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Coluna de produtos */}
            {showProductSuggestions && products.value.length > 0 && (
              <div class="flex-1 bg-white">
                <h3 class="font-bold text-lg mb-4">Produtos sugeridos</h3>
                <div class="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                  {products.value.slice(0, 2).map((product) => (
                    <ProductCard
                      key={product.productID}
                      product={product}
                      isMobile={isMobile.value}
                    />
                  ))}
                </div>
                <div class="text-center mt-4">
                  <a
                    href={`/s?q=${encodeURIComponent(query.value)}`}
                    class="inline-block px-4 py-2 bg-[#3A4332] text-white rounded-none hover:bg-[#2D3326] transition-colors text-sm md:text-base"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Ver mais produtos
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
