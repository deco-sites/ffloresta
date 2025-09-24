import Section from "../../components/ui/Section.tsx";
import ProductPagePromoBannerIsland from "../../islands/ProductPagePromoBannerIsland.tsx";
import type { ImageWidget as Image } from "apps/admin/widgets.ts";
import { type SectionProps } from "@deco/deco";
export interface Props {
  image: Image;
  /** @description Vídeo MP4 (opcional) */
  video?: string;
  countdownDate: string;
  title: string;
  promoName: string;
}

export default function PromoCountdownSection({
  image,
  video,
  countdownDate,
  title,
  promoName,
}: SectionProps<typeof loader>) {
  return (
    <div class="w-full container mx-auto">
      <ProductPagePromoBannerIsland
        image={image}
        video={video}
        countdownDate={countdownDate}
        title={title}
        promoName={promoName}
      />
    </div>
  );
}

export const loader = ({ image, video, countdownDate, title, promoName }: Props) => {
  return { image, video, countdownDate, title, promoName };
};
export const LoadingFallback = () => <Section.Placeholder height="100px"/>;
