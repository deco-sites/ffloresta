import type { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useScript } from "@deco/deco/hooks";

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
function Slider(props: JSX.IntrinsicElements["ul"]) {
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
  return (
    <button
      disabled
      data-slide="next"
      aria-label="Next item"
      {...props}
    />
  );
}

// Botão "Anterior"
function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button disabled data-slide="prev" aria-label="Previous item" {...props} />
  );
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
      typeof (x as Element).offsetLeft === "number";

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
      if (!isHTMLElement(item) || !slider) return;

      slider.scrollTo({
        top: 0,
        behavior: scroll,
        left: item.offsetLeft - (slider.offsetLeft || 0),
      });
    };

    const onClickPrev = (event?: Event) => {
      event?.stopPropagation();
      const indices = getElementsInsideContainer();
      if (indices.length === 0) return;

      const itemsPerPage = indices.length;
      const isShowingFirst = indices[0] === 0;
      const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);
      goToItem(
        isShowingFirst ? items.length - 1 : (pageIndex - 1) * itemsPerPage,
      );
    };

    const onClickNext = (event?: Event) => {
      event?.stopPropagation();
      const indices = getElementsInsideContainer();
      if (indices.length === 0) return;

      const itemsPerPage = indices.length;
      const isShowingLast = indices[indices.length - 1] === items.length - 1;
      const pageIndex = Math.floor(indices[0] / itemsPerPage);
      goToItem(isShowingLast ? 0 : (pageIndex + 1) * itemsPerPage);
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

          if (!infinite) {
            if (index === 0) {
              prev?.toggleAttribute("disabled", e.isIntersecting);
            }
            if (index === items.length - 1) {
              next?.toggleAttribute("disabled", e.isIntersecting);
            }
          }
        });
      },
      { threshold: THRESHOLD, root: slider },
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
        }),
      }}
    />
  );
}

Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;

export default Slider;
