import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import type { Flag } from "../../loaders/flags-config.ts";

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

/** @title Banner do Header */
export type HeaderBannerItem =
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
  title?: string;
  cta?: string;
  icon?: ImageWidget;
  /** @title Banner do Header */
  headerBanner?: HeaderBannerItem;
  /** @title Configurações de Flags */
  flagsConfig?: Flag[];
}

export default function ProductShelf({
  products,
  title,
  cta,
  icon,
  headerBanner,
  flagsConfig = [],
}: Props) {
  console.log("FlagsConfig recebidas:", flagsConfig);

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

  const renderHeaderBanner = () => {
    if (!headerBanner || !headerBanner.data) return null;

    const { data } = headerBanner;
    const href = data.action?.href;

    const content =
      headerBanner["@type"] === "image" ? (
        <>
          {data.desktop && data.mobile && (
            <picture>
              <source media="(max-width: 767px)" srcSet={data.mobile} />
              <source media="(min-width: 768px)" srcSet={data.desktop} />
              <img
                src={data.desktop}
                alt={data.alt}
                class="w-full h-auto object-cover max-h-16"
              />
            </picture>
          )}
        </>
      ) : (
        <>
          {data.desktop && data.mobile && (
            <video
              class="w-full h-auto object-cover max-h-16"
              alt={data.alt}
              autoPlay={data.autoplay}
              loop={data.loop}
              muted={data.muted}
              poster={data.poster}
              playsInline
            >
              <source src={data.desktop} media="(min-width: 768px)" />
              <source src={data.mobile} media="(max-width: 767px)" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          )}
        </>
      );

    return (
      <div class="flex-1 min-w-0">
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

  const hasHeaderBanner = headerBanner && headerBanner.data;

  return (
    <Section.Container {...viewItemListEvent} class="container">
      <div class="w-full mx-auto lg:mx-0 xl:max-w-none mt-8">
        <div class="px-4 lg:px-0">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div class="flex-1 min-w-0">
              <Section.Header title={title} cta={cta} icon={icon} />
            </div>
            {hasHeaderBanner && renderHeaderBanner()}
          </div>
        </div>
        <div class="mt-14">
          <ProductSlider products={products} itemListName={title} />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
  icon,
  headerBanner,
}: LoadingFallbackProps<Props>) => {
  const hasHeaderBanner = headerBanner && headerBanner.data;

  return (
    <Section.Container>
      <div class="w-full mx-auto lg:mx-0 xl:max-w-none mt-8">
        <div class="px-4 lg:px-0">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div class="flex-1 min-w-0">
              <Section.Header title={title} cta={cta} icon={icon} />
            </div>
            {hasHeaderBanner && (
              <div class="flex-1 min-w-0">
                <div class="w-full h-16 bg-gray-200 animate-pulse" />
              </div>
            )}
          </div>
        </div>
        <div class="mt-14">
          <Section.Placeholder height="471px" />
        </div>
      </div>
    </Section.Container>
  );
};
