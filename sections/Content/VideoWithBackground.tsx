import { useId } from "preact/hooks";
import { ImageWidget } from "apps/admin/widgets.ts";
import { VideoWidget } from "apps/admin/widgets.ts";
import Video from "apps/website/components/Video.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  /** @title Imagem de fundo para desktop */
  bgImgDesktop: ImageWidget;
  /** @title Imagem de fundo para mobile */
  bgImgMobile: ImageWidget;
  /** @title Vídeo desktop */
  videoDesktop: VideoWidget;
  /** @title Vídeo mobile */
  videoMobile: VideoWidget;
  /** @title Texto alternativo do vídeo */
  alt?: string;
}

export default function VideoWithBackground({
  bgImgDesktop,
  bgImgMobile,
  videoDesktop,
  videoMobile,
  alt,
}: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class="w-full container aspect-[15/13] md:aspect-[1180/355] flex items-center justify-center md:grid md:grid-cols-2 overflow-hidden relative mt-9"
    >
      <img
        src={bgImgMobile}
        alt=""
        class="w-full container absolute block md:hidden"
      />
      <img
        src={bgImgDesktop}
        alt=""
        class="w-full container hidden md:block absolute "
      />
      <div class="hidden md:block"></div>
      <div class="p-4 w-[95%] sm:w-[80%] md:w-full md:max-h-[220px] lg:max-h-[267px] xl:max-h-[330px] z-10">
        {/* Vídeo Mobile */}
        <Video
          loading="eager"
          autoPlay
          loop
          controls={false}
          muted
          width="100%"
          height="100%"
          media="(max-width: 767px)"
          class="object-contain w-full h-full md:hidden "
          alt={alt}
          src={videoMobile}
        />

        {/* Vídeo Desktop */}
        <Video
          loading="eager"
          autoPlay
          loop
          controls={false}
          muted
          width="100%"
          height="100%"
          media="(min-width: 768px)"
          class="object-cover hidden md:block w-full h-full aspect-auto"
          alt={alt}
          src={videoDesktop}
        />
      </div>
    </div>
  );
}

export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="355px" />
  </Section.Container>
);
