import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
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

  const hasAction = action &&
    (action.href || action.title || action.subTitle || action.label);

  return (
    <a
      {...(hasAction ? selectPromotionEvent : {})}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative block overflow-y-hidden w-full"
    >
      {hasAction && (
        <div
          class={clx(
            "absolute h-full w-full top-0 left-0",
            "flex flex-col justify-center items-center",
            "px-5 sm:px-0",
            "sm:left-40 sm:items-start sm:max-w-96",
          )}
        >
          {action.title && (
            <span class="text-7xl font-bold text-base-100">{action.title}</span>
          )}
          {action.subTitle && (
            <span class="font-normal text-base text-base-100 pt-4 pb-12">
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
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={412}
          height={660}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1440}
          height={600}
        />
        <img
          class="object-cover w-full h-full"
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
        "grid",
        "grid-rows-[1fr_32px_1fr_42px]",
        "grid-cols-[32px_1fr_32px]",
        "sm:grid-cols-[112px_1fr_42px] sm:min-h-min",
        "w-full max-w-full overflow-hidden",
      )}
    >
      <div class="col-span-full row-span-full">
        <Slider class="carousel carousel-center w-full gap-6">
          {images.map((image, index) => (
            <Slider.Item index={index} class="carousel-item w-full">
              <BannerItem image={image} lcp={index === 0 && preload} />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      <ul
        class={clx(
          "col-span-full row-start-4 z-10 h-3",
          "carousel justify-center gap-2",
        )}
      >
        {images.map((_, index) => (
          <li class="carousel-item h-3">
            <Slider.Dot
              index={index}
              class={clx(
                "bg-white h-3 w-3 no-animation rounded-full",
                "disabled:bg-[#2D2D2D] transition-[background]",
              )}
            >
            </Slider.Dot>
          </li>
        ))}
      </ul>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;

export const LoadingFallback = () => <Section.Placeholder height="300px" />;
