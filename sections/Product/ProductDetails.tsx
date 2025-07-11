import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
// import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import ProductDescription from "../../islands/ProductDescription.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
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

      <div
        class={clx(
          "container grid md:mt-16",
          "grid-cols-1 gap-9 py-0 px-4",
          "lg:grid-cols-2 lg:gap-11 lg:px-0",
        )}
      >
        <div class="">
          <ImageGallerySlider page={page} />
        </div>
        <div class="">
          <ProductInfo page={page} />
        </div>
      </div>

      <ProductDescription page={page} />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="580px" />;
