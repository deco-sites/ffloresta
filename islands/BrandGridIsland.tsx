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
      class="flex flex-col items-center justify-center gap-4 w-full h-full"
    >
      <div class="rounded-full flex justify-center items-center w-full h-full">
        <Image
          src={image}
          alt={label || "Brand"}
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

export default function BrandGridIsland({ title, cta, items, icon }: Props) {
  const id = useId();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [stepSize, setStepSize] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  const getItemsPerPage = () => {
    if (!sliderRef.current) return 2;
    const width = sliderRef.current.offsetWidth;
    if (width >= 1280) return 6;
    if (width >= 1024) return 5;
    if (width >= 768) return 4;
    if (width >= 640) return 3;
    return 2;
  };

  const getDotsCount = () => {
    const itemsPerPage = getItemsPerPage();
    return Math.ceil(items.length / itemsPerPage);
  };

  const updateStepSize = () => {
    if (!sliderRef.current) return;
    setStepSize(sliderRef.current.offsetWidth);
  };

  const goToDot = (dotIndex: number) => {
    const slider = sliderRef.current;
    const width = slider?.offsetWidth ?? 0;
    const effectiveStep = stepSize || width;

    if (!slider || effectiveStep === 0) return;

    const position = dotIndex * effectiveStep;
    slider.scrollTo({
      left: position,
      behavior: "smooth",
    });

    // Atualiza dot imediatamente (antes do scroll terminar)
    setActiveDot(dotIndex);
  };

  const updateActiveDot = () => {
    const slider = sliderRef.current;
    const width = slider?.offsetWidth ?? 0;
    const effectiveStep = stepSize || width;

    if (!slider || effectiveStep === 0) return;

    const scrollPosition = slider.scrollLeft;
    const dotIndex = Math.round(scrollPosition / effectiveStep);

    const maxDotIndex = getDotsCount() - 1;
    const safeIndex = Math.min(Math.max(dotIndex, 0), maxDotIndex);
    setActiveDot(safeIndex);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleResize = () => {
      updateStepSize();
      updateActiveDot();
    };

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      startXRef.current = (e as MouseEvent).pageX ??
        (e as TouchEvent).touches?.[0]?.pageX ??
        slider.offsetLeft;
      scrollLeftRef.current = slider.scrollLeft;
      slider.classList.add("dragging");
    };

    const handleDragEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      slider.classList.remove("dragging");
      updateActiveDot();
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = (e as MouseEvent).pageX ??
        (e as TouchEvent).touches?.[0]?.pageX ??
        startXRef.current;
      const walk = (x - startXRef.current) * 2;
      slider.scrollLeft = scrollLeftRef.current - walk;
    };

    slider.addEventListener("mousedown", handleDragStart);
    slider.addEventListener("mouseleave", handleDragEnd);
    slider.addEventListener("mouseup", handleDragEnd);
    slider.addEventListener("mousemove", handleDragMove);

    slider.addEventListener("touchstart", handleDragStart);
    slider.addEventListener("touchend", handleDragEnd);
    slider.addEventListener("touchmove", handleDragMove);

    slider.addEventListener("scroll", updateActiveDot);
    window.addEventListener("resize", handleResize);

    // Força cálculo imediato no mount
    updateStepSize();
    updateActiveDot();

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
  }, []);

  const dotsCount = getDotsCount();

  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} icon={icon} />

      <div id={id} class="relative">
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
                "w-[calc(50%-(20px/2))]", // 2 items
                "sm:w-[calc(33.3%-(40px/3))]", // 3 items
                "md:w-[calc(25%-(60px/4))]", // 4 items
                "lg:w-[calc(20%-(80px/5))]", // 5 items
                "2xl:w-[calc(16.6%-(100px/6))]", // 6 items
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
