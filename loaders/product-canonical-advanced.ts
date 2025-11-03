import { Context } from "deco/deco.ts";

/**
 * @title Product Canonical URL Loader
 * @description Gets canonical URL specifically for product pages
 */
export default function productCanonical(
  _props: unknown,
  req: Request,
  _ctx: Context,
): string {
  const url = new URL(req.url);
  const host = req.headers.get("host") || "www.ffloresta.com.br";

  // For product pages, we want clean URLs without parameters
  let canonicalUrl = `https://${host}${url.pathname}`;

  // Remove trailing slash for product pages
  if (canonicalUrl.endsWith("/")) {
    canonicalUrl = canonicalUrl.slice(0, -1);
  }

  return canonicalUrl;
}
