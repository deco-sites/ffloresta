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

export interface BannerProps {
  desktop: {
    src: ImageWidget;
    alt: string;
  };

  mobile: {
    src: ImageWidget;
    alt: string;
  };
  href?: string;
}

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
  banner: BannerProps;
  /**
   * @description Orientação do layout
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}

export default function ProductShelfWithBanner({
  products,
  title,
  cta,
  banner,
  orientation = "horizontal",
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
      <div
        class={`flex gap-10 ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        } w-full max-w-[1240px] mx-auto lg:mx-0 xl:max-w-none xl:px-0`}
      >
        {/* Banner Section */}
        <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
          <a href={banner.href} class="block">
            <picture>
              <source media="(max-width: 767px)" srcset={banner.mobile.src} />
              <source media="(min-width: 768px)" srcset={banner.desktop.src} />
              <img
                src={banner.desktop.src}
                alt={banner.desktop.alt}
                class="w-full h-auto object-cover"
              />
            </picture>
          </a>
        </div>

        {/* Shelf Section */}
        <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
          <Section.Header title={title} cta={cta} />
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
