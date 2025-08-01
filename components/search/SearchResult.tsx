// SearchResult.tsx
import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard/ProductCard.tsx";
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

export interface Layout {
  pagination?: "show-more" | "pagination";
}

export interface SeoText {
  title?: string;
  description?: string;
}

export interface Props {
  page: ProductListingPage | null;
  /**
   * @title Banner de Categoria
   */
  topBanner?: {
    desktop: ImageWidget;
    mobile: ImageWidget;
  };
  /**
   * @title Configurações de Layout
   */
  layout?: Layout;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";
  bannerImage?: ImageWidget;
  /**
   * @title Texto de Seo
   */
  seoText?: SeoText;
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
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
          (!prevPageUrl || partial === "hideLess") && "hidden"
        )}
      >
        <a
          rel="prev"
          class="w-full p-3 bg-[#3A4332] text-[#97A37F] font-['FS_Emeric'] h-8 flex items-center justify-center font-bold text-[14.06px] leading-[170%] tracking-[16%] hover:bg-[#293023] cursor-pointer transition"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">Mostrar menos</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-4",
          "lg:grid-cols-3",
          "2xl:grid-cols-4",
          "w-full"
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full w-[98%] shadow-[5px_5px_7px_0px_rgba(0,0,0,0.15)]"
          />
        ))}
      </div>

      <div class={clx("pt-5 sm:pt-10 w-full")}>
        {infinite ? (
          <div class="flex justify-center [&_section]:contents">
            <a
              rel="next"
              class={clx(
                "w-full p-3 bg-[#3A4332] text-[white] h-8 flex items-center justify-center font-bold text-[14.06px] leading-[170%] tracking-[16%] hover:bg-[#293023] cursor-pointer transition",
                (!nextPageUrl || partial === "hideMore") && "hidden"
              )}
              hx-swap="outerHTML show:parent:top"
              hx-get={partialNext}
            >
              <span class="inline [.htmx-request_&]:hidden font-['FS_Emeric']">
                Mostrar mais
              </span>
              <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
            </a>
          </div>
        ) : (
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
  const {
    startingPage = 0,
    url,
    partial,
    bannerImage,
    topBanner,
    page: pageProp,
  } = props;

  const page = pageProp!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const fallbackSeoText: SeoText = {
    title: typeof document !== "undefined" ? document.title : undefined,
    description:
      typeof document !== "undefined"
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
    <span class="text-md text-[#1F251C] font-['FS_Emeric'] uppercase font-normal">
      {page.pageInfo.records} produtos encontrados
    </span>
  );

  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <div
      id={container}
      {...viewItemListEvent}
      class="w-full mt:0 2xl:mt-[52px]"
    >
      <div class="container px-5 lg:px-[4rem] pt-4 sm:pt-5">
        <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
      </div>

      {topBanner && (
        <div class="w-full my-4">
          <picture>
            <source media="(max-width: 767px)" srcSet={topBanner.mobile} />
            <img
              src={topBanner.desktop}
              alt="Categoria"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </picture>
        </div>
      )}

      <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 lg:px-[4rem]">
        {device === "mobile" && (
          <Drawer
            id={controls}
            aside={
              <div class="bg-white flex flex-col h-full w-full divide-y overflow-y-hidden">
                <div class="flex justify-between items-center">
                  <h1 class="px-4 py-3">
                    <span class="font-medium text-2xl">Filtro</span>
                  </h1>
                  <label class="btn btn-ghost cursor-pointer" for={controls}>
                    <Icon id="close" />
                  </label>
                </div>
                <div class="flex-grow overflow-auto">
                  <Filters filters={filters} />
                </div>
              </div>
            }
          >
            <div class="flex sm:hidden flex-col items-start">
              <div class="flex">{results}</div>
              <div class="w-full flex justify-between items-center gap-4 mt-5">
                <div class="flex max-w-1/2 w-full">
                  <label
                    class="cursor-pointer w-full h-9 min-h9 max-h-9 p-0 rounded-none flex items-center justify-center gap-2 bg-[#c6cfba] text-[#323f2d] font-['FS_Emeric'] text-sm font-bold uppercase"
                    for={controls}
                  >
                    Filtro
                  </label>
                </div>
                <div class="flex max-w-1/2 w-full font-['FS_Emeric']">
                  {sortBy}
                </div>
              </div>
            </div>
          </Drawer>
        )}

        <div class="grid grid-cols-1 sm:grid-cols-[250px_1fr] lg:gap-8">
          {device === "desktop" && (
            <aside class="place-self-start flex flex-col gap-9 w-full">
              <span class="text-base font-medium h-12 flex items-center text-md text-[#1F251C]">
                Filtro
              </span>
              <Filters filters={filters} />
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
              <div class="flex flex-col gap-2 sm:gap-3 text-[#1F251C] font-['FS_Emeric'] px-2 sm:px-0 pt-8 border-t border-[#CCCCCC]">
                {seoText.title && (
                  <h2 class="text-[18px] font-['FS_Emeric'] sm:text-[20px] font-medium">
                    {seoText.title}
                  </h2>
                )}
                {seoText.description && (
                  <>
                    <p
                      id="seo-text-truncated"
                      class="text-[14px] sm:text-[16px] font-['FS_Emeric'] leading-relaxed line-clamp-3"
                    >
                      {seoText.description}
                    </p>
                    <p
                      id="seo-text-full"
                      class="text-[14px] sm:text-[16px] font-['FS_Emeric'] leading-relaxed hidden"
                    >
                      {seoText.description}
                    </p>
                    <button
                      onclick="document.getElementById('seo-text-truncated').classList.toggle('hidden'); document.getElementById('seo-text-full').classList.toggle('hidden'); this.textContent = this.textContent === 'Ver mais' ? 'Ver menos' : 'Ver mais';"
                      class="text-[#3A4332] font-['FS_Emeric'] font-bold text-sm hover:underline"
                    >
                      Ver mais
                    </button>
                  </>
                )}
              </div>
            )}

            {device === "mobile" && bannerImage && (
              <img
                src={bannerImage}
                alt="banner categoria"
                class="w-full rounded"
              />
            )}
          </div>
        </div>
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
    </div>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
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
