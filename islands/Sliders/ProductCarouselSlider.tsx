import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

function Dot({
  index,
  ...props
}: { index: number } & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`Ir para o grupo ${index + 1}`}
      class={clx(
        "focus:outline-none group cursor-pointer",
        props.class?.toString(),
      )}
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
  infinite = false,
  autoplay,
  groupSize = 1,
}: Props) => {
  function init() {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLButtonElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLButtonElement>('[data-slide="next"]');
    const dots = root?.querySelectorAll<HTMLButtonElement>("[data-dot]");

    if (!slider || !items?.length) return;

    let currentIndex = 0;
    let isScrolling = false;
    let autoplayInterval: number | null = null;

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    const startAutoplay = () => {
      if (interval && autoplay && !autoplayInterval) {
        autoplayInterval = setInterval(
          scrollNext,
          interval,
        ) as unknown as number;
      }
    };

    const updateNavigationButtons = () => {
      if (!prev || !next) return;

      if (infinite) {
        prev.disabled = false;
        next.disabled = false;
        return;
      }

      prev.disabled = currentIndex === 0;
      next.disabled = currentIndex >= items.length - groupSize;
    };

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
      if (isScrolling) return; // Previne múltiplos cliques durante a animação

      const item = items[index];
      if (!item) return;

      isScrolling = true;

      slider.scrollTo({
        left: item.offsetLeft - slider.offsetLeft,
        top: 0,
        behavior: scroll,
      });

      currentIndex = index;
      setActiveDot(index);
      updateNavigationButtons();

      // Libera o scrolling após a animação
      setTimeout(() => {
        isScrolling = false;
      }, 300); // Tempo aproximado da animação
    };

    const scrollNext = () => {
      if (isScrolling) return;

      if (currentIndex < items.length - groupSize) {
        scrollToItem(currentIndex + groupSize);
      } else if (infinite) {
        scrollToItem(0);
      }
    };

    const scrollPrev = () => {
      if (isScrolling) return;

      if (currentIndex >= groupSize) {
        scrollToItem(currentIndex - groupSize);
      } else if (infinite) {
        scrollToItem(items.length - groupSize);
      }
    };

    // Eventos de clique com prevenção de múltiplos cliques
    const handlePrevClick = () => {
      if (!isScrolling) {
        stopAutoplay();
        scrollPrev();
        setTimeout(startAutoplay, interval || 8000);
      }
    };

    const handleNextClick = () => {
      if (!isScrolling) {
        stopAutoplay();
        scrollNext();
        setTimeout(startAutoplay, interval || 8000);
      }
    };

    prev?.addEventListener("click", handlePrevClick);
    next?.addEventListener("click", handleNextClick);

    dots?.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        if (!isScrolling) {
          stopAutoplay();
          scrollToItem(idx * groupSize);
          setTimeout(startAutoplay, interval || 8000);
        }
      });
    });

    // Melhor controle do autoplay
    if (autoplay) {
      startAutoplay();

      const handleMouseEnter = () => {
        stopAutoplay();
        // Remove event listeners temporários durante a interação
        slider.removeEventListener("mouseleave", handleMouseLeave);
        setTimeout(() => {
          slider.addEventListener("mouseleave", handleMouseLeave);
        }, 1000);
      };

      const handleMouseLeave = () => {
        startAutoplay();
      };

      const handleTouchStart = () => {
        stopAutoplay();
        // Remove event listeners temporários durante a interação
        slider.removeEventListener("touchend", handleTouchEnd);
        setTimeout(() => {
          slider.addEventListener("touchend", handleTouchEnd);
        }, 1000);
      };

      const handleTouchEnd = () => {
        setTimeout(startAutoplay, 1000); // Pequeno delay após toque
      };

      slider.addEventListener("mouseenter", handleMouseEnter);
      slider.addEventListener("mouseleave", handleMouseLeave);
      slider.addEventListener("touchstart", handleTouchStart);
      slider.addEventListener("touchend", handleTouchEnd);

      // Cleanup function
      return () => {
        slider.removeEventListener("mouseenter", handleMouseEnter);
        slider.removeEventListener("mouseleave", handleMouseLeave);
        slider.removeEventListener("touchstart", handleTouchStart);
        slider.removeEventListener("touchend", handleTouchEnd);
        stopAutoplay();
      };
    }

    // IntersectionObserver melhorado
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return; // Não atualiza durante animação programada

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
          updateNavigationButtons();
        }
      },
      {
        root: slider,
        threshold: [0.1, 0.6, 0.9], // Múltiplos thresholds para melhor detecção
      },
    );

    items.forEach((item) => observer.observe(item));

    // Inicialização
    scrollToItem(0);
    updateNavigationButtons();

    // Cleanup
    return () => {
      stopAutoplay();
      observer.disconnect();
    };
  }

  if (document.readyState === "complete") {
    const cleanup = init();
    // Adiciona cleanup se necessário
    if (cleanup) {
      window.addEventListener("beforeunload", cleanup);
    }
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      const cleanup = init();
      if (cleanup) {
        window.addEventListener("beforeunload", cleanup);
      }
    });
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
  const scriptContent = `(${onLoad.toString()})(${
    JSON.stringify({
      rootId,
      scroll,
      interval,
      infinite,
      autoplay,
      groupSize,
    })
  })`;

  return (
    <script type="module" dangerouslySetInnerHTML={{ __html: scriptContent }} />
  );
}

// Expondo a função globalmente para acesso direto
if (typeof window !== "undefined") {
  window.ProductCarouselSliderOnLoad = onLoad;
}

ProductCarouselSlider.Dot = Dot;
ProductCarouselSlider.Item = Item;
ProductCarouselSlider.NextButton = NextButton;
ProductCarouselSlider.PrevButton = PrevButton;
ProductCarouselSlider.JS = JS;

export default ProductCarouselSlider;
