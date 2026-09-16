import {
  DEFAULT_MOBILE_MAX_WIDTH,
  DEFAULT_TABLET_MAX_WIDTH,
} from "./constants";
import { betweenWidthQuery, maxWidthQuery } from "./media-query";
import { useViewportConfig } from "./provider";
import type { BreakpointName, UseBreakpointOptions } from "./types";
import { useMediaQuery } from "./use-media-query";

export function useBreakpoint(
  options: UseBreakpointOptions = {},
): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: BreakpointName;
} {
  const config = useViewportConfig();
  const mobileMaxWidth =
    options.mobileMaxWidth ?? config.breakpoint ?? DEFAULT_MOBILE_MAX_WIDTH;
  const tabletMaxWidth =
    options.tabletMaxWidth ?? config.tabletMaxWidth ?? DEFAULT_TABLET_MAX_WIDTH;
  const ssrBreakpoint = options.ssrBreakpoint ?? config.ssrBreakpoint;

  const isMobile = useMediaQuery(maxWidthQuery(mobileMaxWidth), {
    ssrMatch: ssrBreakpoint === "mobile",
  });
  const isTablet = useMediaQuery(
    betweenWidthQuery(mobileMaxWidth, tabletMaxWidth),
    { ssrMatch: ssrBreakpoint === "tablet" },
  );

  const breakpoint: BreakpointName = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : "desktop";

  return {
    isMobile,
    isTablet,
    isDesktop: breakpoint === "desktop",
    breakpoint,
  };
}
