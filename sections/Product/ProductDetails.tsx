import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import ProductDescription from "../../islands/ProductDescription.tsx";
import { type LoadingFallbackProps } from "@deco/deco";
import PromoCountdownIsland from "../../islands/ProductPagePromoBanner.tsx";
import type { ImageWidget as Image } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Benefits from "../Content/Benefits.tsx";

interface Benefit {
  benefitImgSrc: Image;
  benefitImgAltText: string;
  benefitText: HTML;
  benefitLink?: string;
}

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  productBanner?: {
    image: Image;
    /** @description Data de termino da Promoção em ISO completo: YYYY-MM-DDTHH:mm:ss.sssZ  */
    countdownDate: string;
    title: string;
    promoName: string;
  };
  benefits?: Benefit[];
}

export default function ProductDetails({
  page,
  productBanner,
  benefits,
}: Props) {
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
      <div class="block lg:hidden mt-6">
        {productBanner && <PromoCountdownIsland {...productBanner} />}
      </div>

      <div class="container mt-6">
        <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
      </div>

      <div
        class={clx(
          "container grid md:mt-8",
          "grid-cols-1 gap-9 py-0",
          "lg:grid-cols-[1fr_380px] lg:gap-11"
        )}
      >
        <div class="w-full flex flex-col">
          <ImageGallerySlider page={page} />
          {benefits && <Benefits benefits={benefits} />}
        </div>
        <div class="h-fit px-5 pb-4 shadow-[5.62px_5.62px_7.03px_0px_rgba(0,0,0,0.15)] mb-10 lg:mb-40">
          {productBanner && (
            <div class="hidden lg:block mb-5">
              {productBanner && <PromoCountdownIsland {...productBanner} />}
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
