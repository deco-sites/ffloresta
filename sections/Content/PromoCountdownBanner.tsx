import { SectionProps } from "deco/types.ts";
import Section from "../../components/ui/Section.tsx";
import PromoCountdownIsland from "../../islands/ProductPagePromoBanner.tsx";
import type { ImageWidget as Image } from "apps/admin/widgets.ts";

export interface Props {
  image: Image;
  countdownDate: string;
  title: string;
  promoName: string;
}

export default function PromoCountdownSection({
  image,
  countdownDate,
  title,
  promoName,
}: SectionProps<typeof loader>) {
  return (
    <div class="w-full container mx-auto px-0">
      <PromoCountdownIsland
        image={image}
        countdownDate={countdownDate}
        title={title}
        promoName={promoName}
      />
    </div>
  );
}

export const loader = ({ image, countdownDate, title, promoName }: Props) => {
  return { image, countdownDate, title, promoName };
};

export const LoadingFallback = () => <Section.Placeholder height="100px" />;
