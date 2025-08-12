import { type HTMLWidget, type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  title?: string;
  description?: HTMLWidget;
  description2?: HTMLWidget;

  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };
}

function Institucional({ title, description, description2, images }: Props) {
  return (
    <Section.Container class=" bg-[#FDFFF5]">
      <div class="flex flex-col-reverse md:flex-row items-center gap-8 bg-[#FDFFF5] lg:ml-[3em] lg:mr-[3em]">
        {/* Imagem */}
        <div class="w-full lg:w-1/2">
          <Picture>
            <Source
              media="(max-width: 640px)"
              src={images.mobile}
              width={328}
              height={203}
            />
            <Source
              media="(min-width: 640px)"
              src={images.desktop}
              width={644}
              height={400}
            />
            <img
              src={images.desktop}
              alt={title || "Institucional"}
              class="w-full object-cover rounded-md shadow-md"
              loading="lazy"
            />
          </Picture>
        </div>

        {/* Texto */}
        {(title || description || description2) && (
          <div class="w-full lg:w-1/2 text-left">
            {title && (
              <h2
                class="font-bold mb-4"
                style={{
                  color: "var(--Cores-de-Texto-Preta, #353535)",
                  fontFamily: '"Lato"',
                  fontSize: "28px",
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <div
                class="leading-relaxed mb-4"
                style={{
                  color: "var(--Cores-de-Texto-Preta, #353535)",
                  fontFamily: '"Lato"',
                  fontSize: "16px",
                }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {description2 && (
              <div
                class="leading-relaxed mb-4"
                style={{
                  color: "var(--Cores-de-Texto-Preta, #353535)",
                  fontFamily: '"Lato"',
                  fontSize: "16px",
                }}
                dangerouslySetInnerHTML={{ __html: description2 }}
              />
            )}
          </div>
        )}
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Institucional;
