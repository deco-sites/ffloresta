import type { ProductListingPage } from "apps/commerce/types.ts";
import { type SectionProps } from "@deco/deco";
import ProductCard from "../../components/product/ProductCard/ProductCard.tsx";
import Filters from "../../components/search/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice } from "@deco/deco/hooks";
import { ImageWidget } from "apps/admin/widgets.ts";
import PaginationButtons from "../../islands/Search/PaginationButtons.tsx";

export interface SeoText {
  title?: string;
  description?: string;
}

export interface Props {
  page: ProductListingPage | null;
  categoryBanner?: {
    desktop: ImageWidget;
    mobile: ImageWidget;
  };
  filterBanner?: {
    desktop: ImageWidget;
    mobile: ImageWidget;
  };
  seoText?: SeoText;
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Página não encontrada!</span>
    </div>
  );
}

export default function SearchResult(props: SectionProps<typeof loader>) {
  const device = useDevice();
  const { page, categoryBanner, filterBanner, seoText } = props;

  if (!page) return <NotFound />;

  console.log(page.pageInfo, "page.products");

  return (
    <div class="w-full lg:mt-[-15px]">
      {/* Desktop: Breadcrumb -> Banner */}
      <div class="hidden lg:flex flex-col">
        {categoryBanner && (
          <div class="w-full my-4">
            <img
              src={categoryBanner.desktop || ""}
              alt="Categoria"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}

        {page.breadcrumb?.itemListElement && (
          <div class="container px-5 lg:px-[4rem] pt-4 sm:pt-5">
            <Breadcrumb itemListElement={page.breadcrumb?.itemListElement} />
          </div>
        )}
      </div>

      <div class="lg:hidden flex flex-col">
        <div class="container px-5 lg:px-[4rem] pt-4 sm:pt-5">
          <Breadcrumb itemListElement={page.breadcrumb?.itemListElement} />
        </div>
        {categoryBanner && (
          <div class="w-full my-4">
            <img
              src={categoryBanner.mobile || ""}
              alt="Categoria"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 lg:px-[4rem]">
        {/* Mobile Filters Drawer */}
        {device === "mobile" && (
          <Drawer
            id="mobile-filters"
            aside={
              <div class="bg-white flex flex-col h-full w-full divide-y overflow-y-hidden">
                <div class="flex justify-between items-center">
                  <h1 class="px-4 py-3">
                    <span class="font-medium text-2xl">Filtro</span>
                  </h1>
                  <label
                    class="btn btn-ghost cursor-pointer"
                    for="mobile-filters"
                  >
                    <Icon id="close" size={24} />
                  </label>
                </div>
                <div class="flex-grow overflow-auto">
                  <Filters filters={page.filters} />
                </div>
              </div>
            }
          >
            <div class="flex sm:hidden flex-col items-start w-full">
              <div class="w-full flex justify-between items-center gap-4 mt-5">
                <div class="flex w-1/2">
                  <label
                    class="cursor-pointer w-full h-9 min-h9 max-h-9 p-0 rounded-none flex items-center justify-center gap-2 bg-[#c6cfba] text-[#323f2d] text-sm font-bold"
                    for="mobile-filters"
                  >
                    Filtro
                  </label>
                </div>
                <div class="flex w-1/2">
                  <Sort sortOptions={page.sortOptions} url={props.url} />
                </div>
              </div>
            </div>
          </Drawer>
        )}

        <div class="grid grid-cols-1 sm:grid-cols-[250px_1fr] lg:gap-8">
          {/* Desktop Filters */}
          {device === "desktop" && (
            <aside class="place-self-start flex flex-col gap-9 w-full">
              <span class="text-base font-medium h-12 flex items-center text-md text-[#1F251C]">
                Filtro
              </span>
              <Filters filters={page.filters} />
              {filterBanner && (
                <img
                  src={filterBanner.desktop}
                  alt="Filtro banner"
                  class="w-full rounded mt-4"
                />
              )}
            </aside>
          )}

          {/* Product Gallery */}
          <div class="flex flex-col gap-9">
            {/* Results Header */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span class="text-md text-[#1F251C] font-normal w-full">
                {page.pageInfo.records} produtos encontrados
              </span>
              {device === "desktop" && page.sortOptions.length > 0 && (
                <div class="w-full">
                  <Sort sortOptions={page.sortOptions} url={props.url} />
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div
              class={`
                grid grid-cols-2 gap-4
                sm:grid-cols-3
                lg:grid-cols-4
                w-full
              `}
            >
              {page.products?.map((product, index) => (
                <ProductCard
                  key={`product-card-${product.productID}`}
                  product={product}
                  preload={index === 0}
                  index={index}
                  class="h-[98%] w-[98%] shadow-[5px_5px_7px_0px_rgba(0,0,0,0.15)]"
                />
              ))}
            </div>

            {/* Pagination Buttons */}
            {page.pageInfo &&
              page.pageInfo.records > page.pageInfo.recordPerPage && (
                <PaginationButtons
                  currentPage={page.pageInfo.currentPage}
                  records={page.pageInfo.records}
                  recordPerPage={page.pageInfo.recordPerPage}
                />
              )}

            {/* SEO Text */}
            {(seoText?.title || seoText?.description) && (
              <div class="flex flex-col gap-2 sm:gap-3 text-[#1F251C] px-2 sm:px-0 pt-8 border-t border-[#CCCCCC]">
                {seoText.title && (
                  <h2 class="text-[18px] sm:text-[20px] font-medium">
                    {seoText.title}
                  </h2>
                )}
                {seoText.description && (
                  <>
                    <p
                      id="seo-text-truncated"
                      class="text-[14px] sm:text-[16px] leading-relaxed line-clamp-3"
                    >
                      {seoText.description}
                    </p>
                    <p
                      id="seo-text-full"
                      class="text-[14px] sm:text-[16px] leading-relaxed hidden"
                    >
                      {seoText.description}
                    </p>
                    <button
                      onclick="
                        const truncated = document.getElementById('seo-text-truncated');
                        const full = document.getElementById('seo-text-full');
                        truncated.classList.toggle('hidden');
                        full.classList.toggle('hidden');
                        this.textContent = this.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';
                      "
                      class="text-[#3A4332] font-bold text-sm hover:underline"
                    >
                      Ver mais
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};
