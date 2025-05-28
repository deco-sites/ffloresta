import { useId } from "../../sdk/useId.ts";
import { ImageWidget as Image } from "apps/admin/widgets.ts";
import { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import Section from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";

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
      <div className="group flex items-center gap-3 transition duration-200 ease-in-out text-black w-full h-full rounded p-4">
        <div className="flex-shrink-0">
          <img
            src={benefit.benefitImgSrc}
            alt={benefit.benefitImgAltText}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div
          className="flex-1 min-w-0"
          dangerouslySetInnerHTML={{ __html: benefit.benefitText }}
        />
      </div>
    </a>
  );
};

const Benefits = ({ benefits }: Props) => {
  const id = useId();

  return (
    <>
      {/* Desktop View - Grid */}
      <div className="hidden md:grid container grid-cols-1 px-5 md:grid-cols-2 md:px-0 lg:grid-cols-4 gap-3 mt-6 mb-11 w-full">
        {benefits?.map((benefit: Benefit) => (
          <div key={benefit.benefitText} className="min-w-0">
            <BenefitItem benefit={benefit} />
          </div>
        ))}
      </div>

      {/* Mobile View - Slider */}
      <div id={id} className="md:hidden relative mt-6 mb-11">
        <div className="relative">
          <Slider class="carousel carousel-center w-full">
            {benefits?.map((benefit, index) => (
              <Slider.Item index={index} class="carousel-item w-full">
                <div className="w-full px-4">
                  <BenefitItem benefit={benefit} />
                </div>
              </Slider.Item>
            ))}
          </Slider>
        </div>

        {/* Dots de navegação */}
        <div class="flex justify-center gap-2 mt-4">
          {benefits?.map((_, index) => (
            <Slider.Dot
              index={index}
              class="w-3 h-3 border border-[#273D28] focus:outline-none disabled:bg-[#273D28] transition-colors"
            >
              <span class="sr-only">Benefício {index + 1}</span>
            </Slider.Dot>
          ))}
        </div>
      </div>
      <Slider.JS rootId={id} infinite />
    </>
  );
};

export default Benefits;

export const LoadingFallback = () => <Section.Placeholder height="136px" />;
