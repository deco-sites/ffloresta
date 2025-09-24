import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";
import ProductSliderForBGShelf from "../../components/product/ProductSliderForBGShelf.tsx";

export interface BackgroundProps {
  desktop: {
    src: ImageWidget;
  };
  mobile: {
    src: ImageWidget;
  };
}

export interface Props {
  products: Product[] | null;
  background?: BackgroundProps;
  /** @description Vídeo MP4 para desktop (opcional) */
  desktopVideo?: string;
  /** @description Vídeo MP4 para mobile (opcional) */
  mobileVideo?: string;
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
}

export default function ProductShelfWithBackground({
  products,
  title,
  cta,
  background,
  desktopVideo,
  mobileVideo,
  icon,
}: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ),
      },
    },
  });

  return (
    <Section.Container {...viewItemListEvent} class="container">
      {/* Header Section - Sem background */}
      <Section.Header title={title} cta={cta} icon={icon} />

      {/* Shelf Section - Com background */}
      <div class="relative w-full py-12">
        {/* Background - Apenas na shelf */}
        {(background || desktopVideo || mobileVideo) && (
          <div class="absolute inset-0 z-0">
            {/* Mobile content */}
            <div class="block md:hidden w-full h-full">
              {mobileVideo ? (
                <video
                  class="w-full h-full object-cover"
                  autoplay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={mobileVideo} type="video/mp4" />
                  {background && (
                    <img
                      src={background.mobile.src}
                      alt="Prateleira de Produtos com Imagem de Fundo"
                      class="w-full h-full object-cover"
                    />
                  )}
                </video>
              ) : (
                background && (
                  <img
                    src={background.mobile.src}
                    alt="Prateleira de Produtos com Imagem de Fundo"
                    class="w-full h-full object-cover"
                  />
                )
              )}
            </div>
            
            {/* Desktop content */}
            <div class="hidden md:block w-full h-full">
              {desktopVideo ? (
                <video
                  class="w-full h-full object-cover"
                  autoplay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={desktopVideo} type="video/mp4" />
                  {background && (
                    <img
                      src={background.desktop.src}
                      alt="Prateleira de Produtos com Imagem de Fundo"
                      class="w-full h-full object-cover"
                    />
                  )}
                </video>
              ) : (
                background && (
                  <img
                    src={background.desktop.src}
                    alt="Prateleira de Produtos com Imagem de Fundo"
                    class="w-full h-full object-cover"
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Shelf Content - Overlay */}
        <div class="relative z-10">
          <ProductSliderForBGShelf
            products={products}
            itemListName={title}
            class="bg-transparent p-0"
          />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
  icon,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} icon={icon} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
