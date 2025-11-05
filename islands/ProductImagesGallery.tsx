import { useComputed, useSignal } from "@preact/signals";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductImagesGallery(props: Props) {
  const currentIndex = useSignal(0);
  const thumbStartIndex = useSignal(0);
  const thumbsPerView = 6;
  const isZoomed = useSignal(false);
  const zoomPosition = useSignal({ x: 50, y: 50 });

  if (!props.page) return null;

  const images =
    props.page.product.image || props.page.product.isVariantOf?.image || [];
  const thumbs = images.map((img) => ({
    url: img.url!,
    alt: img.alternateName,
  }));

  const showThumbSlider = thumbs.length > thumbsPerView;

  const visibleThumbs = useComputed(() => {
    return showThumbSlider
      ? thumbs.slice(
          thumbStartIndex.value,
          thumbStartIndex.value + thumbsPerView
        )
      : thumbs;
  });

  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % thumbs.length;
    isZoomed.value = false;
  };

  const prev = () => {
    currentIndex.value =
      (currentIndex.value - 1 + thumbs.length) % thumbs.length;
    isZoomed.value = false;
  };

  const nextThumbs = () => {
    if (thumbStartIndex.value + thumbsPerView < thumbs.length) {
      thumbStartIndex.value++;
    }
  };

  const prevThumbs = () => {
    if (thumbStartIndex.value > 0) {
      thumbStartIndex.value--;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed.value) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomPosition.value = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  const handleMouseEnter = () => {
    isZoomed.value = true;
  };

  const handleMouseLeave = () => {
    isZoomed.value = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed.value) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];

    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    zoomPosition.value = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  };

  return (
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="hidden lg:flex flex-col items-center gap-2">
        {showThumbSlider && (
          <button
            onClick={prevThumbs}
            disabled={thumbStartIndex.value === 0}
            class="p-1 disabled:opacity-30 transition-opacity rounded-full hover:bg-gray-100"
            aria-label="Miniaturas anteriores"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 15L12 9L6 15"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          class={`flex flex-col gap-2 ${
            showThumbSlider
              ? "max-h-[435px] overflow-hidden"
              : "max-h-[520px] overflow-y-auto custom-scrollbar"
          }`}
        >
          {visibleThumbs.value.map((thumb, index) => {
            const originalIndex = showThumbSlider
              ? thumbStartIndex.value + index
              : index;

            return (
              <button
                key={originalIndex}
                onClick={() => {
                  currentIndex.value = originalIndex;
                  isZoomed.value = false;
                }}
                class={`w-20 h-20 border-2 transition-colors ${
                  originalIndex === currentIndex.value
                    ? "border-gray-300"
                    : "border-transparent"
                } hover:border-gray-200 bg-white p-1`}
                aria-label={`Visualizar imagem ${originalIndex + 1} de ${
                  thumbs.length
                }`}
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
            );
          })}
        </div>

        {showThumbSlider && (
          <button
            onClick={nextThumbs}
            disabled={thumbStartIndex.value + thumbsPerView >= thumbs.length}
            class="p-1 disabled:opacity-30 transition-opacity rounded-full hover:bg-gray-100"
            aria-label="Próximas miniaturas"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div class="relative flex-1 flex justify-center items-center">
        <div
          class={`relative overflow-hidden rounded-lg ${
            isZoomed.value ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          style={{
            aspectRatio: "1/1",
            maxHeight: "550px",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchStart={() => (isZoomed.value = true)}
          onTouchEnd={() => (isZoomed.value = false)}
          onClick={() => (isZoomed.value = !isZoomed.value)}
        >
          <Image
            src={thumbs[currentIndex.value]?.url}
            alt={thumbs[currentIndex.value]?.alt || "Imagem do produto"}
            width={600}
            height={600}
            class={`w-full h-full object-contain transition-all duration-200 ${
              isZoomed.value ? "scale-150" : "scale-100"
            }`}
            style={
              isZoomed.value
                ? {
                    transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`,
                    transform: `scale(1.5)`,
                  }
                : {}
            }
            loading={currentIndex.value === 0 ? "eager" : "lazy"}
          />
        </div>

        {thumbs.length > 1 && (
          <>
            <div class="hidden lg:flex absolute inset-0 justify-between items-center px-4 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                class="pointer-events-auto bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all"
                aria-label="Imagem anterior"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="text-gray-700"
                >
                  <path
                    fill="currentColor"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                class="pointer-events-auto bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all"
                aria-label="Próxima imagem"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="text-gray-700"
                >
                  <path
                    fill="currentColor"
                    d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                  />
                </svg>
              </button>
            </div>

            <div class="lg:hidden flex items-center justify-center gap-4 mt-4">
              <button
                onClick={prev}
                disabled={thumbs.length <= 1}
                class="p-2 disabled:opacity-30 bg-white rounded-full shadow-sm"
                aria-label="Imagem anterior"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="text-gray-700"
                >
                  <path
                    fill="currentColor"
                    d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                  />
                </svg>
              </button>

              <div class="flex gap-2 overflow-x-auto py-2 px-1">
                {thumbs.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      currentIndex.value = index;
                      isZoomed.value = false;
                    }}
                    class={`w-[84px] h-[70px] border rounded transition-colors flex-shrink-0 ${
                      index === currentIndex.value
                        ? "border-blue-600"
                        : "border-transparent"
                    } bg-white p-1`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.alt}
                      width={84}
                      height={70}
                      class="object-contain w-full h-full rounded"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={next}
                disabled={thumbs.length <= 1}
                class="p-2 disabled:opacity-30 bg-white rounded-full shadow-sm"
                aria-label="Próxima imagem"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="text-gray-700"
                >
                  <path
                    fill="currentColor"
                    d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
