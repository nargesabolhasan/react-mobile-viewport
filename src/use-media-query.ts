import { useCallback, useSyncExternalStore } from "react";
import { getMediaQuerySnapshot, getMediaQuerySubscribe } from "./media-query";
import type { UseMediaQueryOptions } from "./types";

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {},
): boolean {
  const ssrMatch = options.ssrMatch ?? false;
  const subscribe = getMediaQuerySubscribe(query);
  const getSnapshot = useCallback(
    () => getMediaQuerySnapshot(query),
    [query],
  );
  const getServerSnapshot = useCallback(() => ssrMatch, [ssrMatch]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
