import { RefObject, useEffect, useState } from "react";

export default function useAutofit<T extends Element>(
  container: RefObject<T> | T | undefined,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!container) {
      return undefined;
    }

    const containerRef =
      "current" in container ? container : { current: container };

    function resizeStage() {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;

      setSize({ width, height });
    }

    resizeStage();

    // NOTE: ResizeObserver를 도입할 것을 고려할 것
    window.addEventListener("resize", resizeStage);
    return () => {
      window.removeEventListener("resize", resizeStage);
    };
  }, [container]);

  return size;
}
