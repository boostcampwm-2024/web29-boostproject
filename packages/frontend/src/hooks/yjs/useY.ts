import { useRef, useSyncExternalStore } from "react";

import * as Y from "yjs";

// FIXME: Implement equalsDeep (현재는 임시로 구현해놓음)
function equalsDeep<T extends object>(a: T, b: T) {
  if (a === b) {
    return true;
  }

  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in a) {
    if (
      Object.prototype.hasOwnProperty.call(b, key) &&
      !equalsDeep<T>(a[key] as T, b[key] as T)
    ) {
      return false;
    }
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useY<T extends Y.AbstractType<any> | undefined>(
  yData: T,
): unknown {
  const currentDataRef = useRef<unknown>(undefined);

  const subscribe = (onStoreChanged: () => void) => {
    const callback = () => {
      onStoreChanged();
    };

    if (yData) {
      yData.observeDeep(callback);
      return () => yData.unobserveDeep(callback);
    }

    return () => {};
  };

  const snapshot = () => {
    const json = yData?.toJSON();

    // NOTE: reference 비교를 위해서 별도로 체크를 해야 하는 것인가
    if (equalsDeep(currentDataRef.current, json)) {
      return currentDataRef.current;
    }

    currentDataRef.current = json;
    return currentDataRef.current;
  };

  const initialSnapshot = () => yData?.toJSON();

  const currentSnapshot = useSyncExternalStore(
    subscribe,
    snapshot,
    initialSnapshot,
  );

  return currentSnapshot;
}
