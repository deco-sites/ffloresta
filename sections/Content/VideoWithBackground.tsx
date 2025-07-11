import type { ImageWidget } from "apps/admin/widgets.ts";

export interface BackgroundProps {
  desktop: {
    src: ImageWidget;
    alt?: string;
  };
  mobile: {
    src: ImageWidget;
    alt?: string;
  };
}

export interface Props {
  background: BackgroundProps;
  youtubeVideoId: string;
}

export default function VideoWithBackground({
  background,
  youtubeVideoId,
}: Props) {
  const youtubeEmbedUrl =
    `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0`;

  return (
    <div class="container relative w-full h-screen max-h-[507px]">
      {/* Background Image */}
      <div class="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 767px)" srcset={background.mobile.src} />
          <source media="(min-width: 768px)" srcset={background.desktop.src} />
          <img
            src={background.desktop.src}
            alt={background.desktop.alt || "Background"}
            class="w-full h-full object-cover"
          />
        </picture>
      </div>

      {/* Grid Container */}
      <div class="relative z-10 h-full w-full flex items-center justify-center lg:grid lg:grid-cols-2">
        {/* Em telas menores que 1024px, o vídeo ocupará a tela toda e ficará centralizado */}
        <div class="w-full h-full flex items-center justify-center p-4 lg:hidden">
          <div class="w-full h-auto aspect-video max-w-2xl">
            <iframe
              src={youtubeEmbedUrl}
              class="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            >
            </iframe>
          </div>
        </div>

        {/* Layout para telas maiores que 1024px (mantendo o layout original) */}
        <div class="hidden lg:block bg-transparent"></div>
        <div class="hidden lg:flex items-center justify-center p-4">
          <div class="w-full h-auto aspect-video max-w-2xl">
            <iframe
              src={youtubeEmbedUrl}
              class="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
