import type { ImageWidget } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";

export interface AdditionalMetaTag {
  /** @title Nome da Meta Tag */
  /** @description Nome da meta tag (ex: keywords, author) */
  name?: string;
  /** @title Propriedade da Meta Tag */
  /** @description Propriedade da meta tag (ex: og:title, og:description) */
  property?: string;
  /** @title Conteúdo */
  /** @description Conteúdo da meta tag */
  content: string;
}

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
  metaTitle?: string;
  /** @title Meta Description */
  /** @description Descrição para SEO que aparece nos resultados de busca (até 160 caracteres) */
  metaDescription?: string;
  /** @title Meta Tags Adicionais */
  /** @description Metatags personalizadas para Open Graph, Twitter Cards, etc. */
  additionalMetaTags?: AdditionalMetaTag[];
}

export interface Props {
  page: ProductListingPage | null;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";
  bannerImage?: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
  seoText?: SeoText;
  // title?: string; // REMOVIDO - agora está dentro de seoConfig
  /** @title Configurações de SEO */
  /** @description Configurações avançadas para SEO (meta tags, títulos, etc.) */
  seoConfig?: SeoConfig;
}

export interface SectionProps {
  url: string;
  page: ProductListingPage | null;
  startingPage?: 0 | 1;
  partial?: "hideMore" | "hideLess";
  bannerImage?: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
  seoText?: SeoText;
  seoConfig?: SeoConfig;
}
