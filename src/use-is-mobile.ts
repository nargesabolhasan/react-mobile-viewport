import { DEFAULT_MOBILE_MAX_WIDTH } from "./constants";
import { maxWidthQuery } from "./media-query";
import { useViewportConfig } from "./provider";
import type { UseIsMobileOptions } from "./types";
import { useMediaQuery } from "./use-media-query";

export function useIsMobile(options: UseIsMobileOptions = {}): boolean {
  const config = useViewportConfig();
  const breakpoint = options.breakpoint ?? config.breakpoint ?? DEFAULT_MOBILE_MAX_WIDTH;
  const ssrIsMobile = options.ssrIsMobile ?? config.ssrIsMobile;

  return useMediaQuery(maxWidthQuery(breakpoint), { ssrMatch: ssrIsMobile });
}
