import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../components/ui/Section.tsx";
import { useId } from "../sdk/useId.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import { clx } from "../sdk/clx.ts";

interface Item {
  image: ImageWidget;
  href: string;
  label?: string;
}

interface Props {
  items: Item[];
  title?: string;
  cta?: string;
  icon?: ImageWidget;
}

function Card({ image, href, label }: Item) {
  return (
    <a
      href={href}
      class="flex flex-col items-center justify-center gap-4 w-full h-full px-2.5"
    >
      <div class="rounded-full flex justify-center items-center w-full h-full max-w-[160px] mx-auto">
        <Image
          src={image}
          alt={label || "Brand"}
          width={160}
          height={160}
          loading="lazy"
          class="w-full h-full object-contain"
        />
      </div>
      {label && (
        <span class="font-bold text-sm text-center text-[#3A4332]">
          {label}
        </span>
      )}
    </a>
  );
}

function BrandGridIsland({ title, cta, items, icon }: Props) {
  const id = useId();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [stepSize, setStepSize] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  // Quantidade de itens visíveis por breakpoint
  const getItemsPerPage = () => {
    if (!sliderRef.current) return 2;
    const width = sliderRef.current.offsetWidth;
    if (width >= 1024) return 4; // desktop
    if (width >= 768) return 3; // tablet
    return 2; // mobile
  };

  // Calcula a quantidade de pontos de navegação
  const getDotsCount = () => {
    const itemsPerPage = getItemsPerPage();
    return Math.max(items.length - itemsPerPage + 1, 1);
  };

  // Atualiza o tamanho do passo (largura de um item + gap)
  const updateStepSize = () => {
    if (!sliderRef.current) return;

    const firstItem =
      sliderRef.current.querySelector<HTMLDivElement>(".flex-shrink-0");
    if (!firstItem) return;

    // Obtém o gap computado do container
    const sliderStyle = window.getComputedStyle(sliderRef.current);
    const gap = parseFloat(sliderStyle.gap) || 0;

    setStepSize(firstItem.offsetWidth + gap);
  };

  // Navega para um ponto específico
  const goToDot = (dotIndex: number) => {
    if (!sliderRef.current || stepSize === 0) return;

    const position = dotIndex * stepSize;
    sliderRef.current.scrollTo({
      left: position,
      behavior: "smooth",
    });
    setActiveDot(dotIndex);
  };

  // Atualiza o dot ativo baseado na posição de rolagem
  const updateActiveDot = () => {
    if (!sliderRef.current || stepSize === 0) return;

    const scrollPosition = sliderRef.current.scrollLeft;
    const dotIndex = Math.round(scrollPosition / stepSize);

    // Garante que o índice esteja dentro dos limites
    const maxDotIndex = getDotsCount() - 1;
    const safeIndex = Math.min(Math.max(dotIndex, 0), maxDotIndex);

    setActiveDot(safeIndex);
  };

  // Configura os eventos de arraste e redimensionamento
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Atualiza o tamanho do passo quando a janela é redimensionada
    const handleResize = () => {
      updateStepSize();
      updateActiveDot();
    };

    window.addEventListener("resize", handleResize);

    // Configura eventos de arraste
    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      startXRef.current =
        (e as MouseEvent).pageX ||
        (e as TouchEvent).touches?.[0]?.pageX ||
        slider.offsetLeft;
      scrollLeftRef.current = slider.scrollLeft;
      slider.classList.add("dragging");
    };

    const handleDragEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      slider.classList.remove("dragging");

      // Encaixa na posição mais próxima após arrastar
      updateActiveDot();
      setTimeout(() => goToDot(activeDot), 100);
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;

      e.preventDefault();
      const x =
        (e as MouseEvent).pageX ||
        (e as TouchEvent).touches?.[0]?.pageX ||
        startXRef.current;
      const walk = (x - startXRef.current) * 2;
      slider.scrollLeft = scrollLeftRef.current - walk;
    };

    // Eventos de mouse
    slider.addEventListener("mousedown", handleDragStart);
    slider.addEventListener("mouseleave", handleDragEnd);
    slider.addEventListener("mouseup", handleDragEnd);
    slider.addEventListener("mousemove", handleDragMove);

    // Eventos de touch
    slider.addEventListener("touchstart", handleDragStart);
    slider.addEventListener("touchend", handleDragEnd);
    slider.addEventListener("touchmove", handleDragMove);

    // Evento de scroll
    slider.addEventListener("scroll", updateActiveDot);

    // Inicializa o tamanho do passo
    updateStepSize();

    return () => {
      slider.removeEventListener("mousedown", handleDragStart);
      slider.removeEventListener("mouseleave", handleDragEnd);
      slider.removeEventListener("mouseup", handleDragEnd);
      slider.removeEventListener("mousemove", handleDragMove);

      slider.removeEventListener("touchstart", handleDragStart);
      slider.removeEventListener("touchend", handleDragEnd);
      slider.removeEventListener("touchmove", handleDragMove);

      slider.removeEventListener("scroll", updateActiveDot);
      window.removeEventListener("resize", handleResize);
    };
  }, [stepSize, activeDot]);

  // Inicializa o dot ativo
  useEffect(() => {
    updateActiveDot();
  }, [stepSize]);

  const dotsCount = getDotsCount();

  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} icon={icon} />

      <div id={id} class="relative">
        {/* Container do slider */}
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
                "flex-shrink-0 snap-start",
                "w-1/2", // 2 cards no mobile (50% cada)
                "md:w-1/3", // 3 cards no tablet
                "lg:w-1/4" // 4 cards no desktop
              )}
            >
              <Card {...item} />
            </div>
          ))}
        </div>

        {/* Dots de navegação */}
        {dotsCount > 1 && (
          <div class="flex justify-center gap-2 mt-6">
            {Array.from({ length: dotsCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToDot(index)}
                class="focus:outline-none"
              >
                <div
                  class={clx(
                    "w-2 h-2 rounded-full transition-colors",
                    activeDot === index ? "bg-[#292929]" : "bg-[#D9D9D9]"
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

export default BrandGridIsland;
