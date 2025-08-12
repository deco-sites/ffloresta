import BannerMosaicIsland, {
  Props as BannerMosaicProps,
} from "../../islands/BannerMosaicIsland.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props extends BannerMosaicProps {
  title?: string;
  description?: string;
}

export default function BannerMosaicSection(props: Props) {
  return (
    <div class="w-full container mb-5">
      <BannerMosaicIsland {...props} />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="400px" />;
