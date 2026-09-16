type Subscribe = (onStoreChange: () => void) => () => void;

const subscribeCache = new Map<string, Subscribe>();

function attachMediaListener(
  mql: MediaQueryList,
  onChange: () => void,
): () => void {
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }

  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
}

export function getMediaQuerySubscribe(query: string): Subscribe {
  const cached = subscribeCache.get(query);
  if (cached) return cached;

  const subscribe: Subscribe = (onStoreChange) => {
    const mql = window.matchMedia(query);
    return attachMediaListener(mql, onStoreChange);
  };

  subscribeCache.set(query, subscribe);
  return subscribe;
}

export function getMediaQuerySnapshot(query: string): boolean {
  return window.matchMedia(query).matches;
}

export function maxWidthQuery(maxWidth: number): string {
  return `(max-width: ${maxWidth - 1}px)`;
}

export function betweenWidthQuery(minWidth: number, maxWidth: number): string {
  return `(min-width: ${minWidth}px) and (max-width: ${maxWidth - 1}px)`;
}
