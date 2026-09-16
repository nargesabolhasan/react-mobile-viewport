import type { ReactNode } from "react";

export type BreakpointName = "mobile" | "tablet" | "desktop";

export interface UseMediaQueryOptions {
  /** Value used on the server and during hydration. Default: `false`. */
  ssrMatch?: boolean;
}

export interface UseIsMobileOptions {
  /** Widths below this value (px) are mobile. Default: `768`. */
  breakpoint?: number;
  /** SSR/hydration fallback. Default: `false`. */
  ssrIsMobile?: boolean;
}

export interface UseBreakpointOptions {
  /** Widths below this value (px) are mobile. Default: `768`. */
  mobileMaxWidth?: number;
  /** Widths below this value (px) and not mobile are tablet. Default: `1024`. */
  tabletMaxWidth?: number;
  /** SSR/hydration fallback. Default: `"desktop"`. */
  ssrBreakpoint?: BreakpointName;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface UseViewportSizeOptions {
  ssrWidth?: number;
  ssrHeight?: number;
}

export interface ViewportConfig {
  breakpoint: number;
  tabletMaxWidth: number;
  ssrIsMobile: boolean;
  ssrBreakpoint: BreakpointName;
  ssrWidth: number;
  ssrHeight: number;
}

export interface ViewportProviderProps extends Partial<ViewportConfig> {
  children: ReactNode;
}
