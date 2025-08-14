import { useId } from "../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export interface Props {
  /**
   * @title Configurações do Banner Mosaico
   */
  settings?: {
    /**
     * @title Quantidade de itens visíveis
     * @description Número de imagens visíveis simultaneamente no desktop
     * @default 4
     */
    itemsToShow?: number;
    /**
     * @title Espaçamento entre itens
     * @description Espaço entre as imagens em pixels no desktop, o número digitado será multiplicado por 4x, devido aos padrões de espaçamento. Exemplo: 3 = 12px
     * @default 3
     */
    gap?: number;
    /**
     * @title Autoplay
     * @description Ativar rotação automática das imagens
     * @default true
     */
    autoplay?: boolean;
    /**
     * @title Intervalo do Autoplay
     * @description Tempo em milissegundos entre cada transição
     * @default 5000
     */
    autoplayInterval?: number;
  };

  /**
   * @title Imagens do Banner
   */
  images: Array<{
    /**
     * @title Imagem para Desktop
     */
    desktop: Image;
    /**
     * @title Imagem para Mobile
     */
    mobile: Image;
    /**
     * @title Texto alternativo
     * @description Texto que descreve a imagem para acessibilidade
     */
    alt: string;
    /**
     * @title Link
     * @description URL para onde o usuário será direcionado ao clicar na imagem
     */
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

export default function BannerMosaicIsland({
  images,
  settings = {},
  spacing = {},
}: Props) {
  const {
    itemsToShow = 4,
    gap = 3,
    autoplay = true,
    autoplayInterval = 5000,
  } = settings;

  const {
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
  } = spacing;

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

    const handleScroll = () => {
      updateActiveDot();
    };

    slider.addEventListener("mousedown", handleDragStart);
    slider.addEventListener("mousemove", handleDragMove);
    slider.addEventListener("mouseup", handleDragEnd);
    slider.addEventListener("mouseleave", handleDragEnd);

    slider.addEventListener("touchstart", handleDragStart);
    slider.addEventListener("touchmove", handleDragMove);
    slider.addEventListener("touchend", handleDragEnd);

    slider.addEventListener("scroll", handleScroll);

    return () => {
      slider.removeEventListener("mousedown", handleDragStart);
      slider.removeEventListener("mousemove", handleDragMove);
      slider.removeEventListener("mouseup", handleDragEnd);
      slider.removeEventListener("mouseleave", handleDragEnd);

      slider.removeEventListener("touchstart", handleDragStart);
      slider.removeEventListener("touchmove", handleDragMove);
      slider.removeEventListener("touchend", handleDragEnd);

      slider.removeEventListener("scroll", handleScroll);
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

  const containerStyle = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
  };

  const desktopView = (
    <div
      class={clx(
        "hidden md:flex flex-wrap items-stretch justify-center",
        `gap-${gap}`,
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
