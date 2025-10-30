import Slider from "../../islands/Sliders/AlertsSlider.tsx";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  alerts?: string[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function Alert({ alerts = [], interval = 5 }: Props) {
  const id = useId();

  return (
    <div id={id} class="w-full bg-[#3A4332] text-white overflow-hidden">
      <Slider class="carousel carousel-center w-full flex">
        {alerts.map((alert, index) => (
          <Slider.Item
            index={index}
            class="carousel-item w-full flex-shrink-0 flex justify-center"
          >
            <span
              class="px-5 py-2 w-full text-center font-normal text-[14px] lg:text-[16px] leading-none"
              dangerouslySetInnerHTML={{ __html: alert }}
            />
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS rootId={id} interval={5000} infinite={true} autoplay={true} />
    </div>
  );
}

export default Alert;
