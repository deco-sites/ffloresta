import { useId } from "../../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../islands/Slider.tsx";

export interface Props {
  benefits: Benefit[];
}

interface Benefit {
  benefitImgSrc: Image;
  benefitImgAltText: string;
  benefitText: HTML;
  benefitLink?: string;
}

interface BenefitItemProps {
  benefit: Benefit;
  key?: string;
}

const BenefitItem = ({ benefit }: BenefitItemProps) => {
  return (
    <a className="w-full h-full" href={benefit.benefitLink}>
      <div className="group flex items-center gap-3 transition duration-200 ease-in-out text-[#273D28] w-full h-full rounded p-0">
        <div className="flex-shrink-0">
          <img
            src={benefit.benefitImgSrc}
            alt={benefit.benefitImgAltText}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div
          className="flex-1 min-w-0 text-[#273D28] text-[12px] lg:text-[14px]"
          dangerouslySetInnerHTML={{ __html: benefit.benefitText }}
        />
      </div>
    </a>
  );
};

const ProductBenefits = ({ benefits }: Props) => {
  const id = useId();

  return (
    <div id={id} className="relative mt-6 mb-11">
      <div className="relative">
        <Slider
          rootId={id} // Usando o mesmo ID para tudo
          interval={2500}
          autoplay={true}
          infinite={true}
          class="carousel carousel-center w-full"
          snap="snap-center sm:snap-start block"
        >
          {benefits?.map((benefit, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-full sm:w-1/2 lg:w-1/4"
            >
              <div className="w-full px-4">
                <BenefitItem benefit={benefit} />
              </div>
            </Slider.Item>
          ))}
        </Slider>
      </div>

      {/* Dots de navegação */}
      <div class="flex justify-center gap-2 mt-4 hidden">
        {benefits?.map((_, index) => (
          <Slider.Dot
            index={index}
            class="w-3 h-3 border border-[#273D28] focus:outline-none disabled:bg-[#273D28] transition-colors"
          >
            <span class="sr-only">Benefício {index + 1}</span>
          </Slider.Dot>
        ))}
      </div>

      {/* JS com todas as props necessárias */}
      <Slider.JS rootId={id} interval={2500} autoplay={true} infinite={true} />
    </div>
  );
};

export default ProductBenefits;

export const LoadingFallback = () => <Section.Placeholder height="136px" />;
