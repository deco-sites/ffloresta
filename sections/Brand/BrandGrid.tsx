import BrandGridIsland from "../../islands/BrandGridIsland.tsx";
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

/** @title Item da Marca */
export type BrandItem =
  | {
      /** @title Imagem */
      "@type": "image";
      /** @title Dados da Imagem */
      data: Banner;
      /** @title Link */
      href: string;
      /** @title Rótulo */
      label?: string;
    }
  | {
      /** @title Vídeo */
      "@type": "video";
      /** @title Dados do Vídeo */
      data: VideoBanner;
      /** @title Link */
      href: string;
      /** @title Rótulo */
      label?: string;
    };

export interface Props {
  /** @title Marcas */
  brands?: BrandItem[];
  /** @title Título da Seção */
  title?: string;
  /** @title Call to Action */
  cta?: {
    text?: string;
    href?: string;
  };
  /** @title Ícone */
  icon?: ImageWidget;
}

export default function BrandGrid({ brands = [], title, cta, icon }: Props) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div>
      <BrandGridIsland
        items={brands}
        title={title}
        cta={cta?.text}
        icon={icon}
      />
    </div>
  );
}
