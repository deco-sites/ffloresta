import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface BannerProps {
  desktop?: {
    src: ImageWidget;
    alt: string;
  };

  mobile?: {
    src: ImageWidget;
    alt: string;
  };
  href?: string;
}

export interface Props {
  products: Product[] | null;
  banner: BannerProps;
  /**
   * @description Orientação do layout
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
}

export default function ProductShelfWithBanner({
  products,
  title,
  cta,
  banner,
  orientation = "horizontal",
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
    <Section.Container {...viewItemListEvent} class="p-0 2xl:p-0">
      <div
        class={`flex gap-10 ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        } w-full  mx-auto lg:mx-0 xl:max-w-none`}
      >
        {/* Banner Section */}
        {banner && (
          <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
            <a href={banner.href} class="block">
              <picture>
                <source media="(max-width: 767px)" srcset={banner.mobile.src} />
                <source
                  media="(min-width: 768px)"
                  srcset={banner.desktop.src}
                />
                <img
                  src={banner.desktop.src}
                  alt={banner.desktop.alt}
                  class="w-full h-auto object-cover"
                />
              </picture>
            </a>
          </div>
        )}

        {/* Shelf Section */}
        <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
          <Section.Header title={title} cta={cta} icon={icon} />
          <ProductSlider products={products} itemListName={title} />
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
    <Section.Placeholder height="471px" />;
  </Section.Container>
);
