import { Context } from "deco/deco.ts";

export interface Props {
  /**
   * @title Remove All Query Parameters
   * @description If enabled, removes ALL query parameters from canonical URLs
   * @default false
   */
  removeAllParams?: boolean;

  /**
   * @title Force HTTPS
   * @description Ensure canonical URLs always use HTTPS
   * @default true
   */
  forceHttps?: boolean;

  /**
   * @title Remove Trailing Slash
   * @description Remove trailing slash from canonical URLs
   * @default true
   */
  removeTrailingSlash?: boolean;
}

/**
 * @title Canonical URL Loader
 * @description Determines the correct canonical URL for the current page
 */
export default function canonicalUrl(
  props: Props,
  req: Request,
  ctx: Context,
): string {
  const {
    removeAllParams = false,
    forceHttps = true,
    removeTrailingSlash = true,
  } = props;

  const url = new URL(req.url);
  const host = req.headers.get("host") || "www.ffloresta.com.br";

  // Create clean URL
  let canonicalUrl = `${url.protocol}//${host}${url.pathname}`;

  // Force HTTPS if needed
  if (forceHttps) {
    canonicalUrl = canonicalUrl.replace("http://", "https://");
  }

  // Handle query parameters
  if (!removeAllParams) {
    const allowedParams = ["page", "sort", "q"];
    const searchParams = new URLSearchParams();

    url.searchParams.forEach((value, key) => {
      if (allowedParams.includes(key)) {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      canonicalUrl += `?${queryString}`;
    }
  }

  // Remove trailing slash
  if (
    removeTrailingSlash &&
    canonicalUrl.endsWith("/") &&
    canonicalUrl !== "https://" + host + "/"
  ) {
    canonicalUrl = canonicalUrl.slice(0, -1);
  }

  return canonicalUrl;
}
