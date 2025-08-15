import { useId } from "../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export interface Props {
  settings?: {
    itemsToShow?: number;
    gap?: number;
    autoplay?: boolean;
    autoplayInterval?: number;
  };
  images: Array<{
    desktop: Image;
    mobile: Image;
    alt: string;
    href?: string;
  }>;
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

export default function BannerMosaicIsland({ images, settings = {} }: Props) {
  const {
    itemsToShow = 4,
    gap = 3,
    autoplay = true,
    autoplayInterval = 5000,
  } = settings;

  const id = useId();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  // Estado de arraste
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);

  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const updateActiveDot = () => {
    if (!sliderRef.current) return;
    const scrollPosition = sliderRef.current.scrollLeft;
    const slideWidth = sliderRef.current.offsetWidth;
    const newActiveDot = Math.round(scrollPosition / slideWidth);

    setActiveDot(newActiveDot);
  };

  const goToSlide = (index: number) => {
    if (!sliderRef.current || images.length <= 1) return;

    sliderRef.current.scrollTo({
      left: sliderRef.current.offsetWidth * index,
      behavior: "smooth",
    });
    setActiveDot(index);
  };

  const goToNextSlide = () => {
    const nextSlide = (activeDot + 1) % images.length;
    goToSlide(nextSlide);
  };

  const startAutoplay = () => {
    if (!autoplay || images.length <= 1) return;
    stopAutoplay();
    autoplayTimer.current = setInterval(goToNextSlide, autoplayInterval);
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
      const pageX = "pageX" in e ? e.pageX : e.touches[0].pageX;
      const pageY = "pageY" in e ? e.pageY : e.touches[0].pageY;

      setIsDragging(true);
      setIsHorizontalScroll(false); // ainda não sabemos a direção
      setStartX(pageX);
      setStartY(pageY);
      setScrollLeft(slider.scrollLeft);
      stopAutoplay();
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const x = "pageX" in e ? e.pageX : e.touches[0].pageX;
      const y = "pageY" in e ? e.pageY : e.touches[0].pageY;
      const deltaX = x - startX;
      const deltaY = y - startY;

      // Detecta direção apenas na primeira movimentação
      if (!isHorizontalScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsHorizontalScroll(true);
      }

      if (isHorizontalScroll) {
        e.preventDefault(); // bloqueia scroll vertical
        const walk = deltaX * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      }
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

    slider.addEventListener("touchstart", handleDragStart, { passive: true });
    slider.addEventListener("touchmove", handleDragMove, { passive: false });
    slider.addEventListener("touchend", handleDragEnd);

    slider.addEventListener("scroll", updateActiveDot);

    return () => {
      slider.removeEventListener("mousedown", handleDragStart);
      slider.removeEventListener("mousemove", handleDragMove);
      slider.removeEventListener("mouseup", handleDragEnd);
      slider.removeEventListener("mouseleave", handleDragEnd);

      slider.removeEventListener("touchstart", handleDragStart);
      slider.removeEventListener("touchmove", handleDragMove);
      slider.removeEventListener("touchend", handleDragEnd);

      slider.removeEventListener("scroll", updateActiveDot);
    };
  }, [isDragging, startX, startY, scrollLeft, isHorizontalScroll]);

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
                goToSlide(index);
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
