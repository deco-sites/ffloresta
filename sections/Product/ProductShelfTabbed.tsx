import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget } from "apps/admin/widgets.ts";

interface Tab {
  title: string;
  products: Product[] | null;
}
export interface Props {
  tabs: Tab[];
  /** @hide true */
  tabIndex?: number;

  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
  headerBanner?: ImageWidget;
}
export default function TabbedProductShelf({
  tabs,
  title,
  cta,
  tabIndex,
  icon,
  headerBanner,
}: Props) {
  const ti = typeof tabIndex === "number"
    ? Math.min(Math.max(tabIndex, 0), tabs.length)
    : 0;
  const { products } = tabs[ti];
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products?.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ) ?? [],
      },
    },
  });
  return (
    <Section.Container {...viewItemListEvent}>
      <Section.Header
        title={title}
        cta={cta}
        icon={icon}
        headerBanner={headerBanner}
      />

      <Section.Tabbed>
        {!products?.length
          ? (
            <div class="flex justify-center items-center">
              No Products found
            </div>
          )
          : <ProductSlider products={products} itemListName={title} />}
      </Section.Tabbed>
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

    <Section.Tabbed>
      <>
        <Section.Placeholder height="471px" />;
      </>
    </Section.Tabbed>
  </Section.Container>
);
