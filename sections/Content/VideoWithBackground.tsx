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
      class="container relative w-full h-auto aspect-[1180/355] overflow-hidden min-h-[450px] lg:min-h-[unset] lg:mt-4"
    >
      {/* Imagem de fundo */}
      <div class="absolute inset-0 z-0">
        <img
          src={bgImgDesktop}
          alt={"Background"}
          class="hidden lg:block w-full h-full object-cover"
        />
        <img
          src={bgImgMobile}
          alt={"Background"}
          class="block lg:hidden w-full h-full object-contain"
        />
      </div>

      <div class="absolute inset-0 z-10 flex items-center justify-center lg:justify-end lg:items-center lg:p-4">
        <Video
          loading="eager"
          autoPlay
          loop
          controls={false}
          muted
          width="auto"
          height={355}
          media="(max-width: 767px)"
          class="object-cover h-[200px] w-[90%] md:hidden"
          alt={alt}
          sizes="(max-width: 767px) 90vw"
          src={videoMobile}
        />

        <Video
          loading="eager"
          autoPlay
          loop
          controls={false}
          muted
          width={1180}
          height={355}
          media="(min-width: 768px)"
          class="object-cover hidden md:block w-[60%] max-w-[560px] h-auto"
          alt={alt}
          sizes="(min-width: 768px) 50vw"
          src={videoDesktop}
        />
      </div>
    </div>
  );
}

export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="355px" />;
  </Section.Container>
);
