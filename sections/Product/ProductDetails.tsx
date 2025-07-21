import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
// import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import ProductDescription from "../../islands/ProductDescription.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { type LoadingFallbackProps } from "@deco/deco";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  productBanner?: ImageWidget;
}

export default function ProductDetails({ page, productBanner }: Props) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Página não encontrada!</span>
          <a href="/" class="btn no-animation">
            Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="w-full flex flex-col">
      {/* <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} /> */}
      {productBanner && (
        <div class="block lg:hidden my-5">
          <img src={productBanner} alt={page.productName} class="w-full" />
        </div>
      )}
      <div
        class={clx(
          "container grid md:mt-16",
          "grid-cols-1 gap-9 py-0 px-4",
          "lg:grid-cols-[1fr_380px] lg:gap-11 lg:px-0",
        )}
      >
        <div class="w-full flex flex-col">
          <ImageGallerySlider page={page} />
        </div>
        <div class="h-fit px-5 pb-4 shadow-[5.62px_5.62px_7.03px_0px_rgba(0,0,0,0.15)] mb-10 lg:mb-40">
          {productBanner && (
            <div class="hidden lg:block mb-5">
              <img src={productBanner} alt={page.productName} class="w-full" />
            </div>
          )}
          <ProductInfo page={page} />
        </div>
      </div>

      <ProductDescription page={page} />
    </div>
  );
}

export const LoadingFallback = ({
  page,
  productBanner,
}: LoadingFallbackProps<Props>) => <Section.Placeholder height="580px" />;
