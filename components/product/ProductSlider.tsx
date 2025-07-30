import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Slider from "../../islands/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSlider({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div id={id} class="relative container mx-auto px-0">
        <Slider
          interval={8000}
          autoplay
          infinite
          class="flex gap-3 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden"
        >
          {products.map((product, index) => (
            <Slider.Item
              index={index}
              class="snap-start flex-shrink-0 min-h-[500px] max-[450px]:min-h-[430px]  max-[768px]:w-[calc(50%-10px)] max-[1024px]:w-[calc(33.3%-10px)] max-[1240px]:w-[calc(25%-20px)] w-[calc(20%-21px)]"
            >
              <ProductCard
                index={index}
                product={product}
                itemListName={itemListName}
                class="w-full"
              />
            </Slider.Item>
          ))}
        </Slider>

        <Slider.PrevButton class="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 flex items-center justify-center">
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
        </Slider.PrevButton>

        <Slider.NextButton class="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full w-8 h-8 flex items-center justify-center">
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
        </Slider.NextButton>
      </div>
      <Slider.JS rootId={id} interval={8000} autoplay />
    </>
  );
}

export default ProductSlider;
