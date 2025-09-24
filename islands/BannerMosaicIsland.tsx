import { useId } from "../sdk/useId.ts";
import { ImageWidget as Image, VideoWidget } from "apps/admin/widgets.ts";
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
    /** @description Vídeo MP4 para desktop (opcional) */
    desktopVideo?: VideoWidget;
    /** @description Vídeo MP4 para mobile (opcional) */
    mobileVideo?: VideoWidget;
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
  const { desktop, mobile, desktopVideo, mobileVideo, alt, href } = image;

  const content = (
    <>
      {/* Mobile content */}
      <div class="md:hidden w-full h-full">
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
                src={mobile}
                alt={alt}
                class="object-cover w-full h-full select-none pointer-events-none"
                loading={lcp ? "eager" : "lazy"}
              />
            )}
          </video>
        ) : mobile ? (
          <img
            src={mobile}
            alt={alt}
            class="object-cover w-full h-full select-none pointer-events-none"
            loading={lcp ? "eager" : "lazy"}
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
      <div class="hidden md:block w-full h-full">
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
                src={desktop}
                alt={alt}
                class="object-cover w-full h-full select-none pointer-events-none"
                loading={lcp ? "eager" : "lazy"}
              />
            )}
          </video>
        ) : desktop ? (
          <img
            src={desktop}
            alt={alt}
            class="object-cover w-full h-full select-none pointer-events-none"
            loading={lcp ? "eager" : "lazy"}
          />
        ) : (
          <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
            <p class="text-gray-500 text-center px-4">
              ⚠️ Adicione uma imagem ou vídeo para desktop
            </p>
          </div>
        )}
      </div>
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const lastScrollTime = useRef(0);

  // Função para ir para um slide específico com transição suave
  const goToSlide = (index: number) => {
    if (isTransitioning || !sliderRef.current || images.length <= 1) return;

    setIsTransitioning(true);
    setActiveDot(index);

    const slider = sliderRef.current;
    const scrollPosition = index * slider.offsetWidth;

    slider.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    // Resetar após a transição
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const updateActiveDot = () => {
    if (!sliderRef.current || isTransitioning) return;

    const slider = sliderRef.current;
    const scrollPosition = slider.scrollLeft;
    const slideWidth = slider.offsetWidth;

    if (slideWidth === 0) return;

    const newActiveDot = Math.round(scrollPosition / slideWidth);

    if (
      newActiveDot !== activeDot &&
      newActiveDot >= 0 &&
      newActiveDot < images.length
    ) {
      setActiveDot(newActiveDot);
    }
  };

  const goToNextSlide = () => {
    const nextSlide = (activeDot + 1) % images.length;
    goToSlide(nextSlide);
  };

  const startAutoplay = () => {
    if (!autoplay || images.length <= 1 || isDragging.current) return;
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

    // Função debounce para o scroll
    let scrollTimeout: number;
    const handleScroll = () => {
      const now = Date.now();
      // Só atualiza a cada 50ms para melhor performance
      if (now - lastScrollTime.current > 50) {
        lastScrollTime.current = now;
        updateActiveDot();
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateActiveDot();
      }, 100) as unknown as number;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      stopAutoplay();
      slider.style.cursor = "grabbing";
      slider.style.scrollSnapType = "none";
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startX.current = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      stopAutoplay();
      slider.style.scrollSnapType = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 2;
      slider.scrollLeft = scrollLeft.current - walk;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 2;
      slider.scrollLeft = scrollLeft.current - walk;

      // Atualiza o dot durante o drag para feedback imediato
      updateActiveDot();
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      slider.style.cursor = "grab";
      slider.style.scrollSnapType = "x mandatory";

      // Força a atualização do dot após o drag
      setTimeout(() => {
        updateActiveDot();
        startAutoplay();
      }, 50);
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      slider.style.scrollSnapType = "x mandatory";

      // Força a atualização do dot após o drag
      setTimeout(() => {
        updateActiveDot();
        startAutoplay();
      }, 50);
    };

    // Event listeners para mouse
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseUp);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    // Event listeners para touch
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd);
    slider.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Event listener para scroll
    slider.addEventListener("scroll", handleScroll);

    // Iniciar autoplay
    startAutoplay();

    return () => {
      // Remover event listeners
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseUp);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);

      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchend", handleTouchEnd);
      slider.removeEventListener("touchmove", handleTouchMove);

      slider.removeEventListener("scroll", handleScroll);

      // Parar autoplay
      stopAutoplay();
    };
  }, [images.length, autoplay, autoplayInterval, activeDot, isTransitioning]);

  const desktopView = (
    <div
      class={clx(
        "hidden md:flex flex-wrap items-stretch justify-center min-h-[300px]",
        `gap-${gap}`,
      )}
    >
      {images?.slice(0, itemsToShow).map((image, index) => (
        <div key={index} class={`flex-1 min-w-[calc(${100 / itemsToShow}% - ${gap}px)] h-full`}>
          <MosaicImage image={image} lcp={index < 2} />
        </div>
      ))}
    </div>
  );

  const mobileView = (
    <div class="md:hidden relative">
      <div
        ref={sliderRef}
        class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full cursor-grab"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
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
              onClick={() => goToSlide(index)}
              class="focus:outline-none"
              aria-label={`Ir para slide ${index + 1}`}
              disabled={isTransitioning}
            >
              <div
                class={clx(
                  "w-2 h-2 lg:w-3 lg:h-3 transition-all duration-300",
                  activeDot === index
                    ? "bg-[#2D2D2D]"
                    : "bg-transparent border border-[#2D2D2D]",
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
