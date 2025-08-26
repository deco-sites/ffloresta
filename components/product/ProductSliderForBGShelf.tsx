import { Product } from "apps/commerce/types.ts";
import ProductCarouselSlider from "../../islands/Sliders/ProductCarouselSlider.tsx";
import ProductCard from "./ProductCard/ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSliderForBGShelf({ products, itemListName }: Props) {
  const id = useId();
  const groupSize = 2;
  const dotCount = Math.ceil(products.length / groupSize);
  const infinite = true; // Este slider parece ser infinito

  return (
    <>
      <div id={id} class="relative container mx-auto px-4 lg:px-[48px]">
        <ProductCarouselSlider
          interval={8000}
          autoplay
          infinite={infinite}
          class="flex gap-3 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden"
        >
          {products.map((product, index) => (
            <ProductCarouselSlider.Item
              index={index}
              class="snap-start flex-shrink-0 min-h-[460px] max-[450px]:min-h-[450px]  max-[768px]:w-[calc(50%-(12px/2))] max-[1024px]:w-[calc(33.3%-(24px/3))] max-[1240px]:w-[calc(25%-(72px/4))] w-[calc(20%-(96px/5))]"
            >
              <ProductCard
                index={index}
                product={product}
                itemListName={itemListName}
                class="shadow-[5px_5px_7px_0px_rgba(0,0,0,0.15)] w-[98%] h-[98%]"
              />
            </ProductCarouselSlider.Item>
          ))}
        </ProductCarouselSlider>

        {/* Dots no mobile */}
        <div class="flex justify-center items-center gap-2 mt-4 lg:hidden">
          {Array.from({ length: dotCount }).map((_, index) => (
            <ProductCarouselSlider.Dot
              index={index}
              class="w-2 h-2 lg:w-3 lg:h-3 bg-transparent border border-[#ffffff] data-[active]:bg-[#ffffff] transition-colors cursor-pointer"
            />
          ))}
        </div>

        {/* Botões de navegação com SVG personalizado */}
        <ProductCarouselSlider.PrevButton
          class="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition-opacity hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          aria-label="Produtos anteriores"
          disabled={!infinite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span class="sr-only">Produtos anteriores</span>
        </ProductCarouselSlider.PrevButton>

        <ProductCarouselSlider.NextButton
          class="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition-opacity hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          aria-label="Próximos produtos"
          disabled={!infinite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="sr-only">Próximos produtos</span>
        </ProductCarouselSlider.NextButton>
      </div>
      <ProductCarouselSlider.JS
        rootId={id}
        interval={8000}
        autoplay
        infinite={infinite}
        groupSize={groupSize}
      />
    </>
  );
}

export default ProductSliderForBGShelf;
