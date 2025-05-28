import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface BackgroundProps {
  desktop: {
    src: ImageWidget;
  };
  mobile: {
    src: ImageWidget;
  };
}

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  background?: BackgroundProps;
}

export default function ProductShelfWithBackground({
  products,
  title,
  cta,
  background,
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
    <Section.Container {...viewItemListEvent}>
      {/* Header Section - Sem background */}
      <Section.Header title={title} cta={cta} />

      {/* Shelf Section - Com background */}
      <div class="relative w-full py-12">
        {/* Background Image - Apenas na shelf */}
        {background && (
          <div class="absolute inset-0 z-0">
            <picture>
              <source
                media="(max-width: 767px)"
                srcset={background.mobile.src}
              />
              <source
                media="(min-width: 768px)"
                srcset={background.desktop.src}
              />
              <img
                src={background.desktop.src}
                alt={background.desktop.alt}
                class="w-full h-full object-cover"
              />
            </picture>
          </div>
        )}

        {/* Shelf Content - Overlay */}
        <div class="relative z-10">
          <ProductSlider
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
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
