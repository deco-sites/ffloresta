import type { ImageWidget } from "apps/admin/widgets.ts";
import type { VideoWidget } from "apps/admin/widgets.ts";
import { Picture } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import CarouselSlider from "../../islands/Sliders/CarouselSlider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

export interface Banner {
  /** @description Imagem para desktop (obrigatória se não houver vídeo) */
  desktop?: ImageWidget;
  /** @description Imagem para mobile (obrigatória se não houver vídeo) */
  mobile?: ImageWidget;
  /** @description Arquivo de vídeo MP4 para desktop (obrigatório se não houver imagem) */
  desktopVideo?: VideoWidget;
  /** @description Arquivo de vídeo MP4 para mobile (obrigatório se não houver imagem) */
  mobileVideo?: VideoWidget;
  /** @description Texto alternativo para acessibilidade */
  alt: string;
  action?: {
    href?: string;
    title?: string;
    subTitle?: string;
    label?: string;
  };
}

export interface Props {
  images?: Banner[];
  preload?: boolean;
  interval?: number;
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, mobile, desktop, desktopVideo, mobileVideo, action } = image;
  const params = { promotion_name: image.alt };

  // Validação: deve ter pelo menos imagem OU vídeo
  const hasDesktopContent = desktop || desktopVideo;
  const hasMobileContent = mobile || mobileVideo;
  
  if (!hasDesktopContent && !hasMobileContent) {
    return (
      <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
        <p class="text-gray-500 text-center px-4">
          ⚠️ Erro: É necessário adicionar pelo menos uma imagem ou um vídeo para este slide
        </p>
      </div>
    );
  }

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  const hasAction = action &&
    (action.href || action.title || action.subTitle || action.label);

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
            "sm:left-40 sm:items-start sm:max-w-96",
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
      <div {...viewPromotionEvent}>
        {/* Mobile content */}
        <div class="block lg:hidden w-full aspect-video bg-gray-100">
          {mobileVideo ? (
            <video
              class="object-cover w-full h-full select-none pointer-events-none"
              autoplay
              muted
              loop
              playsInline
              preload={lcp ? "auto" : "metadata"}
            >
              <source src={mobileVideo} type="video/mp4" />
              {mobile && (
                <img
                  class="object-cover w-full h-full select-none pointer-events-none"
                  loading={lcp ? "eager" : "lazy"}
                  src={mobile}
                  alt={alt}
                />
              )}
            </video>
          ) : mobile ? (
            <img
              class="object-cover w-full h-full select-none pointer-events-none"
              loading={lcp ? "eager" : "lazy"}
              src={mobile}
              alt={alt}
            />
          ) : (
            <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
              <p class="text-gray-500 text-center px-4">
                ⚠️ Adicione uma imagem ou vídeo para mobile
              </p>
            </div>
          )}
        </div>
        
        {/* Desktop content */}
        <div class="hidden lg:block w-full aspect-video bg-gray-100">
          {desktopVideo ? (
            <video
              class="object-cover w-full h-full select-none pointer-events-none"
              autoplay
              muted
              loop
              playsInline
              preload={lcp ? "auto" : "metadata"}
            >
              <source src={desktopVideo} type="video/mp4" />
              {desktop && (
                <img
                  class="object-contain w-full h-full select-none pointer-events-none"
                  loading={lcp ? "eager" : "lazy"}
                  src={desktop}
                  alt={alt}
                />
              )}
            </video>
          ) : desktop ? (
            <img
              class="object-cover w-full h-full select-none pointer-events-none"
              loading={lcp ? "eager" : "lazy"}
              src={desktop}
              alt={alt}
            />
          ) : (
            <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
              <p class="text-gray-500 text-center px-4">
                ⚠️ Adicione uma imagem ou vídeo para desktop
              </p>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class={clx(
        "relative group",
        "w-full max-w-full overflow-hidden flex min-h-[unset] h-fit",
      )}
    >
      <CarouselSlider
        rootId={id}
        interval={interval ?? 5000}
        infinite
        autoplay
        class="carousel carousel-center w-full cursor-grab active:cursor-grabbing select-none"
      >
        {images.map((image, index) => (
          <CarouselSlider.Item
            index={index}
            class="carousel-item w-full"
            key={index}
          >
            <BannerItem image={image} lcp={index === 0 && preload} />
          </CarouselSlider.Item>
        ))}
      </CarouselSlider>

      {/* Navigation arrows - only visible on desktop and on hover */}
      {images.length > 1 && (
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
                  >
                  </path>
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
                  >
                  </path>
                </svg>
              </div>
            </CarouselSlider.NextButton>
          </div>

          <ul
            class={clx(
              "bottom-4 left-0 right-0 z-20 h-3",
              "justify-center gap-2 absolute flex",
            )}
          >
            {images.map((_, index) => (
              <li class="carousel-item h-3" key={index}>
                <CarouselSlider.Dot
                  index={index}
                  class={clx(
                    "bg-transparent border border-[#2D2D2D] h-2 w-2 no-animation",
                    "disabled:bg-[#2D2D2D] transition-[background]",
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