import { type HTMLWidget, type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  title?: string;
  description?: HTMLWidget;

  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };

  cta?: {
    href?: string;
    label?: string;
  };
}

function Banner({ title, description, images, cta }: Props) {
  return (
    <Section.Container>
      <div class="pt-[6em]">
        <Picture>
          <Source
            media="(max-width: 640px)"
            src={images.mobile}
            width={360}
            height={104}
          />
          <Source
            media="(min-width: 640px)"
            src={images.desktop}
            width={1320}
            height={480}
          />
          <img
            src={images.desktop}
            alt={title || "Banner"}
            class="w-full object-cover"
          />
        </Picture>

        {(title || description || (cta?.href && cta?.label)) && (
          <div
            class={clx(
              "absolute left-0 top-0",
              "p-5 sm:p-10 md:py-20 md:px-[60px]",
              "flex flex-col",
              "h-full max-w-full sm:max-w-[33%] md:max-w-[50%] justify-center",
            )}
          >
            {title && (
              <span class="font-bold text-7xl text-primary">{title}</span>
            )}
            {description && (
              <span
                class="font-normal text-sm md:pt-4 pb-12"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {cta?.href && cta?.label && (
              <div class="">
                <a
                  href={cta.href}
                  class="btn btn-primary no-animation w-fit border-0 min-w-[180px]"
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Banner;
