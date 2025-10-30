import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";

export interface Banner {
  /** @title Imagem para Desktop */
  desktop: ImageWidget;
  /** @title Imagem para Mobile */
  mobile: ImageWidget;
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
  desktop: VideoWidget;
  /** @title Vídeo para Mobile */
  mobile: VideoWidget;
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

/** @titleSlide Item */
export type BannerItem =
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
  products: Product[] | null;
  /** @title Banner */
  banner?: BannerItem;
  /**
   * @title Orientação do layout
   * @default horizontal
   */
  orientation?: "horizontal" | "vertical";
  /** @title Título da Seção */
  title?: string;
  /** @title Link "Ver Todos" */
  cta?: string;
  /** @title Ícone */
  icon?: ImageWidget;
}

export default function ProductShelfWithBanner({
  products,
  title,
  cta,
  banner,
  orientation = "horizontal",
  icon,
}: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: title,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ),
      },
    },
  });

  const hasBg =
    banner &&
    (banner["@type"] === "image"
      ? banner.data.desktop && banner.data.mobile
      : banner.data.desktop && banner.data.mobile);

  const renderBanner = () => {
    if (!banner) return null;

    const href = banner.data.action?.href;
    const content =
      banner["@type"] === "image" ? (
        <picture>
          <source media="(max-width: 767px)" srcSet={banner.data.mobile} />
          <source media="(min-width: 768px)" srcSet={banner.data.desktop} />
          <img
            src={banner.data.desktop}
            alt={banner.data.alt}
            class="w-full h-auto object-cover"
          />
        </picture>
      ) : (
        <video
          class="w-full h-auto object-cover"
          alt={banner.data.alt}
          autoPlay={banner.data.autoplay}
          loop={banner.data.loop}
          muted={banner.data.muted}
          poster={banner.data.poster}
          playsInline
        >
          <source src={banner.data.desktop} media="(min-width: 768px)" />
          <source src={banner.data.mobile} media="(max-width: 767px)" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      );

    return (
      <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
        {href ? (
          <a href={href} class="block">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <Section.Container {...viewItemListEvent} class="container">
      <div
        class={`flex gap-10 ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        } w-full mx-auto lg:mx-0 xl:max-w-none`}
      >
        {/* Banner Section */}
        {hasBg && renderBanner()}

        {/* Shelf Section */}
        <div class={orientation === "vertical" ? "w-full" : "flex-1"}>
          <Section.Header title={title} cta={cta} icon={icon} />
          <ProductSlider products={products} itemListName={title} />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="471px" />;
  </Section.Container>
);
