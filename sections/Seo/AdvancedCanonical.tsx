import { Head } from "$fresh/runtime.ts";

export interface Props {
  /**
   * @title Canonical URL
   * @description The canonical URL for the current page
   */
  url: string;
}

/**
 * @title Canonical Tag
 * @description Adds canonical tag to page head for SEO
 */
export default function AdvancedCanonical({ url }: Props) {
  return (
    <Head>
      <link rel="canonical" href={url} />
    </Head>
  );
}
