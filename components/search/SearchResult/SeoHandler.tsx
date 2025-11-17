import { useScript } from "@deco/deco/hooks";
import type { SeoConfig } from "./types/search.types.ts";

interface SeoHandlerProps {
  seoConfig?: SeoConfig;
  displayTitle?: string;
}

export default function SeoHandler({
  seoConfig,
  displayTitle,
}: SeoHandlerProps) {
  useScript(() => {
    // Atualizar title da página (meta title)
    if (seoConfig?.metaTitle) {
      document.title = seoConfig.metaTitle;
    } else if (displayTitle) {
      // Fallback: usa o título da página como meta title
      document.title = displayTitle;
    }

    // Atualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (seoConfig?.metaDescription) {
      if (metaDescription) {
        metaDescription.setAttribute("content", seoConfig.metaDescription);
      } else {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.name = "description";
        newMetaDescription.content = seoConfig.metaDescription;
        document.head.appendChild(newMetaDescription);
      }
    }

    // Adicionar/atualizar metatags adicionais
    if (seoConfig?.additionalMetaTags) {
      seoConfig.additionalMetaTags.forEach((tag) => {
        const selector = tag.name
          ? `meta[name="${tag.name}"]`
          : tag.property
          ? `meta[property="${tag.property}"]`
          : null;

        if (selector) {
          const existingTag = document.querySelector(selector);
          if (existingTag) {
            existingTag.setAttribute("content", tag.content);
          } else {
            const newTag = document.createElement("meta");
            if (tag.name) newTag.name = tag.name;
            if (tag.property) newTag.setAttribute("property", tag.property);
            newTag.content = tag.content;
            document.head.appendChild(newTag);
          }
        }
      });
    }
  });

  return null;
}
