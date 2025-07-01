import Slider from "../../components/ui/Slider.tsx";
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
    <div id={id}>
      <Slider class="carousel carousel-center w-full flex items-center justify-center gap-6 bg-[#3A4332] text-white">
        {alerts.map((alert, index) => (
          <Slider.Item index={index} class="carousel-item">
            <span
              class="px-5 py-2 w-full text-center font-['FS_Emeric'] font-normal text-[16.87px] leading-none"
              dangerouslySetInnerHTML={{ __html: alert }}
            />
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default Alert;
