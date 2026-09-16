import {
  DEFAULT_MOBILE_MAX_WIDTH,
  DEFAULT_VIEWPORT_COOKIE,
} from "./constants";

export interface ViewportCookieScriptOptions {
  cookieName?: string;
  breakpoint?: number;
  maxAgeSeconds?: number;
}

function assertSafeToken(value: string, label: string): void {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error(`Invalid ${label}: use only letters, numbers, _ or -`);
  }
}

export function parseViewportCookie(
  value: string | undefined | null,
): boolean | undefined {
  if (value === "mobile") return true;
  if (value === "desktop") return false;
  return undefined;
}

export function getViewportCookieScript(
  options: ViewportCookieScriptOptions = {},
): string {
  const cookieName = options.cookieName ?? DEFAULT_VIEWPORT_COOKIE;
  const breakpoint = options.breakpoint ?? DEFAULT_MOBILE_MAX_WIDTH;
  const maxAgeSeconds = options.maxAgeSeconds ?? 60 * 60 * 24 * 7;

  assertSafeToken(cookieName, "cookieName");

  if (!Number.isInteger(breakpoint) || breakpoint <= 0) {
    throw new Error("breakpoint must be a positive integer");
  }

  if (!Number.isInteger(maxAgeSeconds) || maxAgeSeconds <= 0) {
    throw new Error("maxAgeSeconds must be a positive integer");
  }

  return `(function(){try{var v=window.matchMedia("(max-width: ${breakpoint - 1}px)").matches?"mobile":"desktop";document.cookie="${cookieName}="+v+";path=/;max-age=${maxAgeSeconds};samesite=lax";}catch(e){}})();`;
}
