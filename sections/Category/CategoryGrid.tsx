import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { useId } from "../../sdk/useId.ts";

/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label?: string;
}

export interface Props extends SectionHeaderProps {
  items: Item[];
  showArrows?: boolean;
}

function Card({ image, href, label }: Item) {
  return (
    <a
      href={href}
      class="flex flex-col items-center justify-center gap-4 w-full h-full"
    >
      <div class="rounded-full flex justify-center items-center w-full h-full max-w-[200px] mx-auto">
        <Image
          src={image}
          alt={label || "Category"}
          loading="lazy"
          class="w-full h-full object-contain"
          decoding="async"
        />
      </div>
      {label && (
        <span class="font-['FS_Emeric'] font-bold text-[16px] leading-[170%] tracking-[0.16em] text-[#3A4332] text-center">
          {label}
        </span>
      )}
    </a>
  );
}

function CategoryGrid({ title, cta, items, showArrows = true }: Props) {
  const id = useId();

  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} />

      <div id={id} class="relative px-[20px]">
        <Slider class="carousel justify-between carousel-center gap-6 w-full">
          {items.map((i, index) => (
            <Slider.Item
              index={index}
              class={clx(
                "carousel-item",
                "last:pr-5 last:sm:pr-0",
                // Mobile: 1 item
                "w-[calc(100%-12px)]",
                // Tablet pequeno: 2 itens
                "sm:w-[calc(50%-16px)]",
                // Tablet: 3 itens
                "md:w-[calc(33.333%-16px)]",
                // Desktop: 6 itens (16.666% de largura)
                "lg:w-[calc(16.666%-20px)]",
                // Removi o xl:w-[calc(20%-20px)] para manter apenas 6 itens em desktop
              )}
            >
              <Card {...i} />
            </Slider.Item>
          ))}
        </Slider>

        {showArrows && (
          <>
            <Slider.PrevButton class="absolute left-0 top-1/2 -translate-y-1/2 w-[20px]  flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10">
              <svg
                width="20"
                height="32"
                viewBox="0 0 17 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="max-w-full max-h-full"
              >
                <path
                  d="M15.7277 31.0748C15.095 31.0748 14.5495 30.8535 14.1036 30.4137L1.51477 17.9967L1.31848 17.7858C1.13768 17.5709 1.00053 17.3434 0.91028 17.1031L0.833131 16.8639C0.767457 16.6212 0.735498 16.3661 0.735475 16.0992C0.735475 15.8322 0.767366 15.5765 0.833131 15.3336L0.91028 15.0953C1.00056 14.8548 1.1375 14.6268 1.31848 14.4117L1.51477 14.2008L14.1036 1.78479C14.4796 1.41399 14.9408 1.20332 15.4767 1.15002L15.7111 1.13635C16.2725 1.12785 16.7648 1.29274 17.1788 1.62952L17.3517 1.78479C17.7976 2.22464 18.0236 2.76369 18.0236 3.39026C18.0235 4.01684 17.7977 4.55589 17.3517 4.99573L6.09485 16.0992L17.3517 27.2018C17.7278 27.5727 17.942 28.0287 17.9962 28.5592L18.0099 28.7916C18.0197 29.427 17.7992 29.9724 17.3517 30.4137L17.1798 30.568C16.768 30.905 16.2813 31.0748 15.7277 31.0748Z"
                  fill="#292929"
                  stroke="#292929"
                  stroke-width="0.421669"
                />
              </svg>
            </Slider.PrevButton>

            <Slider.NextButton class="absolute right-0 top-1/2 -translate-y-1/2 w-[20px]  flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10">
              <svg
                width="20"
                height="32"
                viewBox="0 0 17 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="max-w-full max-h-full"
              >
                <path
                  d="M3.27234 0.541626C3.90496 0.54167 4.45051 0.762985 4.89636 1.20276L17.4852 13.6198L17.6815 13.8307C17.8623 14.0456 17.9995 14.273 18.0897 14.5133L18.1669 14.7526C18.2325 14.9952 18.2645 15.2504 18.2645 15.5172C18.2645 15.7843 18.2326 16.04 18.1669 16.2828L18.0897 16.5211C17.9994 16.7616 17.8625 16.9896 17.6815 17.2047L17.4852 17.4156L4.89636 29.8317C4.52044 30.2025 4.05924 30.4131 3.52332 30.4664L3.28894 30.4801C2.7275 30.4886 2.23518 30.3237 1.82117 29.9869L1.64832 29.8317C1.20236 29.3918 0.97644 28.8528 0.97644 28.2262C0.976468 27.5996 1.20231 27.0606 1.64832 26.6207L12.9052 15.5172L1.64832 4.41467C1.27216 4.04373 1.05801 3.58778 1.00378 3.05725L0.990112 2.82483C0.980323 2.18941 1.20083 1.64405 1.64832 1.20276L1.82019 1.04846C2.23195 0.711458 2.71872 0.541626 3.27234 0.541626Z"
                  fill="#292929"
                  stroke="#292929"
                  stroke-width="0.421669"
                />
              </svg>
            </Slider.NextButton>
          </>
        )}
        <Slider.JS rootId={id} />
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="165px" />;
  </Section.Container>
);

export default CategoryGrid;
