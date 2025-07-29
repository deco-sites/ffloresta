/** @jsxImportSource preact */

import { ImageWidget } from "apps/admin/widgets.ts";
import PromoCountdownIsland from "../../islands/PromoCountdownIsland.tsx";

export interface Props {
  image: ImageWidget;
  countdownDate: string;
  title: string;
  promoName: string;
}

function PromoCountdownBanner({
  image,
  countdownDate,
  title,
  promoName,
}: Props) {
  return (
    <PromoCountdownIsland
      image={image}
      countdownDate={countdownDate}
      title={title}
      promoName={promoName}
    />
  );
}

export default PromoCountdownBanner;
