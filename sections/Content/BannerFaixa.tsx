import { ImageWidget } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  bannerFaixa: ImageWidget;
}

export default function BannerMosaic({ bannerFaixa }: Props) {
  return (
    <>
      {bannerFaixa && (
        <div class="w-full ">
          <img
            src={bannerFaixa}
            alt="BannerFaixa"
            class="absolute left-0 w-screen h-[6px] object-cover object-[50%]"
          />
        </div>
      )}
    </>
  );
}
