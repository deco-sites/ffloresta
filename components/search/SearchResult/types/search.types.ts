import type { ImageWidget } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";

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
  bannerImage?: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
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
  bannerImage?: {
    mobile?: ImageWidget;
    desktop?: ImageWidget;
    altText: string;
  };
  seoText?: SeoText;
  seoConfig?: SeoConfig;
}
