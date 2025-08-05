import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../islands/CarouselSlider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

export interface Banner {
  desktop: ImageWidget;
  mobile: ImageWidget;
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
  const { alt, mobile, desktop, action } = image;
  const params = { promotion_name: image.alt };

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

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class={clx(
        "relative group",
        "w-full max-w-full overflow-hidden flex min-h-[unset] h-fit"
      )}
    >
      <Slider
        rootId={id}
        interval={interval ?? 5000}
        infinite
        autoplay
        class="carousel carousel-center w-full cursor-grab active:cursor-grabbing select-none"
      >
        {images.map((image, index) => (
          <Slider.Item index={index} class="carousel-item w-full" key={index}>
            <BannerItem image={image} lcp={index === 0 && preload} />
          </Slider.Item>
        ))}
      </Slider>

      {/* Navigation arrows - only visible on desktop and on hover */}
      {images.length > 1 && (
        <>
          <div class="hidden lg:block">
            <Slider.PrevButton
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
            </Slider.PrevButton>
            <Slider.NextButton
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
            </Slider.NextButton>
          </div>

          <ul
            class={clx(
              "absolute bottom-4 left-0 right-0 z-20 h-3",
              "carousel justify-center gap-2"
            )}
          >
            {images.map((_, index) => (
              <li class="carousel-item h-3" key={index}>
                <Slider.Dot
                  index={index}
                  class={clx(
                    "bg-white h-2 w-2 no-animation",
                    "disabled:bg-[#2D2D2D] transition-[background]"
                  )}
                />
              </li>
            ))}
          </ul>

          <Slider.JS
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
