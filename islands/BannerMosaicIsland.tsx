import { useId } from "../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import Section from "../components/ui/Section.tsx";
import { useRef, useState, useEffect } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export interface Props {
  images: {
    desktop: Image;
    mobile: Image;
    alt: string;
    href?: string;
  }[];
  itemsToShow?: number;
  gap?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
}

function MosaicImage({
  image,
  lcp,
}: {
  image: Props["images"][number];
  lcp?: boolean;
}) {
  const { desktop, mobile, alt, href } = image;

  const content = (
    <>
      <img
        src={mobile}
        alt={alt}
        class="object-cover w-full h-full md:hidden"
        loading={lcp ? "eager" : "lazy"}
      />
      <img
        src={desktop}
        alt={alt}
        class="object-cover w-full h-full hidden md:block"
        loading={lcp ? "eager" : "lazy"}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} class="block h-full w-full">
        {content}
      </a>
    );
  }

  return <div class="block h-full w-full">{content}</div>;
}

export default function BannerMosaicIsland({
  images,
  itemsToShow = 4,
  gap = 3,
  autoplay = true,
  autoplayInterval = 5000,
}: Props) {
  const id = useId();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const updateActiveDot = () => {
    if (!sliderRef.current) return;
    const scrollPosition = sliderRef.current.scrollLeft;
    const slideWidth = sliderRef.current.offsetWidth;
    const newActiveDot = Math.round(scrollPosition / slideWidth);
    setActiveDot(newActiveDot);
  };

  const goToNextSlide = () => {
    if (!sliderRef.current || images.length <= 1) return;

    const nextSlide = (activeDot + 1) % images.length;

    sliderRef.current.scrollTo({
      left: sliderRef.current.offsetWidth * nextSlide,
      behavior: "smooth",
    });
    setActiveDot(nextSlide);
  };

  const startAutoplay = () => {
    if (!autoplay || images.length <= 1) return;

    stopAutoplay();

    autoplayTimer.current = setInterval(() => {
      goToNextSlide();
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      setStartX("pageX" in e ? e.pageX : e.touches[0].pageX);
      setScrollLeft(slider.scrollLeft);
      stopAutoplay();
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = "pageX" in e ? e.pageX : e.touches[0].pageX;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      updateActiveDot();
      startAutoplay();
    };

    slider.addEventListener("mousedown", handleDragStart);
    slider.addEventListener("mousemove", handleDragMove);
    slider.addEventListener("mouseup", handleDragEnd);
    slider.addEventListener("mouseleave", handleDragEnd);

    slider.addEventListener("touchstart", handleDragStart);
    slider.addEventListener("touchmove", handleDragMove);
    slider.addEventListener("touchend", handleDragEnd);

    return () => {
      slider.removeEventListener("mousedown", handleDragStart);
      slider.removeEventListener("mousemove", handleDragMove);
      slider.removeEventListener("mouseup", handleDragEnd);
      slider.removeEventListener("mouseleave", handleDragEnd);

      slider.removeEventListener("touchstart", handleDragStart);
      slider.removeEventListener("touchmove", handleDragMove);
      slider.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, startX, scrollLeft]);

  useEffect(() => {
    if (autoplay && images.length > 1) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => stopAutoplay();
  }, [autoplay, autoplayInterval, images.length]);

  const desktopView = (
    <div
      class={clx(
        "hidden md:flex flex-wrap items-stretch justify-center",
        `gap-${gap}`
      )}
    >
      {images?.slice(0, itemsToShow).map((image, index) => (
        <div class={`flex-1 min-w-[calc(${100 / itemsToShow}% - ${gap}px)]`}>
          <MosaicImage image={image} lcp={index < 2} />
        </div>
      ))}
    </div>
  );

  const mobileView = (
    <div class="md:hidden relative">
      <div
        ref={sliderRef}
        class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full"
        onScroll={updateActiveDot}
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={stopAutoplay}
      >
        {images?.map((image, index) => (
          <div
            key={index}
            class="flex-shrink-0 snap-start w-full"
            style={{ flex: "0 0 100%" }}
          >
            <MosaicImage image={image} lcp={index < 2} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div class="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoplay();
                if (sliderRef.current) {
                  sliderRef.current.scrollTo({
                    left: sliderRef.current.offsetWidth * index,
                    behavior: "smooth",
                  });
                }
                setTimeout(startAutoplay, autoplayInterval);
              }}
              class="focus:outline-none"
              aria-label={`Ir para slide ${index + 1}`}
            >
              <div
                class={clx(
                  "w-2 h-2 lg:w-3 lg:h-3 transition-all duration-300",
                  activeDot === index
                    ? "bg-[#2D2D2D]"
                    : "bg-transparent border border-[#2D2D2D]"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div id={id}>
      {desktopView}
      {mobileView}
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="400px" />;
