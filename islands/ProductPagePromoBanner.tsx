/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks";
import type { ImageWidget as Image } from "apps/admin/widgets.ts";

export interface ProductPagePromoBannerProps {
  image: Image;
  countdownDate: string;
  title: string;
  promoName: string;
}
export default function PromoCountdownIsland({
  image,
  countdownDate,
  title,
  promoName,
}: ProductPagePromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState(getRemaining());

  function getRemaining() {
    const diff = new Date(countdownDate).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemaining();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownDate]);

  if (timeLeft <= 0) return null;

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div class="flex flex-col">
      <div class="relative w-full text-white text-center">
        <img
          src={image}
          alt={promoName}
          class="w-full object-cover max-h-[60px]"
          loading="eager"
        />

        <div class="absolute inset-0 flex justify-between items-start p-3 bg-black/40">
          <h2 class="text-lg md:text-sm">{title}</h2>

          <div class="flex flex-col items-center justify-end text-lg md:text-xl">
            <p class="text-left text-[12px] leading-none uppercase tracking-wide text-white">
              Termina em:
            </p>
            <div class="leading-none flex items-center gap-1">
              <span class="text-[12px]">{days}D</span>
              <div class="flex items-center leading-none">
                <span class="text-[12px] leading-none">
                  {String(hours).padStart(2, "0")}:
                </span>
                <span class="text-[12px] leading-none">
                  {String(minutes).padStart(2, "0")}:
                </span>
                <span class="text-[12px] leading-none">
                  {String(seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#97a37f]  flex items-center justify-start gap-2 p-2">
        <strong class="text-base text-[#3A4332]">{promoName}</strong>
      </div>
    </div>
  );
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}
