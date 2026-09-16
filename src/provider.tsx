import { createContext, useContext, useMemo } from "react";
import {
  DEFAULT_MOBILE_MAX_WIDTH,
  DEFAULT_TABLET_MAX_WIDTH,
} from "./constants";
import type { ViewportConfig, ViewportProviderProps } from "./types";

const defaultConfig: ViewportConfig = {
  breakpoint: DEFAULT_MOBILE_MAX_WIDTH,
  tabletMaxWidth: DEFAULT_TABLET_MAX_WIDTH,
  ssrIsMobile: false,
  ssrBreakpoint: "desktop",
  ssrWidth: 0,
  ssrHeight: 0,
};

const ViewportContext = createContext<ViewportConfig>(defaultConfig);

export function ViewportProvider({
  children,
  breakpoint = defaultConfig.breakpoint,
  tabletMaxWidth = defaultConfig.tabletMaxWidth,
  ssrIsMobile = defaultConfig.ssrIsMobile,
  ssrBreakpoint = ssrIsMobile ? "mobile" : defaultConfig.ssrBreakpoint,
  ssrWidth = defaultConfig.ssrWidth,
  ssrHeight = defaultConfig.ssrHeight,
}: ViewportProviderProps) {
  const value = useMemo(
    (): ViewportConfig => ({
      breakpoint,
      tabletMaxWidth,
      ssrIsMobile,
      ssrBreakpoint,
      ssrWidth,
      ssrHeight,
    }),
    [breakpoint, tabletMaxWidth, ssrIsMobile, ssrBreakpoint, ssrWidth, ssrHeight],
  );

  return (
    <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
  );
}

export function useViewportConfig(): ViewportConfig {
  return useContext(ViewportContext);
}
