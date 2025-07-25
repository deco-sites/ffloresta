import { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import Slider from "../../islands/Slider.tsx";
import ProductCard from "./ProductCard.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products: Product[];
  itemListName?: string;
}

function ProductSliderForBGShelf({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div id={id} class="relative px-[20px] lg:px-[48px] container mx-auto">
        <Slider
          rootId={id}
          interval={8000}
          autoplay={true}
          class="carousel carousel-center gap-3 lg:gap-6 w-full"
        >
          {products?.map((product, index) => (
            <Slider.Item
              index={index}
              class={clx(
                "carousel-item min-h-[400px]",
                // Below 300px: 1 item (very small screens)
                "max-[299px]:w-[calc(100%-20px)]",
                // Mobile: 2 items (default for mobile)
                // Calculation: (100vw - 40px padding - 3px gap) / 2 + 1% margin for shadow
                "min-[300px]:w-[calc(44vw-20px)]", // Ajustado para acomodar o shadow
                // Tablet: 3 items
                "md:w-[calc(33.333vw-14px)]",
                // Desktop: 4 items
                "lg:w-[calc(25%-18px)]",
                // Large desktop: 5 items
                "xl:w-[calc(20%-19.2px)]",
              )}
            >
              <ProductCard
                index={index}
                product={product}
                itemListName={itemListName}
                class="shadow-[5.62px_5.62px_7.03px_0px_rgba(0,0,0,0.15)] w-full h-[98%]" // Alterado para w-full
              />
            </Slider.Item>
          ))}
        </Slider>

        {/* Navigation buttons */}
        <Slider.PrevButton class="absolute left-[8px] top-1/2 -translate-y-1/2 w-[17px] h-[32px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-15">
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.76367 19.2109C9.36457 19.2109 9.01844 19.0665 8.73828 18.7822L1.27441 11.21L1.15332 11.0752C1.04106 10.9379 0.954406 10.7917 0.897462 10.6357L0.84961 10.4824C0.808855 10.3275 0.789069 10.1651 0.789063 9.99609C0.789063 9.82716 0.808872 9.66471 0.84961 9.50976L0.897462 9.35644C0.954475 9.2003 1.04083 9.05347 1.15332 8.91601L1.27441 8.78223L8.73828 1.20996C8.97573 0.969056 9.26845 0.83244 9.60547 0.797851L9.75293 0.789062C10.1069 0.783597 10.4194 0.890995 10.6807 1.10937L10.7891 1.20996C11.0692 1.49412 11.2109 1.84386 11.2109 2.24609C11.2109 2.64819 11.0691 2.99715 10.7891 3.28125L4.1709 9.99609L10.7891 16.71C11.0603 16.9851 11.1971 17.3326 11.2031 17.7354L11.2021 17.7363C11.208 18.1434 11.0704 18.4969 10.7891 18.7822L10.6807 18.8818C10.4213 19.0999 10.1129 19.2109 9.76367 19.2109Z"
              fill="#292929"
              stroke="#292929"
              stroke-width="0.421669"
            />
          </svg>
        </Slider.PrevButton>

        <Slider.NextButton class="absolute right-[8px] top-1/2 -translate-y-1/2 w-[17px] h-[32px] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-15">
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.23633 0.789062C2.63543 0.789136 2.98156 0.933539 3.26172 1.21777L10.7256 8.79004L10.8467 8.9248C10.9589 9.06208 11.0456 9.20835 11.1025 9.36426L11.1504 9.51758C11.1911 9.67254 11.2109 9.83495 11.2109 10.0039C11.2109 10.1728 11.1911 10.3353 11.1504 10.4902L11.1025 10.6436C11.0455 10.7997 10.9592 10.9465 10.8467 11.084L10.7256 11.2178L3.26172 18.79C3.02427 19.0309 2.73155 19.1676 2.39453 19.2021L2.24707 19.2109C1.8931 19.2164 1.58056 19.109 1.31934 18.8906L1.21094 18.79C0.930789 18.5059 0.789063 18.1561 0.789063 17.7539C0.789103 17.3518 0.930921 17.0028 1.21094 16.7188L7.8291 10.0039L1.21094 3.29004C0.939694 3.01491 0.802936 2.66744 0.796875 2.26465L0.797852 2.26367C0.792037 1.85659 0.929649 1.50309 1.21094 1.21777L1.31934 1.11816C1.57867 0.900124 1.8871 0.789062 2.23633 0.789062Z"
              fill="#292929"
              stroke="#292929"
              stroke-width="0.421669"
            />
          </svg>
        </Slider.NextButton>
      </div>
      <Slider.JS rootId={id} interval={8000} autoplay={true} />
    </>
  );
}

export default ProductSliderForBGShelf;
