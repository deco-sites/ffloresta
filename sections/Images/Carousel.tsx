import type { ImageWidget } from "apps/admin/widgets.ts";
import type { VideoWidget } from "apps/admin/widgets.ts";
import { Picture } from "apps/website/components/Picture.tsx";
import Video from "apps/website/components/Video.tsx";
import Section from "../../components/ui/Section.tsx";
import CarouselSlider from "../../islands/Sliders/CarouselSlider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

export interface Banner {
  /** @title Imagem para Desktop */
  desktop: ImageWidget;
  /** @title Imagem para Mobile */
  mobile: ImageWidget;
  /** @title Texto Alternativo */
  alt: string;
  /** @title Ação do Banner */
  action?: {
    /** @title Link */
    href?: string;
    /** @title Título */
    title?: string;
    /** @title Subtítulo */
    subTitle?: string;
    /** @title Texto do Botão */
    label?: string;
  };
}

export interface VideoBanner {
  /** @title Vídeo para Desktop */
  desktop: VideoWidget;
  /** @title Vídeo para Mobile */
  mobile: VideoWidget;
  /** @title Texto Alternativo */
  alt: string;
  /** @title Imagem de Poster (opcional) */
  poster?: ImageWidget;
  /** @title Reproduzir Automaticamente */
  autoplay?: boolean;
  /** @title Loop */
  loop?: boolean;
  /** @title Sem Áudio */
  muted?: boolean;
  /** @title Ação do Vídeo */
  action?: {
    /** @title Link */
    href?: string;
    /** @title Título */
    title?: string;
    /** @title Subtítulo */
    subTitle?: string;
    /** @title Texto do Botão */
    label?: string;
  };
}

/** @titleSlide Item */
export type SlideItem =
  | {
      /** @title Imagem */
      type: "image";
      /** @title Dados da Imagem */
      data: Banner;
    }
  | {
      /** @title Vídeo */
      type: "video";
      /** @title Dados do Vídeo */
      data: VideoBanner;
    };

export interface Props {
  /** @title Slides */
  slides?: SlideItem[];
  /** @title Pré-carregar Primeiro Slide */
  preload?: boolean;
  /** @title Intervalo de Transição (ms) */
  interval?: number;
}

function VideoBannerItem({
  video,
  lcp,
}: {
  video: VideoBanner;
  lcp?: boolean;
}) {
  const {
    alt,
    mobile,
    desktop,
    poster,
    autoplay = true,
    loop = true,
    muted = true,
    action,
  } = video;
  const params = { promotion_name: alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  const hasAction =
    action && (action.href || action.title || action.subTitle || action.label);

  return (
    <a
      {...(hasAction ? selectPromotionEvent : {})}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative block w-full overflow-hidden group"
    >
      {hasAction && (
        <div
          class={clx(
            "absolute h-full w-full top-0 left-0 z-10",
            "flex flex-col justify-center items-center",
            "px-5 sm:px-0",
            "sm:left-40 sm:items-start sm:max-w-96"
          )}
        >
          {action.title && (
            <span class="text-4xl md:text-7xl font-bold text-base-100">
              {action.title}
            </span>
          )}
          {action.subTitle && (
            <span class="font-normal text-base text-base-100 pt-4 pb-8 md:pb-12">
              {action.subTitle}
            </span>
          )}
          {action.label && (
            <button
              class="btn btn-primary btn-outline border-0 bg-white min-w-[180px]"
              aria-label={action.label}
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      {/* Container do vídeo */}
      <div {...viewPromotionEvent} class="relative w-full h-full">
        {/* Vídeo Mobile */}
        <Video
          loading={lcp ? "eager" : "lazy"}
          autoPlay={autoplay}
          loop={loop}
          controls={false}
          muted={muted}
          width="100%"
          height="100%"
          media="(max-width: 767px)"
          class="object-cover w-full h-full md:hidden"
          alt={alt}
          src={mobile}
          poster={poster}
        />

        {/* Vídeo Desktop */}
        <Video
          loading={lcp ? "eager" : "lazy"}
          autoPlay={autoplay}
          loop={loop}
          controls={false}
          muted={muted}
          width="100%"
          height="100%"
          media="(min-width: 768px)"
          class="object-cover hidden md:block w-full h-full"
          alt={alt}
          src={desktop}
          poster={poster}
        />
      </div>
    </a>
  );
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, mobile, desktop, action } = image;
  const params = { promotion_name: alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  const hasAction =
    action && (action.href || action.title || action.subTitle || action.label);

  return (
    <a
      {...(hasAction ? selectPromotionEvent : {})}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative block w-full overflow-hidden group"
    >
      {hasAction && (
        <div
          class={clx(
            "absolute h-full w-full top-0 left-0 z-10",
            "flex flex-col justify-center items-center",
            "px-5 sm:px-0",
            "sm:left-40 sm:items-start sm:max-w-96"
          )}
        >
          {action.title && (
            <span class="text-4xl md:text-7xl font-bold text-base-100">
              {action.title}
            </span>
          )}
          {action.subTitle && (
            <span class="font-normal text-base text-base-100 pt-4 pb-8 md:pb-12">
              {action.subTitle}
            </span>
          )}
          {action.label && (
            <button
              class="btn btn-primary btn-outline border-0 bg-white min-w-[180px]"
              aria-label={action.label}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
      <Picture preload={lcp} {...viewPromotionEvent}>
        <img
          class="block lg:hidden object-cover w-full h-full select-none pointer-events-none"
          loading={lcp ? "eager" : "lazy"}
          src={mobile}
          alt={alt}
        />
        <img
          class="hidden lg:block object-cover w-full h-full select-none pointer-events-none"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>
    </a>
  );
}

function SlideItem({ slide, lcp }: { slide: SlideItem; lcp?: boolean }) {
  if (slide.type === "image") {
    return <BannerItem image={slide.data} lcp={lcp} />;
  } else {
    return <VideoBannerItem video={slide.data} lcp={lcp} />;
  }
}

function Carousel({ slides = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class={clx(
        "relative group",
        "w-full max-w-full overflow-hidden flex min-h-[unset] h-fit"
      )}
    >
      <CarouselSlider
        rootId={id}
        interval={interval ?? 5000}
        infinite
        autoplay
        class="carousel carousel-center w-full cursor-grab active:cursor-grabbing select-none"
      >
        {slides.map((slide, index) => (
          <CarouselSlider.Item
            index={index}
            class="carousel-item w-full"
            key={index}
          >
            <SlideItem slide={slide} lcp={index === 0 && preload} />
          </CarouselSlider.Item>
        ))}
      </CarouselSlider>

      {/* Navigation arrows - only visible on desktop and on hover */}
      {slides.length > 1 && (
        <>
          <div class="hidden lg:block">
            <CarouselSlider.PrevButton
              class="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
              disabled={false}
            >
              <div class="p-2 rounded-full bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] transition-all duration-300 hover:bg-[rgba(21,31,22,0.8)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  aria-hidden="true"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </div>
            </CarouselSlider.PrevButton>
            <CarouselSlider.NextButton
              class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
              disabled={false}
            >
              <div class="p-2 rounded-full bg-[rgba(21,31,22,0.6)] backdrop-blur-[12px] transition-all duration-300 hover:bg-[rgba(21,31,22,0.8)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  aria-hidden="true"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </CarouselSlider.NextButton>
          </div>

          <ul
            class={clx(
              "bottom-4 left-0 right-0 z-20 h-3",
              "justify-center gap-2 absolute flex"
            )}
          >
            {slides.map((_, index) => (
              <li class="carousel-item h-3" key={index}>
                <CarouselSlider.Dot
                  index={index}
                  class={clx(
                    "bg-transparent border border-[#2D2D2D] h-2 w-2 no-animation",
                    "disabled:bg-[#2D2D2D] transition-[background]"
                  )}
                />
              </li>
            ))}
          </ul>

          <CarouselSlider.JS
            rootId={id}
            interval={interval ?? 5000}
            infinite
            autoplay={true}
          />
        </>
      )}
    </div>
  );
}

export default Carousel;

export const LoadingFallback = () => <Section.Placeholder height="300px" />;
