import { ImageWidget } from "apps/admin/widgets.ts";
import BrandGridIsland from "../../islands/BrandGrid.tsx";

/**
 * @titleBy label
 */
export interface BrandItem {
  image: ImageWidget;
  href: string;
  label?: string;
}

export interface Props {
  brands?: BrandItem[];
  title?: string;
  cta?: {
    text?: string;
    href?: string;
  };
  icon?: ImageWidget;
}

export default function BrandGrid({ brands = [], title, cta, icon }: Props) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div>
      <BrandGridIsland
        items={brands}
        title={title}
        cta={cta?.text}
        icon={icon}
      />
    </div>
  );
}
