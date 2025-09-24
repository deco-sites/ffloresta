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
  
  /** @description Vídeo MP4 para desktop (opcional) */
  desktopVideo?: string;
  /** @description Vídeo MP4 para mobile (opcional) */
  mobileVideo?: string;

  cta?: {
    href?: string;
    label?: string;
  };
}

function Banner({ title, description, images, desktopVideo, mobileVideo, cta }: Props) {
  return (
    <Section.Container>
      <div>
        {/* Mobile content */}
        <div class="block sm:hidden w-full">
          {mobileVideo ? (
            <video
              class="w-full object-cover"
              autoplay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ height: '104px' }}
            >
              <source src={mobileVideo} type="video/mp4" />
              <img
                src={images.mobile}
                alt={title || "Banner"}
                class="w-full object-cover"
                style={{ height: '104px' }}
              />
            </video>
          ) : (
            <img
              src={images.mobile}
              alt={title || "Banner"}
              class="w-full object-cover"
              style={{ height: '104px' }}
            />
          )}
        </div>
        
        {/* Desktop content */}
        <div class="hidden sm:block w-full">
          {desktopVideo ? (
            <video
              class="w-full object-cover"
              autoplay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ height: '480px' }}
            >
              <source src={desktopVideo} type="video/mp4" />
              <img
                src={images.desktop}
                alt={title || "Banner"}
                class="w-full object-cover"
                style={{ height: '480px' }}
              />
            </video>
          ) : (
            <img
              src={images.desktop}
              alt={title || "Banner"}
              class="w-full object-cover"
              style={{ height: '480px' }}
            />
          )}
        </div>

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
