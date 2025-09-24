// ProductImage.tsx
import type { ImageObject } from "apps/commerce/types.ts";
import type { VideoWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../../sdk/clx.ts";

interface Props {
  front: ImageObject;
  back?: ImageObject;
  frontVideo?: VideoWidget;
  backVideo?: VideoWidget;
  alt: string;
  inStock: boolean;
  preload?: boolean;
  relativeUrl: string;
}

const WIDTH = 258;
const HEIGHT = 210;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductImage({
  front,
  back,
  frontVideo,
  backVideo,
  alt,
  inStock,
  preload,
  relativeUrl,
}: Props) {
  // Validação: deve ter pelo menos uma imagem ou vídeo para o front
  const hasFrontContent = front || frontVideo;
  const hasBackContent = back || backVideo;
  
  if (!hasFrontContent) {
    return (
      <div class="w-full h-52 bg-gray-200 flex items-center justify-center mt-10">
        <p class="text-gray-500 text-center px-4 text-sm">
          ⚠️ Erro: É necessário adicionar pelo menos uma imagem ou vídeo
        </p>
      </div>
    );
  }

  return (
    <a
      href={relativeUrl}
      aria-label="view product"
      class={clx(
        "group grid grid-cols-1 grid-rows-1", // Adicionado 'group' aqui
        "w-full mt-10",
        !inStock && "opacity-70",
      )}
    >
      {/* Front content - imagem ou vídeo */}
      {frontVideo ? (
        <video
          class={clx(
            "object-cover w-full col-span-full row-span-full select-none pointer-events-none"
          )}
          style={{ aspectRatio: ASPECT_RATIO }}
          autoplay
          muted
          loop
          playsInline
          preload={preload ? "auto" : "metadata"}
        >
          <source src={frontVideo} type="video/mp4" />
          {front && (
            <Image
              src={front.url!}
              alt={alt}
              width={WIDTH}
              height={HEIGHT}
              style={{ aspectRatio: ASPECT_RATIO }}
              class={clx("object-cover", "w-full", "col-span-full row-span-full")}
              sizes="(max-width: 640px) 50vw, 20vw"
              loading={preload ? "eager" : "lazy"}
              decoding="async"
            />
          )}
        </video>
      ) : front ? (
        <Image
          src={front.url!}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
          style={{ aspectRatio: ASPECT_RATIO }}
          class={clx("object-cover", "w-full", "col-span-full row-span-full")}
          sizes="(max-width: 640px) 50vw, 20vw"
          preload={preload}
          loading={preload ? "eager" : "lazy"}
          decoding="async"
        />
      ) : null}
      
      {/* Back content - imagem ou vídeo (hover) */}
      {hasBackContent && (
        backVideo ? (
          <video
            class={clx(
              "object-cover w-full col-span-full row-span-full select-none pointer-events-none",
              "transition-opacity duration-300",
              "opacity-0 group-hover:opacity-100"
            )}
            style={{ aspectRatio: ASPECT_RATIO }}
            autoplay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={backVideo} type="video/mp4" />
            {back && (
              <Image
                src={back.url!}
                alt={alt}
                width={WIDTH}
                height={HEIGHT}
                style={{ aspectRatio: ASPECT_RATIO }}
                class={clx("object-cover", "w-full", "col-span-full row-span-full")}
                sizes="(max-width: 640px) 50vw, 20vw"
                loading="lazy"
                decoding="async"
              />
            )}
          </video>
        ) : back ? (
          <Image
            src={back.url!}
            alt={alt}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "w-full",
              "col-span-full row-span-full",
              "transition-opacity duration-300",
              "opacity-0 group-hover:opacity-100"
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        ) : null
      )}
    </a>
  );
}

export default ProductImage;
