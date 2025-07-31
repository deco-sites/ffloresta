// ProductImage.tsx
import type { ImageObject } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../../sdk/clx.ts";

interface Props {
  front: ImageObject;
  back?: ImageObject;
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
  alt,
  inStock,
  preload,
  relativeUrl,
}: Props) {
  return (
    <a
      href={relativeUrl}
      aria-label="view product"
      class={clx(
        "grid grid-cols-1 grid-rows-1",
        "w-full mt-10",
        !inStock && "opacity-70"
      )}
    >
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
      <Image
        src={back?.url ?? front.url!}
        alt={alt}
        width={WIDTH}
        height={HEIGHT}
        style={{ aspectRatio: ASPECT_RATIO }}
        class={clx(
          "object-cover",
          "w-full",
          "col-span-full row-span-full",
          "transition-opacity opacity-0 lg:group-hover:opacity-100"
        )}
        sizes="(max-width: 640px) 50vw, 20vw"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

export default ProductImage;
