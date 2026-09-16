import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useViewportConfig } from "./provider";
import type { UseViewportSizeOptions, ViewportSize } from "./types";

let cachedSize: ViewportSize = { width: 0, height: 0 };

function readSize(): ViewportSize {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (cachedSize.width !== width || cachedSize.height !== height) {
    cachedSize = { width, height };
  }

  return cachedSize;
}

function subscribeToResize(onStoreChange: () => void): () => void {
  let frame = 0;

  const onResize = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(onStoreChange);
  };

  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", onResize);
  };
}

export function useViewportSize(
  options: UseViewportSizeOptions = {},
): ViewportSize {
  const config = useViewportConfig();
  const ssrWidth = options.ssrWidth ?? config.ssrWidth;
  const ssrHeight = options.ssrHeight ?? config.ssrHeight;
  const serverSnapshot = useMemo(
    (): ViewportSize => ({ width: ssrWidth, height: ssrHeight }),
    [ssrWidth, ssrHeight],
  );
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);

  return useSyncExternalStore(subscribeToResize, readSize, getServerSnapshot);
}
