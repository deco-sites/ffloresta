import BannerMosaicIsland, {
  Props as BannerMosaicProps,
} from "../../islands/BannerMosaicIsland.tsx";
import Section from "../../components/ui/Section.tsx";
import { SpacingProps, spacingToStyle } from "../../utils/spacing.ts";

export interface Props extends BannerMosaicProps {
  /**
   * @title Título da Seção
   * @description Título opcional para a seção do mosaico
   */
  title?: string;

  /**
   * @title Descrição
   * @description Texto descritivo opcional para a seção
   */
  description?: string;

  /**
   * @title Configurações de Espaçamento
   * @description Controle de margins e paddings para a seção completa
   */
  spacing?: SpacingProps;

  /**
   * @title Fundo da Seção
   * @description Cor ou imagem de fundo para a seção completa
   */
  background?: {
    /**
     * @title Cor de Fundo
     * @default transparent
     */
    color?: string;

    /**
     * @title Imagem de Fundo
     */
    image?: {
      /**
       * @title URL da Imagem
       */
      src: string;

      /**
       * @title Posicionamento
       * @default center center
       */
      position?: string;

      /**
       * @title Repetição
       * @default no-repeat
       */
      repeat?: string;

      /**
       * @title Tamanho
       * @default cover
       */
      size?: string;
    };
  };
}

export default function BannerMosaicSection(props: Props) {
  const { title, description, background, spacing, ...bannerProps } = props;

  const sectionStyle = {
    ...spacingToStyle(spacing),
    ...(background?.color && { backgroundColor: background.color }),
    ...(background?.image && {
      backgroundImage: `url(${background.image.src})`,
      backgroundPosition: background.image.position || "center center",
      backgroundRepeat: background.image.repeat || "no-repeat",
      backgroundSize: background.image.size || "cover",
    }),
  };

  return (
    <div class="w-full" style={sectionStyle}>
      <div class="container">
        {(title || description) && (
          <div class="text-center mb-8">
            {title && <h2 class="text-3xl font-bold mb-2">{title}</h2>}
            {description && <p class="text-lg">{description}</p>}
          </div>
        )}
        <BannerMosaicIsland {...bannerProps} />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="400px" />;
