import { useId } from "../../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";

export interface Props {
  images: {
    desktop: Image;
    mobile: Image;
    alt: string;
    href?: string;
  }[];
  itemsToShow?: number;
  enableSlider?: boolean;
  gap?: number;
}

function MosaicImage({
  image,
  lcp,
}: {
  image: Props["images"][number];
  lcp?: boolean;
}) {
  const { desktop, mobile, alt, href } = image;

  const content = (
    <>
      <img
        src={mobile}
        alt={alt}
        class="object-cover w-full h-full md:hidden"
        loading={lcp ? "eager" : "lazy"}
      />
      <img
        src={desktop}
        alt={alt}
        class="object-cover w-full h-full hidden md:block"
        loading={lcp ? "eager" : "lazy"}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} class="block h-full w-full">
        {content}
      </a>
    );
  }

  return <div class="block h-full w-full">{content}</div>;
}

export default function BannerMosaicWithMobileSlider({
  images,
  itemsToShow = 4,
  enableSlider = false,
  gap = 3,
}: Props) {
  const id = useId();

  return (
    <Section id={id} class="container px-5 py-6 md:py-11">
      {/* Slider no mobile */}
      <div class="block md:hidden">
        <Slider
          class="carousel carousel-center gap-3"
          snap="snap-start first:ml-4 last:mr-4"
        >
          {images?.map((image, index) => (
            <Slider.Item
              index={index}
              class="carousel-item min-w-[80%]" // 1 item + 0.25 parcial
            >
              <MosaicImage image={image} lcp={index < 2} />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      {/* Desktop layout */}
      <div class="hidden md:block">
        {enableSlider ? (
          <Slider
            class="carousel carousel-center gap-3"
            snap="snap-start first:ml-6 last:mr-6"
          >
            {images?.map((image, index) => (
              <Slider.Item
                index={index}
                class={`carousel-item min-w-[calc(${100 / itemsToShow}% - ${
                  gap * 2
                }px)]`}
              >
                <MosaicImage image={image} lcp={index < 2} />
              </Slider.Item>
            ))}
          </Slider>
        ) : (
          <div class={`flex flex-wrap gap-${gap} justify-center items-stretch`}>
            {images?.slice(0, itemsToShow).map((image, index) => (
              <div class={`flex-1 max-w-[${100 / itemsToShow}%]`}>
                <MosaicImage image={image} lcp={index < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="136px" />;
