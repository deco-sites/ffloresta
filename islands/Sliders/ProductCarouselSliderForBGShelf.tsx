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
      aria-label={`Ir para o item ${index + 1}`}
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
}

const onLoad = ({ rootId, scroll, interval, infinite, autoplay }: Props) => {
  function init() {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLButtonElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLButtonElement>('[data-slide="next"]');
    const dots = root?.querySelectorAll<HTMLButtonElement>("[data-dot]");

    if (!slider || !items?.length) return;

    let currentIndex = 0;

    const setActiveDot = (index: number) => {
      if (!dots) return;
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.setAttribute("data-active", "true");
        } else {
          dot.removeAttribute("data-active");
        }
      });
    };

    const updateButtons = () => {
      if (!prev || !next) return;

      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const isAtStart = slider.scrollLeft <= 0;
      const isAtEnd = slider.scrollLeft >= maxScroll - 5; // Margem de 5px para evitar problemas de arredondamento

      // Atualiza o estado disabled dos botões
      prev.disabled = isAtStart && !infinite;
      next.disabled = isAtEnd && !infinite;

      // Atualiza as classes CSS baseadas no estado disabled
      if (prev.disabled) {
        prev.classList.add("opacity-50", "cursor-not-allowed");
        prev.classList.remove("cursor-pointer", "hover:bg-gray-100");
      } else {
        prev.classList.remove("opacity-50", "cursor-not-allowed");
        prev.classList.add("cursor-pointer", "hover:bg-gray-100");
      }

      if (next.disabled) {
        next.classList.add("opacity-50", "cursor-not-allowed");
        next.classList.remove("cursor-pointer", "hover:bg-gray-100");
      } else {
        next.classList.remove("opacity-50", "cursor-not-allowed");
        next.classList.add("cursor-pointer", "hover:bg-gray-100");
      }
    };

    const scrollToItem = (index: number) => {
      const item = items[index];
      if (!item) return;

      const itemLeft = item.offsetLeft - slider.offsetLeft;

      slider.scrollTo({
        left: itemLeft,
        behavior: scroll,
      });

      currentIndex = index;
      setActiveDot(index);
      updateButtons();
    };

    const scrollNext = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const scrollLeft = slider.scrollLeft;

      // Se estiver no final e não for infinito, não faz nada
      if (scrollLeft >= maxScroll - 5 && !infinite) {
        updateButtons();
        return;
      }

      // encontra o primeiro item que esteja depois do scroll atual
      for (let i = 0; i < items.length; i++) {
        const itemLeft = items[i].offsetLeft - slider.offsetLeft;
        if (itemLeft > scrollLeft + 1) {
          scrollToItem(i);
          return;
        }
      }

      if (infinite) {
        scrollToItem(0);
      } else {
        slider.scrollTo({ left: maxScroll, behavior: scroll });
        currentIndex = items.length - 1;
        setActiveDot(currentIndex);
        updateButtons();
      }
    };

    const scrollPrev = () => {
      const scrollLeft = slider.scrollLeft;

      // Se estiver no início e não for infinito, não faz nada
      if (scrollLeft <= 5 && !infinite) {
        updateButtons();
        return;
      }

      // encontra o último item que esteja antes do scroll atual
      for (let i = items.length - 1; i >= 0; i--) {
        const itemLeft = items[i].offsetLeft - slider.offsetLeft;
        if (itemLeft < scrollLeft - 1) {
          scrollToItem(i);
          return;
        }
      }

      if (infinite) {
        scrollToItem(items.length - 1);
      } else {
        slider.scrollTo({ left: 0, behavior: scroll });
        currentIndex = 0;
        setActiveDot(currentIndex);
        updateButtons();
      }
    };

    // Adiciona event listener para scroll manual
    const handleScroll = () => {
      updateButtons();

      // Atualiza o dot ativo baseado na posição do scroll
      const scrollLeft = slider.scrollLeft;
      for (let i = 0; i < items.length; i++) {
        const itemLeft = items[i].offsetLeft - slider.offsetLeft;
        const itemWidth = items[i].offsetWidth;

        if (
          scrollLeft >= itemLeft - itemWidth / 2 &&
          scrollLeft < itemLeft + itemWidth / 2
        ) {
          currentIndex = i;
          setActiveDot(i);
          break;
        }
      }
    };

    prev?.addEventListener("click", scrollPrev);
    next?.addEventListener("click", scrollNext);
    slider.addEventListener("scroll", handleScroll);

    dots?.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        scrollToItem(idx);
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
      slider.addEventListener("touchstart", stopAutoplay);
      slider.addEventListener("touchend", startAutoplay);
    }

    // Inicializa
    scrollToItem(0);

    // Adiciona resize listener para atualizar os botões quando a janela é redimensionada
    window.addEventListener("resize", updateButtons);
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
}: Props) {
  const scriptContent = `(${onLoad.toString()})(${
    JSON.stringify({
      rootId,
      scroll,
      interval,
      infinite,
      autoplay,
    })
  })`;

  return (
    <script type="module" dangerouslySetInnerHTML={{ __html: scriptContent }} />
  );
}

if (typeof window !== "undefined") {
  window.ProductCarouselSliderOnLoad = onLoad;
}

ProductCarouselSlider.Dot = Dot;
ProductCarouselSlider.Item = Item;
ProductCarouselSlider.NextButton = NextButton;
ProductCarouselSlider.PrevButton = PrevButton;
ProductCarouselSlider.JS = JS;

export default ProductCarouselSlider;
