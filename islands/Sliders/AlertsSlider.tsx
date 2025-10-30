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
      aria-label={`go to slider item ${index}`}
      class={clx("focus:outline-none group", props.class?.toString())}
    />
  );
}

function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return <button data-slide="next" aria-label="Next item" {...props} />;
}

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

const onLoad = ({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
  autoplay = false,
}: Props) => {
  function init() {
    const root = document.getElementById(rootId);
    const slider = root?.querySelector<HTMLElement>("[data-slider]");
    const items = root?.querySelectorAll<HTMLElement>("[data-slider-item]");
    const prev = root?.querySelector<HTMLElement>('[data-slide="prev"]');
    const next = root?.querySelector<HTMLElement>('[data-slide="next"]');

    if (!slider || !items?.length) return;

    let currentIndex = 0;

    const scrollToItem = (index: number) => {
      const item = items[index];
      if (!item) return;

      slider.scrollTo({
        left: item.offsetLeft - slider.offsetLeft,
        top: 0,
        behavior: scroll,
      });
      currentIndex = index;
    };

    const scrollNext = () => {
      if (currentIndex < items.length - 1) {
        scrollToItem(currentIndex + 1);
      } else if (infinite) {
        scrollToItem(0);
      }
    };

    const scrollPrev = () => {
      if (currentIndex > 0) {
        scrollToItem(currentIndex - 1);
      } else if (infinite) {
        scrollToItem(items.length - 1);
      }
    };

    prev?.addEventListener("click", scrollPrev);
    next?.addEventListener("click", scrollNext);

    // autoplay
    let autoplayInterval: number | null = null;
    const startAutoplay = () => {
      if (interval && autoplay && !autoplayInterval) {
        autoplayInterval = setInterval(
          scrollNext,
          interval
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

    // inicializa na posição correta
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

if (typeof window !== "undefined") {
  window.SliderOnLoad = onLoad;
}

Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;
Slider.JS = JS;

export default Slider;
