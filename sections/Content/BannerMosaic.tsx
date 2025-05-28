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
      {/* Imagem para mobile */}
      <img
        src={mobile}
        alt={alt}
        class="object-cover w-full h-full md:hidden"
        loading={lcp ? "eager" : "lazy"}
      />
      {/* Imagem para desktop */}
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

export default function BannerMosaic({
  images,
  itemsToShow = 4,
  enableSlider = false,
  gap = 3,
}: Props) {
  const id = useId();

  if (enableSlider) {
    return (
      <Section id={id} class="container px-5 md:px-0 py-6 md:py-11">
        <Slider
          class="carousel carousel-center gap-3"
          snap="snap-center sm:snap-start block first:ml-6 sm:first:ml-0 last:mr-6 sm:last:mr-0"
        >
          {images?.map((image, index) => (
            <Slider.Item
              index={index}
              class="carousel-item min-w-[calc(50%-6px)] sm:min-w-[calc(25%-9px)] lg:min-w-[calc(20%-12px)]"
            >
              <MosaicImage image={image} lcp={index < 2} />
            </Slider.Item>
          ))}
        </Slider>
      </Section>
    );
  }

  return (
    <div
      id={id}
      class={`container flex flex-col md:flex-row flex-wrap items-stretch justify-center px-5 md:px-0 py-6 md:py-11 gap-${gap}`}
    >
      {images?.slice(0, itemsToShow).map((image, index) => (
        <div
          class={`flex-1 min-h-[200px] md:min-h-[300px] w-full md:max-w-[${
            100 / itemsToShow
          }%]`}
        >
          <MosaicImage image={image} lcp={index < 2} />
        </div>
      ))}
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="136px" />;
