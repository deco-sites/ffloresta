import { Product } from "apps/commerce/types.ts";
import ProductCarouselSlider from "../../islands/Sliders/ProductCarouselSliderForBGShelf.tsx";
import ProductCard from "./ProductCard/ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
  hasBg: boolean;
  flagsConfig?: Flag[];
}

function ProductSliderForBGShelf({
  products,
  itemListName,
  hasBg,
  flagsConfig = [],
}: Props) {
  const id = useId();

  return (
    <>
      <div id={id} class="relative container mx-auto px-4 lg:px-[48px]">
        <ProductCarouselSlider
          interval={8000}
          autoplay
          infinite={false} // DESABILITA loop para controlar disabled
          class="flex gap-3 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden"
        >
          {products.map((product, index) => (
            <ProductCarouselSlider.Item
              index={index}
              class="snap-start flex-shrink-0 min-h-[460px] max-[450px]:min-h-[450px] max-[768px]:w-[calc(50%-(12px/2))] max-[1024px]:w-[calc(33.3%-(24px/3))] max-[1240px]:w-[calc(25%-(72px/4))] w-[calc(20%-(96px/5))]"
            >
              <ProductCard
                index={index}
                product={product}
                itemListName={itemListName}
                class="shadow-[5px_5px_7px_0px_rgba(0,0,0,0.15)] w-[98%] h-[98%]"
                flagsConfig={flagsConfig}
              />
            </ProductCarouselSlider.Item>
          ))}
        </ProductCarouselSlider>

        <div class="flex justify-center items-center gap-2 mt-4 lg:hidden">
          {products.map((_, index) => (
            <ProductCarouselSlider.Dot
              index={index}
              class={`w-2 h-2 lg:w-3 lg:h-3 bg-transparent border transition-colors ${
                hasBg
                  ? "border-white data-[active]:bg-white"
                  : "border-[#1F251C] data-[active]:bg-[#1F251C]"
              }`}
            />
          ))}
        </div>
        {/* Botões */}
        <ProductCarouselSlider.PrevButton
          class="hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Produtos anteriores"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </ProductCarouselSlider.PrevButton>
        <ProductCarouselSlider.NextButton
          class="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Próximos produtos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </ProductCarouselSlider.NextButton>
      </div>

      <ProductCarouselSlider.JS
        rootId={id}
        interval={8000}
        autoplay
        infinite={false}
      />
    </>
  );
}

export default ProductSliderForBGShelf;
