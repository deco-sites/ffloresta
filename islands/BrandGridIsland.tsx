import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../components/ui/Section.tsx";
import { useId } from "../sdk/useId.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

export interface Banner {
  desktop?: ImageWidget;
  mobile?: ImageWidget;
  alt: string;
  action?: {
    href?: string;
    title?: string;
    subTitle?: string;
    label?: string;
  };
}

export interface VideoBanner {
  desktop?: VideoWidget;
  mobile?: VideoWidget;
  alt: string;
  poster?: ImageWidget;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  action?: {
    href?: string;
    title?: string;
    subTitle?: string;
    label?: string;
  };
}

export type BrandItem =
  | {
    "@type": "image";
    data: Banner;
    href: string;
    label?: string;
  }
  | {
    "@type": "video";
    data: VideoBanner;
    href: string;
    label?: string;
  };

interface Props {
  items: BrandItem[];
  title?: string;
  cta?: string;
  icon?: ImageWidget;
}

// Componente para renderizar a mídia (imagem ou vídeo)
function MediaRenderer({ item }: { item: BrandItem }) {
  if (item["@type"] === "image") {
    const { data } = item;

    return (
      <picture>
        {/* Imagem para mobile */}
        {data.mobile && (
          <source media="(max-width: 767px)" srcset={data.mobile} />
        )}
        {/* Imagem para desktop */}
        {data.desktop && (
          <source media="(min-width: 768px)" srcset={data.desktop} />
        )}
        {/* Imagem fallback */}
        <Image
          src={data.desktop || data.mobile || ""}
          alt={data.alt}
          width={200}
          height={200}
          loading="lazy"
          class="w-full h-full object-contain"
        />
      </picture>
    );
  }

  if (item["@type"] === "video") {
    const { data } = item;

    return (
      <div class="relative w-full h-full">
        {/* Vídeo para desktop - visível apenas em desktop */}
        {data.desktop && (
          <video
            width="100%"
            height="100%"
            autoPlay={data.autoplay}
            loop={data.loop}
            muted={data.muted}
            poster={data.poster}
            class="w-full h-full object-contain hidden md:block"
            playsInline
          >
            <source src={data.desktop} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}

        {/* Vídeo para mobile - visível apenas em mobile */}
        {data.mobile && (
          <video
            width="100%"
            height="100%"
            autoPlay={data.autoplay}
            loop={data.loop}
            muted={data.muted}
            poster={data.poster}
            class="w-full h-full object-contain block md:hidden"
            playsInline
          >
            <source src={data.mobile} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}

        {/* Fallback - usar desktop se mobile não existir ou vice-versa */}
        {!data.desktop && data.mobile && (
          <video
            width="100%"
            height="100%"
            autoPlay={data.autoplay}
            loop={data.loop}
            muted={data.muted}
            poster={data.poster}
            class="w-full h-full object-contain"
            playsInline
          >
            <source src={data.mobile} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}

        {!data.mobile && data.desktop && (
          <video
            width="100%"
            height="100%"
            autoPlay={data.autoplay}
            loop={data.loop}
            muted={data.muted}
            poster={data.poster}
            class="w-full h-full object-contain"
            playsInline
          >
            <source src={data.desktop} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </div>
    );
  }

  return null;
}

function Card(item: BrandItem) {
  const content = (
    <div class="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div class="rounded-full flex justify-center items-center w-full h-full">
        <MediaRenderer item={item} />
      </div>
      {item.label && (
        <span class="font-bold text-sm text-center text-[#3A4332]">
          {item.label}
        </span>
      )}
    </div>
  );

  return item.href
    ? (
      <a href={item.href} class="block w-full h-full">
        {content}
      </a>
    )
    : <div class="w-full h-full">{content}</div>;
}

export default function BrandGridIsland({ title, cta, items, icon }: Props) {
  const id = useId();
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // Calcular quantos itens cabem por página baseado no tamanho da tela
  const calculateItemsPerPage = () => {
    if (!containerRef.current) return 2;
    const width = containerRef.current.offsetWidth;
    if (width >= 1280) return 6;
    if (width >= 1024) return 5;
    if (width >= 768) return 4;
    if (width >= 640) return 3;
    return 2;
  };

  // Calcular quantos dots são necessários
  const dotsCount = Math.ceil(items.length / itemsPerPage);

  // Função para ir para um dot específico com transição suave
  const goToDot = (dotIndex: number) => {
    if (isTransitioning || !sliderRef.current) return;

    setIsTransitioning(true);
    setActiveDot(dotIndex);

    const slider = sliderRef.current;
    const scrollPosition = dotIndex * slider.offsetWidth;

    slider.style.scrollBehavior = "smooth";
    slider.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    // Resetar após a transição
    setTimeout(() => {
      setIsTransitioning(false);
      slider.style.scrollBehavior = "auto";
    }, 800);
  };

  // Atualizar o dot ativo baseado na posição do scroll
  const updateActiveDot = () => {
    if (!sliderRef.current || isTransitioning) return;

    const slider = sliderRef.current;
    const scrollPosition = slider.scrollLeft;
    const slideWidth = slider.offsetWidth;

    // Evitar divisão por zero
    if (slideWidth === 0) return;

    const newActiveDot = Math.round(scrollPosition / slideWidth);

    // Só atualiza se for diferente e estiver dentro do range válido
    if (
      newActiveDot !== activeDot &&
      newActiveDot >= 0 &&
      newActiveDot < dotsCount
    ) {
      setActiveDot(newActiveDot);
    }
  };

  // Configurar os event listeners e calcular itens por página
  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;

    if (!slider || !container) return;

    // Calcular itens por página inicialmente e em redimensionamentos
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setTimeout(updateActiveDot, 100);
    };

    // Função debounce para o scroll para melhor performance
    let scrollTimeout: number | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateActiveDot, 100) as unknown as number;
    };

    // Adicionar event listeners
    slider.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Também adicionar event listeners para touch e mouse events
    const handleInteractionEnd = () => {
      // Pequeno delay para garantir que o scroll finalizou
      setTimeout(updateActiveDot, 150);
    };

    slider.addEventListener("touchend", handleInteractionEnd);
    slider.addEventListener("mouseup", handleInteractionEnd);
    slider.addEventListener("mouseleave", handleInteractionEnd);

    // Calcular valores iniciais
    handleResize();

    // Cleanup
    return () => {
      slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      slider.removeEventListener("touchend", handleInteractionEnd);
      slider.removeEventListener("mouseup", handleInteractionEnd);
      slider.removeEventListener("mouseleave", handleInteractionEnd);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [dotsCount, activeDot]);

  // Recalcular dotsCount quando itemsPerPage mudar
  useEffect(() => {
    // Forçar atualização do dot ativo quando o número de dots mudar
    updateActiveDot();
  }, [itemsPerPage]);

  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} icon={icon} />

      <div id={id} class="relative" ref={containerRef}>
        <div
          ref={sliderRef}
          class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full gap-5"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              class={clx(
                "flex-shrink-0 snap-start transition-transform duration-700 ease-in-out",
                "w-[calc(50%-(20px/2))]",
                "sm:w-[calc(33.3%-(40px/3))]",
                "md:w-[calc(25%-(60px/4))]",
                "lg:w-[calc(20%-(80px/5))]",
                "2xl:w-[calc(16.6%-(100px/6))]",
              )}
            >
              <Card {...item} />
            </div>
          ))}
        </div>

        {dotsCount > 1 && (
          <div class="flex justify-center gap-2 mt-6 lg:hidden">
            {Array.from({ length: dotsCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToDot(index)}
                class="focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
                disabled={isTransitioning}
              >
                <div
                  class={clx(
                    "w-2 h-2 lg:w-3 lg:h-3 transition-all duration-300",
                    "border border-[#273D28]",
                    activeDot === index ? "bg-[#273D28]" : "bg-transparent",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Section.Container>
  );
}
