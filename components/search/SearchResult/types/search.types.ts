import type {
  HTMLWidget as HTML,
  ImageWidget,
  VideoWidget,
} from "apps/admin/widgets.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";

/** @title Banner de Imagem */
export interface BannerImage {
  /** @title Imagem para Desktop */
  desktop?: ImageWidget;
  /** @title Imagem para Mobile */
  mobile?: ImageWidget;
  /** @title Texto Alternativo */
  alt: string;
}

/** @title Banner de Vídeo */
export interface BannerVideo {
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
}

/** @title Banner da Página */
export type SearchBanner =
  | {
    /** @title Tipo */
    "@type": "image";
    /** @title Dados da Imagem */
    data: BannerImage;
  }
  | {
    /** @title Tipo */
    "@type": "video";
    /** @title Dados do Vídeo */
    data: BannerVideo;
  };

export interface SeoText {
  title?: string;
  description?: HTML;
}

export interface SeoConfig {
  /** @title Título da Página (H1) */
  /** @description Título principal da página que será exibido para os usuários. Se não preenchido, será usado o nome da categoria. */
  pageTitle?: string;
  /** @title Meta Title */
  /** @description Título para SEO que aparece na aba do navegador e nos resultados de busca (até 60 caracteres) */
}

export interface Props {
  page: ProductListingPage | null;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";

  /**
   * @title Banner da Página
   * @description Banner superior da página de search (imagem ou vídeo)
   */
  banner?: SearchBanner;

  seoText?: SeoText;

  /** @title Configurações de SEO */
  /** @description Configurações avançadas para SEO (meta tags, títulos, etc.) */
  seoConfig?: SeoConfig;
}

export interface SectionProps {
  url: string;
  page: ProductListingPage | null;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";

  /**
   * @title Banner da Página
   * @description Banner superior da página de search (imagem ou vídeo)
   */
  banner?: SearchBanner;

  seoText?: SeoText;
  seoConfig?: SeoConfig;
}
