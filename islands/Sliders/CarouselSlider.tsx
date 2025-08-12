import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

// Dot de navegação
function Dot({
  index,
  ...props
}: {
  index: number;
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class={clx("focus:outline-none group", props.class?.toString())}
    />
  );
}

// Componente raiz do slider
export default function CarouselSlider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

// Item individual do slider
function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & {
  index: number;
}) {
  return <li data-slider-item={index} {...props} />;
}

// Botão "Próximo"
function NextButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="next" aria-label="Next item" {...props} />;
}

// Botão "Anterior"
function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="prev" aria-label="Previous item" {...props} />;
}

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
  autoplay?: boolean;
}

function onLoad({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  autoplay = false,
}: Props) {
  function init() {
    const THRESHOLD = 0.6;
    const root = document.getElementById(rootId);
    if (!root) return;

    const slider = root.querySelector<HTMLElement>("ul[data-slider]");
    const items = root.querySelectorAll<HTMLElement>("li[data-slider-item]");
    const prev = root.querySelector<HTMLElement>('button[data-slide="prev"]');
    const next = root.querySelector<HTMLElement>('button[data-slide="next"]');
    const dots = root.querySelectorAll<HTMLElement>("button[data-dot]");

    if (!slider || items.length === 0) {
      console.warn("Slider not initialized correctly", { rootId });
      return;
    }

    const intersectionX = (element: DOMRect, container: DOMRect): number => {
      const delta = container.width / 1000;
      if (element.right < container.left - delta) return 0.0;
      if (element.left > container.right + delta) return 0.0;
      if (element.left < container.left - delta) {
        return element.right - container.left + delta;
      }
      if (element.right > container.right + delta) {
        return container.right - element.left + delta;
      }
      return element.width;
    };

    const isHTMLElement = (x: Element): x is HTMLElement =>
      typeof (x as any).offsetLeft === "number";

    const getElementsInsideContainer = () => {
      const indices: number[] = [];
      const sliderRect = slider.getBoundingClientRect();
      for (let index = 0; index < items.length; index++) {
        const item = items.item(index);
        const rect = item.getBoundingClientRect();
        const ratio = intersectionX(rect, sliderRect) / rect.width;
        if (ratio > THRESHOLD) indices.push(index);
      }
      return indices;
    };

    const goToItem = (to: number) => {
      const item = items.item(to);
      if (!isHTMLElement(item)) return;

      const sliderRect = slider.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      // Verifica se o item já está visível
      const ratio = intersectionX(itemRect, sliderRect) / itemRect.width;
      if (ratio > THRESHOLD) return;

      slider.scrollTo({
        top: 0,
        behavior: scroll,
        left: item.offsetLeft - root.offsetLeft,
      });
    };

    const onClickPrev = (event?: Event) => {
      event?.stopPropagation();
      event?.preventDefault();
      const indices = getElementsInsideContainer();
      if (indices.length === 0) return;

      const firstVisible = indices[0];
      const targetIndex =
        firstVisible > 0 ? firstVisible - 1 : infinite ? items.length - 1 : 0;
      goToItem(targetIndex);
    };

    const onClickNext = (event?: Event) => {
      event?.stopPropagation();
      event?.preventDefault();
      const indices = getElementsInsideContainer();
      if (indices.length === 0) return;

      const lastVisible = indices[indices.length - 1];
      const targetIndex =
        lastVisible < items.length - 1
          ? lastVisible + 1
          : infinite
          ? 0
          : items.length - 1;
      goToItem(targetIndex);
    };

    const observer = new IntersectionObserver(
      (elements) => {
        elements.forEach((e) => {
          const index = Number(e.target.getAttribute("data-slider-item")) || 0;
          const dot = dots?.item(index);

          if (e.isIntersecting) {
            dot?.setAttribute("disabled", "");
          } else {
            dot?.removeAttribute("disabled");
          }
        });
      },
      { threshold: THRESHOLD, root: slider }
    );

    items.forEach((item) => observer.observe(item));

    dots?.forEach((dot, index) => {
      dot.addEventListener("click", () => goToItem(index));
    });

    prev?.addEventListener("click", onClickPrev);
    next?.addEventListener("click", onClickNext);

    if (interval && autoplay) {
      let intervalId: number | null = null;

      const startAutoplay = () => {
        if (intervalId === null) {
          intervalId = setInterval(onClickNext, interval) as unknown as number;
        }
      };

      const stopAutoplay = () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      startAutoplay();

      slider.addEventListener("mouseenter", stopAutoplay);
      slider.addEventListener("touchstart", stopAutoplay);
      slider.addEventListener("pointerdown", stopAutoplay);

      slider.addEventListener("mouseleave", startAutoplay);
      slider.addEventListener("touchend", startAutoplay);
      slider.addEventListener("pointerup", startAutoplay);
    }

    // Drag-to-scroll
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("dragging");
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("dragging");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
}

function JS({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  autoplay = false,
}: Props) {
  const scriptContent = `(${onLoad.toString()})(${JSON.stringify({
    rootId,
    scroll,
    interval,
    infinite,
    autoplay,
  })})`;

  return (
    <script type="module" dangerouslySetInnerHTML={{ __html: scriptContent }} />
  );
}

// Expondo a função globalmente para acesso direto
if (typeof window !== "undefined") {
  window.CarouselSliderOnLoad = onLoad;
}

CarouselSlider.Dot = Dot;
CarouselSlider.Item = Item;
CarouselSlider.NextButton = NextButton;
CarouselSlider.PrevButton = PrevButton;
CarouselSlider.JS = JS;
