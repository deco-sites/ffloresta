import BannerMosaicIsland, {
  Props as BannerMosaicProps,
} from "../../islands/BannerMosaicIsland.tsx";
import Section from "../../components/ui/Section.tsx";
import { SpacingProps, spacingToStyle } from "../../utils/spacing.ts";
import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";

export interface Banner {
  /** @title Imagem para Desktop */
  desktop?: ImageWidget;
  /** @title Imagem para Mobile */
  mobile?: ImageWidget;
  /** @title Texto Alternativo */
  alt: string;
  /** @title Ação do Banner */
  action?: {
    /** @title Link */
    href?: string;
    /** @title Título */
    title?: string;
    /** @title Subtítulo */
    subTitle?: string;
    /** @title Texto do Botão */
    label?: string;
  };
}

export interface VideoBanner {
  /** @title Vídeo para Desktop */
  desktop?: VideoWidget;
  /** @title Vídeo para Mobile */
  mobile?: VideoWidget;
  /** @title Texto Alternativo */
  alt: string;
  /** @title Imagem de Poster (opcional) */
  poster?: ImageWidget;
  /** @title Reproduzir Automaticamente */
  autoplay?: boolean;
  /** @title Loop */
  loop?: boolean;
  /** @title Sem Áudio */
  muted?: boolean;
  /** @title Ação do Vídeo */
  action?: {
    /** @title Link */
    href?: string;
    /** @title Título */
    title?: string;
    /** @title Subtítulo */
    subTitle?: string;
    /** @title Texto do Botão */
    label?: string;
  };
}

/** @title Item do Mosaico */
export type MosaicItem =
  | {
      /** @title Imagem */
      "@type": "image";
      /** @title Dados da Imagem */
      data: Banner;
    }
  | {
      /** @title Vídeo */
      "@type": "video";
      /** @title Dados do Vídeo */
      data: VideoBanner;
    };

export interface Props {
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

  /** @title Itens do Mosaico */
  items?: MosaicItem[];

  /** @title Configurações do Mosaico */
  settings?: BannerMosaicProps["settings"];
}

export default function BannerMosaicSection(props: Props) {
  const { title, description, background, spacing, items, settings } = props;

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
        <BannerMosaicIsland items={items || []} settings={settings} />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="400px" />;
