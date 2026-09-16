import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MediaQueryListStub = MediaQueryList & {
  setMatches: (matches: boolean) => void;
};

function createMatchMediaMock() {
  const queries = new Map<string, MediaQueryListStub>();

  const matchMedia = (query: string): MediaQueryList => {
    const existing = queries.get(query);
    if (existing) return existing;

    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    let matches = false;

    const stub = {
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
      ) => {
        if (typeof listener === "function") {
          listeners.add(listener as (event: MediaQueryListEvent) => void);
        }
      },
      removeEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
      ) => {
        if (typeof listener === "function") {
          listeners.delete(listener as (event: MediaQueryListEvent) => void);
        }
      },
      addListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
      dispatchEvent: () => true,
      setMatches(next: boolean) {
        matches = next;
        const event = { matches, media: query } as MediaQueryListEvent;
        listeners.forEach((listener) => listener(event));
      },
    } as MediaQueryListStub;

    queries.set(query, stub);
    return stub;
  };

  return {
    matchMedia,
    setQuery(query: string, matches: boolean) {
      const stub = matchMedia(query) as MediaQueryListStub;
      stub.setMatches(matches);
    },
  };
}

describe("useIsMobile", () => {
  let restoreMatchMedia: (() => void) | undefined;
  let setQuery: (query: string, matches: boolean) => void;

  beforeEach(() => {
    const mock = createMatchMediaMock();
    setQuery = mock.setQuery;
    const original = window.matchMedia;
    window.matchMedia = mock.matchMedia;
    restoreMatchMedia = () => {
      window.matchMedia = original;
    };
  });

  afterEach(() => {
    restoreMatchMedia?.();
    vi.resetModules();
  });

  it("returns false when the viewport is above the breakpoint", async () => {
    setQuery("(max-width: 767px)", false);
    const { renderHook } = await import("@testing-library/react");
    const { useIsMobile } = await import("./use-is-mobile");
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true when the viewport is below the breakpoint", async () => {
    setQuery("(max-width: 767px)", true);
    const { renderHook } = await import("@testing-library/react");
    const { useIsMobile } = await import("./use-is-mobile");
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes", async () => {
    setQuery("(max-width: 767px)", false);
    const { renderHook, act } = await import("@testing-library/react");
    const { useIsMobile } = await import("./use-is-mobile");
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      setQuery("(max-width: 767px)", true);
    });

    expect(result.current).toBe(true);
  });

  it("respects a custom breakpoint", async () => {
    setQuery("(max-width: 1023px)", true);
    const { renderHook } = await import("@testing-library/react");
    const { useIsMobile } = await import("./use-is-mobile");
    const { result } = renderHook(() => useIsMobile({ breakpoint: 1024 }));
    expect(result.current).toBe(true);
  });
});
