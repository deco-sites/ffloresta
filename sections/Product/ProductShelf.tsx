import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  products: Product[] | null;
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
  headerBanner?: ImageWidget;
}

export default function ProductShelf({
  products,
  title,
  cta,
  icon,
  headerBanner,
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
      <div class="w-full mx-auto lg:mx-0 xl:max-w-none">
        <div class="px-4 lg:px-0">
          <Section.Header
            title={title}
            cta={cta}
            icon={icon}
            headerBanner={headerBanner}
          />
        </div>
        <div class="mt-14">
          <ProductSlider products={products} itemListName={title} />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
  icon,
  headerBanner,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header
      title={title}
      cta={cta}
      icon={icon}
      headerBanner={headerBanner}
    />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
