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
    <div class="relative w-full text-white text-center">
      {/* Imagem de fundo */}
      <img
        src={image}
        alt={promoName}
        class="w-full object-cover max-h-[400px]"
        loading="eager"
      />

      {/* Overlay com título e countdown */}
      <div class="absolute inset-0 flex flex-col justify-center items-center px-4 bg-black/40">
        <h2 class="text-3xl md:text-5xl font-bold mb-3">{title}</h2>

        <div class="flex items-center justify-center gap-4 text-lg md:text-xl">
          <div class="text-left">
            <p class="uppercase text-sm font-semibold tracking-wide text-gray-300">
              Termina em:
            </p>
          </div>
          <div class="font-mono font-bold flex gap-2">
            <span>{days}d</span>
            <span>{String(hours).padStart(2, "0")}h</span>
            <span>{String(minutes).padStart(2, "0")}m</span>
            <span>{String(seconds).padStart(2, "0")}s</span>
          </div>
        </div>
      </div>

      {/* Retângulo verde abaixo da imagem */}
      <div class="bg-green-600 text-white flex items-center justify-center gap-2 py-3">
        <strong class="text-base md:text-lg">{promoName}</strong>
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
