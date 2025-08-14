import { effect, useSignal } from "@preact/signals";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductImagesGallery(props: Props) {
  const currentIndex = useSignal(0);

  if (!props.page) return null;

  const images = props.page.product.image ||
    props.page.product.isVariantOf?.image || [];
  const thumbs = images.map((img) => ({
    url: img.url!,
    alt: img.alternateName,
  }));

  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % thumbs.length;
  };

  const prev = () => {
    currentIndex.value = (currentIndex.value - 1 + thumbs.length) %
      thumbs.length;
  };

  return (
    <div class="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails Vertical (Desktop) */}
      <div class="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[520px] custom-scrollbar">
        {thumbs.map((thumb, index) => (
          <button
            key={index}
            onClick={() => {
              currentIndex.value = index;
            }}
            class={`w-20 h-20 border-2 rounded transition-colors ${
              index === currentIndex.value
                ? "border-primary"
                : "border-transparent"
            } hover:border-gray-300`}
            aria-label={`Visualizar imagem ${index + 1} de ${thumbs.length}`}
          >
            <Image
              src={thumb.url}
              alt={thumb.alt}
              width={80}
              height={80}
              class="object-contain w-full h-full"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Imagem Principal */}
      <div class="relative flex-1">
        <Image
          key={currentIndex.value} // Força recarregar componente quando muda
          src={thumbs[currentIndex.value]?.url}
          alt={thumbs[currentIndex.value]?.alt || "Imagem do produto"}
          class="w-full max-h-[550px] object-contain transition-opacity duration-300 aspect-square"
          loading={currentIndex.value === 0 ? "eager" : "lazy"}
        />

        {/* Setas de Navegação (Desktop) */}
        {thumbs.length > 1 && (
          <>
            <div class="hidden lg:flex absolute inset-0 justify-between items-center px-4 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                class="pointer-events-auto bg-white/80 p-2 rounded-full hover:bg-white"
                aria-label="Imagem anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                class="pointer-events-auto bg-white/80 p-2 rounded-full hover:bg-white"
                aria-label="Próxima imagem"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </button>
            </div>

            {/* Navegação Mobile - Modificado para mostrar miniaturas */}
            <div class="lg:hidden flex items-center justify-center gap-4 mt-4">
              <button
                onClick={prev}
                disabled={thumbs.length <= 1}
                class="p-2 disabled:opacity-30"
                aria-label="Imagem anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
              </button>

              <div class="flex gap-2 overflow-x-auto  py-2">
                {thumbs.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      currentIndex.value = index;
                    }}
                    class={`w-[84px] h-[70px] border rounded transition-colors ${
                      index === currentIndex.value
                        ? "border-base-400"
                        : "border-transparent"
                    }`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.alt}
                      class="object-contain w-full h-full rounded"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={next}
                disabled={thumbs.length <= 1}
                class="p-2 disabled:opacity-30"
                aria-label="Próxima imagem"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
