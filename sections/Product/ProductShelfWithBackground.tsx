import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Section from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { type LoadingFallbackProps } from "@deco/deco";
import { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";
import ProductSliderForBGShelf from "../../components/product/ProductSliderForBGShelf.tsx";
import type { Flag } from "../../loaders/flags-config.ts";

/** @title Imagem de Fundo */
export interface ImageBackground {
  /** @title Tipo */
  "@type": "image";
  /** @title Imagem para Desktop */
  desktop: {
    src?: ImageWidget;
  };
  /** @title Imagem para Mobile */
  mobile: {
    src?: ImageWidget;
  };
}

/** @title Vídeo de Fundo */
export interface VideoBackground {
  /** @title Tipo */
  "@type": "video";
  /** @title Vídeo para Desktop */
  desktop?: VideoWidget;
  /** @title Vídeo para Mobile */
  mobile?: VideoWidget;
  /** @title Imagem de Poster (opcional) */
  autoplay?: boolean;
  /** @title Loop */
  loop?: boolean;
  /** @title Sem Áudio */
  muted?: boolean;
}

/** @title Item de Fundo */
export type BackgroundItem = ImageBackground | VideoBackground;

export interface Props {
  products: Product[] | null;
  /** @title Fundo da Prateleira */
  background?: BackgroundItem;
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
  icon?: ImageWidget;
  flagsConfig?: Flag[];
}

function BackgroundRenderer({ background }: { background: BackgroundItem }) {
  if (background["@type"] === "image") {
    const { desktop, mobile } = background;
    const hasBg = desktop.src && mobile.src;

    if (!hasBg) return null;

    return (
      <div class="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcset={mobile.src} />
          <source media="(min-width: 768px)" srcset={desktop.src} />
          <img
            src={desktop.src}
            alt="Background da Prateleira de Produtos"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
      </div>
    );
  }

  const {
    desktop,
    mobile,
    autoplay = true,
    loop = true,
    muted = true,
  } = background;
  const hasVideo = desktop && mobile;

  if (!hasVideo) return null;

  return (
    <div class="absolute inset-0 z-0">
      {/* Vídeo para mobile */}
      <video
        class="object-cover w-full h-full md:hidden"
        alt="Background da Prateleira de Produtos"
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
      >
        <source src={mobile} />
      </video>

      {/* Vídeo para desktop */}
      <video
        class="object-cover w-full h-full hidden md:block"
        alt="Background da Prateleira de Produtos"
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
      >
        <source src={desktop} />
      </video>
    </div>
  );
}

export default function ProductShelfWithBackground({
  products,
  title,
  cta,
  background,
  icon,
  flagsConfig = [],
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
    background &&
    (background["@type"] === "image"
      ? background.desktop.src && background.mobile.src
      : background.desktop && background.mobile);

  return (
    <Section.Container {...viewItemListEvent} class="container">
      <Section.Header title={title} cta={cta} icon={icon} />

      <div class="relative w-full py-12">
        {hasBg && <BackgroundRenderer background={background} />}

        <div class="relative z-10">
          <ProductSliderForBGShelf
            products={products}
            itemListName={title}
            hasBg={!!hasBg}
            flagsConfig={flagsConfig}
            class="bg-transparent p-0"
          />
        </div>
      </div>
    </Section.Container>
  );
}

export const LoadingFallback = ({
  title,
  cta,
  icon,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} icon={icon} />
    <Section.Placeholder height="471px" />
  </Section.Container>
);
