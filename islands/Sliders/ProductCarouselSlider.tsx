import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useScript } from "@deco/deco/hooks";

function Dot({
  index,
  ...props
}: { index: number } & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`Ir para o grupo ${index + 1}`}
      class={clx("focus:outline-none group", props.class?.toString())}
    />
  );
}

function ProductCarouselSlider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="next" {...props} />;
}

function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="prev" {...props} />;
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  autoplay?: boolean;
  groupSize?: number;
}

const onLoad = ({
  rootId,
  scroll,
  interval,
  infinite,
  autoplay,
  groupSize = 1,
}: Props) => {
  function init() {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLElement>('[data-slide="next"]');
    const dots = root?.querySelectorAll<HTMLButtonElement>("[data-dot]");

    if (!slider || !items?.length) return;

    let currentIndex = 0;

    const setActiveDot = (index: number) => {
      if (!dots) return;
      const activeDotIndex = Math.floor(index / groupSize);
      dots.forEach((dot, idx) => {
        if (idx === activeDotIndex) {
          dot.setAttribute("data-active", "true");
        } else {
          dot.removeAttribute("data-active");
        }
      });
    };

    const scrollToItem = (index: number) => {
      const item = items[index];
      if (!item) return;

      slider.scrollTo({
        left: item.offsetLeft - slider.offsetLeft,
        top: 0,
        behavior: scroll,
      });
      currentIndex = index;
      setActiveDot(index);
    };

    const scrollNext = () => {
      if (currentIndex < items.length - groupSize) {
        scrollToItem(currentIndex + groupSize);
      } else if (infinite) {
        scrollToItem(0);
      }
    };

    const scrollPrev = () => {
      if (currentIndex >= groupSize) {
        scrollToItem(currentIndex - groupSize);
      } else if (infinite) {
        scrollToItem(items.length - groupSize);
      }
    };

    // Eventos de clique
    prev?.addEventListener("click", scrollPrev);
    next?.addEventListener("click", scrollNext);

    dots?.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        scrollToItem(idx * groupSize);
      });
    });

    // Autoplay
    let autoplayInterval: number | null = null;
    const startAutoplay = () => {
      if (interval && autoplay && !autoplayInterval) {
        autoplayInterval = setInterval(
          scrollNext,
          interval,
        ) as unknown as number;
      }
    };
    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    if (autoplay) {
      startAutoplay();
      slider.addEventListener("mouseenter", stopAutoplay);
      slider.addEventListener("mouseleave", startAutoplay);
    }

    // IntersectionObserver para atualizar dot com scroll
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisibleIndex = currentIndex;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const indexAttr = entry.target.getAttribute("data-slider-item");
            const index = indexAttr ? parseInt(indexAttr) : NaN;
            if (!isNaN(index)) {
              mostVisibleIndex = index;
              maxRatio = entry.intersectionRatio;
            }
          }
        });

        if (mostVisibleIndex !== currentIndex) {
          currentIndex = mostVisibleIndex;
          setActiveDot(currentIndex);
        }
      },
      {
        root: slider,
        threshold: 0.6, // O item deve estar 60% visível para ser considerado ativo
      },
    );

    items.forEach((item) => observer.observe(item));

    // Inicializa na posição inicial
    scrollToItem(0);
  }

  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
};

function JS({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  autoplay = false,
  groupSize = 1,
}: Props) {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: useScript(onLoad, {
          rootId,
          scroll,
          interval,
          infinite,
          autoplay,
          groupSize,
        }),
      }}
    />
  );
}

ProductCarouselSlider.Dot = Dot;
ProductCarouselSlider.Item = Item;
ProductCarouselSlider.NextButton = NextButton;
ProductCarouselSlider.PrevButton = PrevButton;
ProductCarouselSlider.JS = JS;

export default ProductCarouselSlider;
