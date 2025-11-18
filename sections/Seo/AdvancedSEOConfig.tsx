import { Head } from "$fresh/runtime.ts";

export interface MetaTag {
  /**
   * @title Nome/Property da Meta Tag
   * @description Ex: og:title, twitter:description, keywords, etc
   */
  name: string;

  /**
   * @title Conteúdo da Meta Tag
   */
  content: string;

  /**
   * @title Tipo da Meta Tag
   * @description Se é name ou property
   */
  type?: "name" | "property";
}

export interface Props {
  /**
   * @title Título da Página
   * @description Título para SEO (aparece na aba do navegador)
   */
  title?: string;

  /**
   * @title Descrição da Página
   * @description Descrição para SEO e redes sociais
   */
  description?: string;

  /**
   * @title Meta Tags Dinâmicas
   * @description Adicione meta tags customizadas (Open Graph, Twitter, etc)
   */
  metaTags?: MetaTag[];

  /**
   * @title Tipo de Conteúdo
   * @description Tipo do conteúdo para Open Graph
   */
  contentType?: "website" | "article" | "product";

  /**
   * @title URL Canônica
   * @description URL canônica da página (opcional)
   */
  canonicalUrl?: string;

  /**
   * @title Idioma do Conteúdo
   * @description Idioma principal da página
   * @default pt-BR
   */
  language?: string;
}

export function loader(props: Props, req: Request) {
  const url = new URL(req.url);
  const {
    title,
    description,
    metaTags = [],
    contentType = "website",
    canonicalUrl,
    language = "pt-BR",
  } = props;

  // URL base do site
  const siteUrl = "https://www.ferragensfloresta.com.br";

  // Meta tags padrão que serão mescladas com as customizadas
  const defaultMetaTags: MetaTag[] = [];

  // Title meta tags
  if (title) {
    defaultMetaTags.push(
      { name: "title", content: title, type: "name" },
      { name: "og:title", content: title, type: "property" },
      { name: "twitter:title", content: title, type: "name" }
    );
  }

  // Description meta tags
  if (description) {
    defaultMetaTags.push(
      { name: "description", content: description, type: "name" },
      { name: "og:description", content: description, type: "property" },
      { name: "twitter:description", content: description, type: "name" }
    );
  }

  // Content type and basic meta tags
  defaultMetaTags.push(
    { name: "og:type", content: contentType, type: "property" },
    { name: "og:locale", content: language, type: "property" },
    { name: "og:url", content: url.href, type: "property" }
  );

  // Twitter meta tags básicas
  defaultMetaTags.push({
    name: "twitter:card",
    content: "summary_large_image",
    type: "name",
  });

  // Combinar meta tags padrão com customizadas, evitando duplicatas
  const allMetaTags = [...defaultMetaTags];
  const existingNames = new Set(defaultMetaTags.map((tag) => tag.name));

  metaTags.forEach((customTag) => {
    if (!existingNames.has(customTag.name)) {
      // Garantir que o type tenha um valor padrão
      const normalizedTag: MetaTag = {
        ...customTag,
        type: customTag.type || "name", // Valor padrão
      };
      allMetaTags.push(normalizedTag);
      existingNames.add(customTag.name);
    }
  });

  // Determinar URL canônica
  const finalCanonicalUrl = canonicalUrl || url.href;

  return {
    title: title || "",
    description: description || "",
    metaTags: allMetaTags,
    canonicalUrl: finalCanonicalUrl,
    language,
    hasSeoData: !!(title || description || metaTags.length > 0),
  };
}

function AdvancedSEO({
  title,
  description,
  metaTags = [],
  canonicalUrl,
  language = "pt-BR",
}: ReturnType<typeof loader>) {
  // Se não houver dados de SEO, não renderiza nada
  if (!title && !description && metaTags.length === 0 && !canonicalUrl) {
    return null;
  }

  return (
    <Head>
      {/* Title */}
      {title && <title>{title}</title>}

      {/* Description */}
      {description && <meta name="description" content={description} />}

      {/* Language */}
      <meta http-equiv="content-language" content={language} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Meta Tags Dinâmicas */}
      {metaTags.map((tag, index) => {
        // Usar "name" como valor padrão se type for undefined
        const tagType = tag.type || "name";

        if (tagType === "property") {
          return <meta key={index} property={tag.name} content={tag.content} />;
        } else {
          return <meta key={index} name={tag.name} content={tag.content} />;
        }
      })}

      {/* Meta Tags padrão para responsividade */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}

export default AdvancedSEO;
