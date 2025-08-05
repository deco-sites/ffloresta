import BannerMosaic, {
  Props as BannerMosaicProps,
} from "../../islands/BannerMosaicIsland.tsx";

export interface Props extends BannerMosaicProps {
  title?: string;
  description?: string;
}

export default function BannerMosaicSection(props: Props) {
  return (
    <div class="w-full container">
      <BannerMosaic {...props} />
    </div>
  );
}
