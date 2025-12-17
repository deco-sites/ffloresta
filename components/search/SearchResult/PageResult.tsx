import { clx } from "../../../sdk/clx.ts";
import { useSection } from "@deco/deco/hooks";
import ProductCard from "../../product/ProductCard/ProductCard.tsx";
import { useUrlRebased } from "./hooks/useUrlRebased.ts";
import type { SectionProps } from "./types/search.types.ts";

interface PageResultProps {
  startingPage?: number;
  url: string;
  partial?: SectionProps["partial"];
  page: SectionProps["page"];
}

export default function PageResult(props: PageResultProps) {
  const { startingPage = 0, url, partial } = props;
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
          "grid-cols-2 gap-4",
          "xl:grid-cols-4",
          "w-full"
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
        <div class="flex justify-center [&_section]:contents">
          <a
            rel="next"
            class={clx(
              "cursor-pointer",
              (!nextPageUrl || partial === "hideMore") && "hidden"
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
      </div>
    </div>
  );
}
