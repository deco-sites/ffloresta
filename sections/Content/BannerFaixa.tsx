import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  bannerFaixa: ImageWidget;
}

export default function BannerMosaic({ bannerFaixa }: Props) {
  return (
    <>
      {bannerFaixa && (
        <div class="w-full mt-[-1px]">
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

export const LoadingFallback = () => <div class="min-h-[6px]" />;
