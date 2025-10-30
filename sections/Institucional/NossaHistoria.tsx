import { type HTMLWidget, type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  title?: string;
  description?: HTMLWidget;
  description2?: HTMLWidget;
  images: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
  };
}

function Institucional({ title, description, description2, images }: Props) {
  // Se não há nenhum conteúdo, não renderiza nada
  if (
    !title &&
    !description &&
    !description2 &&
    !images.mobile &&
    !images.desktop
  ) {
    return null;
  }

  const hasImage = images.mobile || images.desktop;
  const hasText = title || description || description2;

  console.log(description, "description");

  return (
    <Section.Container class="bg-[#FDFFF5]">
      <div
        class={`flex ${
          hasImage ? "flex-col-reverse md:flex-row" : "flex-col"
        } items-center gap-8 bg-[#FDFFF5] lg:mx-[3em]`}
      >
        {/* Imagem - só renderiza se existir */}
        {hasImage && (
          <div class={`w-full ${hasText ? "lg:w-1/2" : "lg:w-full"}`}>
            <Picture>
              {images.mobile && (
                <Source
                  media="(max-width: 640px)"
                  src={images.mobile}
                  width={328}
                  height={203}
                />
              )}
              {images.desktop && (
                <Source
                  media="(min-width: 640px)"
                  src={images.desktop}
                  width={1320}
                  height={480}
                />
              )}
              <img
                src={images.desktop || images.mobile}
                alt={title || "Institucional"}
                class="w-full object-cover rounded-md shadow-md"
                loading="lazy"
              />
            </Picture>
          </div>
        )}

        {/* Texto - só renderiza se existir algum conteúdo de texto */}
        {hasText && (
          <div
            class={`w-full ${hasImage ? "lg:w-1/2" : "lg:w-full"} text-left`}
          >
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
                class="leading-relaxed mb-4 institutional-content"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {description2 && (
              <div
                class="leading-relaxed mb-4 institutional-content"
                dangerouslySetInnerHTML={{ __html: description2 }}
              />
            )}
          </div>
        )}
      </div>

      {/* Adiciona CSS específico para o conteúdo institucional */}
      {/* Adiciona CSS específico para o conteúdo institucional */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .institutional-content {
        font-family: "Lato";
        font-size: 16px;
        line-height: 1.6;
      }

      /* Parágrafos normais */
      .institutional-content p {
      }

      /* Parágrafos VAZIOS criam quebra de linha */
      .institutional-content p:empty {
        display: block;
        min-height: 1em; /* Define a altura da quebra de linha */
        margin: 0;
      }

      /* Negrito */
      .institutional-content strong,
      .institutional-content b {
        font-weight: 700;
        color: #353535;
      }

      /* Itálico */
      .institutional-content em,
      .institutional-content i {
        font-style: italic;
      }

      /* Listas não ordenadas (bullet points) */
      .institutional-content ul {
        list-style-type: disc;
        margin-left: 1.5em;
        padding-left: 0.5em;
      }

      /* Listas ordenadas (numeradas) */
      .institutional-content ol {
        list-style-type: decimal;
        margin-left: 1.5em;
        padding-left: 0.5em;
      }

      /* Itens de lista */
      .institutional-content li {
        line-height: 1.6;
      }

      /* Links */
      .institutional-content a {
        color: #0066cc;
        text-decoration: underline;
      }

      .institutional-content a:hover {
        color: #004499;
      }

      /* Títulos */
      .institutional-content h1,
      .institutional-content h2,
      .institutional-content h3 {
        font-weight: 700;
        margin-top: 1em;
      }

      .institutional-content h1 { font-size: 2em; }
      .institutional-content h2 { font-size: 1.5em; }
      .institutional-content h3 { font-size: 1.25em; }
    `,
        }}
      />
    </Section.Container>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Institucional;
