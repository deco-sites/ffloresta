import { useId } from "../../../sdk/useId.ts";
import { useOffer } from "../../../sdk/useOffer.ts";
import { useSendEvent } from "../../../sdk/useSendEvent.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useDevice, useScript } from "@deco/deco/hooks";

import Filters from "../SearchResult/Filters.tsx";
import Breadcrumb from "../../ui/Breadcrumb.tsx";
import Drawer from "../../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import Icon from "../../../components/ui/Icon.tsx";
import FilterInteraction from "../../../islands/FilterInteraction.tsx";

import NotFound from "./NotFound.tsx";
import PageResult from "./PageResult.tsx";
import { setPageQuerystring } from "./hooks/usePageQueryString.ts";
import type { Props, SectionProps } from "./types/search.types.ts";

function Result(props: SectionProps) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial, bannerImage, seoConfig } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const categoryTitle = breadcrumb.itemListElement?.at(-1)?.name;
  const displayTitle = seoConfig?.pageTitle || categoryTitle;

  const seoText = props.seoText;

  console.log(seoConfig?.pageTitle, categoryTitle, displayTitle);

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...useOffer(product.offers),
            index: offset + index,
            product,
            breadcrumbList: breadcrumb,
          })
        ),
      },
    },
  });

  const results = (
    <span class="text-md text-[#1F251C] uppercase font-normal">
      {page.pageInfo.records} produtos encontrados
    </span>
  );

  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial ? (
          <PageResult {...props} />
        ) : (
          <>
            {/* Banner full width - fora do container */}
            {bannerImage && (
              <div class="w-full">
                <img
                  src={
                    device === "mobile"
                      ? bannerImage.mobile || bannerImage.desktop
                      : bannerImage.desktop || bannerImage.mobile
                  }
                  alt={bannerImage.altText}
                  class="w-full"
                />
              </div>
            )}

            {/* Restante do conteúdo dentro do container */}
            <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 lg:px-[4rem]">
              <Breadcrumb itemListElement={breadcrumb?.itemListElement} />

              {/* H1 */}
              {displayTitle && (
                <h1 class="text-2xl font-bold text-[#1F251C]">
                  {displayTitle}
                </h1>
              )}

              {device === "mobile" && (
                <Drawer
                  id={controls}
                  aside={
                    <div class="bg-white flex flex-col h-full w-full divide-y overflow-y-hidden">
                      <div class="flex justify-between items-center">
                        <h2 class="px-4 py-3">
                          <span class="font-medium text-2xl">Filtro</span>
                        </h2>
                        <label
                          class="btn btn-ghost cursor-pointer"
                          for={controls}
                        >
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <Filters filters={filters} url={url} />
                      </div>
                    </div>
                  }
                >
                  <div class="flex sm:hidden flex-col items-start">
                    <div class="flex">{results}</div>
                    <div class="w-full flex justify-between items-center gap-4 mt-5">
                      <div class="flex max-w-1/2 w-full">
                        <label
                          class="cursor-pointer w-full h-9 min-h9 max-h-9 p-0 rounded-none flex items-center justify-center gap-2 bg-[#c6cfba] text-[#323f2d] text-sm font-bold"
                          for={controls}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 4H14M10 4H3M21 12H12M8 12H3M21 20H16M12 20H3M14 2V6M8 10V14M16 18V22"
                              stroke="#323f2d"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Filtro
                        </label>
                      </div>
                      <div class="flex max-w-1/2 w-full">{sortBy}</div>
                    </div>
                  </div>
                </Drawer>
              )}

              <div class="grid grid-cols-1 sm:grid-cols-[250px_1fr] lg:gap-8">
                {device === "desktop" && (
                  <aside class="place-self-start flex flex-col gap-9 w-full">
                    <span class="text-base font-medium h-12 flex items-center text-md text-[#1F251C]">
                      Filtros
                    </span>
                    <Filters filters={filters} url={url} />
                  </aside>
                )}

                <div class="flex flex-col gap-9">
                  {device === "desktop" && (
                    <div class="flex justify-between items-center">
                      {results}
                      <div>{sortBy}</div>
                    </div>
                  )}

                  <PageResult {...props} />

                  {(seoText?.title || seoText?.description) && (
                    <div class="flex flex-col gap-2 sm:gap-3 text-[#1F251C] px-2 sm:px-0 pt-6 border-t border-[#C6CFBA]">
                      {seoText.title && (
                        <h2 class="text-[18px] sm:text-[20px] font-medium">
                          {seoText.title}
                        </h2>
                      )}
                      {seoText.description && (
                        <>
                          <div
                            id="seo-text-truncated"
                            class="seo-content text-[14px] sm:text-[16px] leading-relaxed line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: seoText.description,
                            }}
                          />
                          <div
                            id="seo-text-full"
                            class="seo-content text-[14px] sm:text-[16px] leading-relaxed hidden"
                            dangerouslySetInnerHTML={{
                              __html: seoText.description,
                            }}
                          />
                          <button
                            onclick="document.getElementById('seo-text-truncated').classList.toggle('hidden'); document.getElementById('seo-text-full').classList.toggle('hidden'); this.textContent = this.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';"
                            class="text-[#3A4332] font-bold text-sm hover:underline mt-2"
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
          </>
        )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container
          ),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .checkbox[data-selected="true"] {
            background-color: #1F251C !important;
            border-color: #1F251C !important;
          }
          .checkbox[data-selected="false"] {
            background-color: white !important;
            border-color: #CCCCCC !important;
          }
        `,
        }}
      />

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
            // Garantir que os filtros mantenham o estado visual correto
            function updateFilterStates() {
              const selectedCheckboxes = document.querySelectorAll('.checkbox[data-selected="true"]');
              selectedCheckboxes.forEach((checkbox) => {
                checkbox.classList.add('bg-[#1F251C]', 'border-[#1F251C]');
                checkbox.classList.remove('border-[#CCCCCC]', 'bg-white');
              });
              
              const unselectedCheckboxes = document.querySelectorAll('.checkbox[data-selected="false"]');
              unselectedCheckboxes.forEach((checkbox) => {
                checkbox.classList.remove('bg-[#1F251C]', 'border-[#1F251C]');
                checkbox.classList.add('border-[#CCCCCC]', 'bg-white');
              });
            }
            
            // Executar na carga inicial
            updateFilterStates();
            
            // Executar após mudanças do HTMX
            document.addEventListener('htmx:afterSwap', function() {
              setTimeout(updateFilterStates, 50);
            });
            
            // Executar após requisições do HTMX
            document.addEventListener('htmx:afterRequest', function() {
              setTimeout(updateFilterStates, 50);
            });
          `,
        }}
      />

      <FilterInteraction url={url} />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps) {
  if (!page || page.products.length === 0) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
    bannerImage: props.bannerImage,
    seoText: props.seoText,
    seoConfig: props.seoConfig,
  };
};

export default SearchResult;
