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
  // Construir a URL correta de embed do YouTube
  const youtubeEmbedUrl =
    `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0`;

  return (
    <div class="container max-h-[507px] relative w-full h-screen">
      {/* Background Image */}
      <div class="absolute inset-0 z-0 px-5 2xl:px-0">
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
      <div class="relative z-10 grid grid-cols-2 h-full w-full">
        {/* Primeira div vazia */}
        <div class="bg-transparent"></div>

        {/* Segunda div com player de vídeo */}
        <div class="flex items-center justify-center p-4">
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
