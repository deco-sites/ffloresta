import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../product/ProductCard/ProductCard.tsx";
import Filters from "../../components/search/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";

export interface Layout {
  pagination?: "show-more" | "pagination";
}

export interface SeoText {
  title?: string;
  description?: HTML;
}

export interface Props {
  page: ProductListingPage | null;
  layout?: Layout;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";
  bannerImage?: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
  seoText?: SeoText;
}

function NotFound() {
  return (
    <>
      <div className="container w-full flex justify-center items-center py-2 mt-20">
        <div className="mb-8">
          <div className="max-w-container w-full mx-auto px-4 flex flex-col items-center justify-center text-center py-12">
            <h1 className="text-[25px] leading-[25px] font-bold mb-6 uppercase">
              Oops! <br /> O item que você buscou não foi encontrado!
            </h1>
            <h2 className="uppercase mb-3">
              Mas não se preocupe, tente novamente utilizando nossas dicas:
            </h2>
            <ul className="mb-5">
              <li className="text-[13px] leading-[13px]">
                <span className="text-lg inline-block mr-1">•</span>{" "}
                Verifique se não há erro de digitação.
              </li>
              <li className="text-[13px] leading-[13px]">
                <span className="text-lg inline-block mr-1">•</span>{" "}
                Tente utilizar uma única palavra.
              </li>
              <li className="text-[13px] leading-[13px]">
                <span className="text-lg inline-block mr-1">•</span>{" "}
                Tente buscar por termos menos específicos e posteriormente use
                os filtros da busca.
              </li>
              <li className="text-[13px] leading-[13px]">
                <span className="text-lg inline-block mr-1">•</span>{" "}
                Procure utilizar sinônimos ao termo desejado.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="cursor-pointer"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            <div class="p-2 rounded-full bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] transition-all duration-300 hover:bg-[rgba(21,31,22,0.8)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 15L12 9L6 15"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-4", // Base
          "xl:grid-cols-4", // ≥1240px
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full w-[98%] shadow-[5.62px_5.62px_7.03px_0px_rgba(0,0,0,0.15)]"
          />
        ))}
      </div>

      <div class={clx("pt-5 sm:pt-10 w-full")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "cursor-pointer",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  {" "}
                  <div class="p-2 rounded-full bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] transition-all duration-300 hover:bg-[rgba(21,31,22,0.8)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document
    .getElementById(id)
    ?.querySelector("[data-product-list]");
  if (!element) return;

  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");

    for (const entry of entries) {
      if (entry.isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }

    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial, bannerImage } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const fallbackSeoText: SeoText = {
    title: typeof document !== "undefined" ? document.title : undefined,
    description: typeof document !== "undefined"
      ? document
        .querySelector("meta[name='description']")
        ?.getAttribute("content") ?? undefined
      : undefined,
  };

  const seoText = props.seoText ?? fallbackSeoText;

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
        {partial ? <PageResult {...props} /> : (
          <>
            {/* Banner full width - fora do container */}
            {bannerImage && (
              <div class="w-full">
                <img
                  src={device === "mobile"
                    ? bannerImage.mobile || bannerImage.desktop
                    : bannerImage.desktop || bannerImage.mobile}
                  alt={bannerImage.altText}
                  class="w-full"
                />
              </div>
            )}

            {/* Restante do conteúdo dentro do container */}
            <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 lg:px-[4rem]">
              <Breadcrumb itemListElement={breadcrumb?.itemListElement} />

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
                            class="text-[14px] sm:text-[16px] leading-relaxed line-clamp-3 [&_*]:text-[14px] [&_*]:sm:text-[16px] [&_*]:leading-relaxed [&_*]:text-[#1F251C]"
                            dangerouslySetInnerHTML={{
                              __html: seoText.description,
                            }}
                          />
                          <div
                            id="seo-text-full"
                            class="text-[14px] sm:text-[16px] leading-relaxed hidden [&_*]:text-[14px] [&_*]:sm:text-[16px] [&_*]:leading-relaxed [&_*]:text-[#1F251C]"
                            dangerouslySetInnerHTML={{
                              __html: seoText.description,
                            }}
                          />
                          <button
                            onclick="document.getElementById('seo-text-truncated').classList.toggle('hidden'); document.getElementById('seo-text-full').classList.toggle('hidden'); this.textContent = this.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';"
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
          </>
        )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
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
  };
};

export default SearchResult;
