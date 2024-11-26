import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

import { WebsocketProvider } from "y-websocket";

type Awareness = WebsocketProvider["awareness"]; // 여기선 어쩔 수 없이 WebSocketProvider임을 특정

export default function useYjsAwarenessStates<
  S extends { [x: string]: unknown },
>(awareness?: Awareness) {
  const storeRef = useRef<{
    states: Map<number, S>;
    localState: S | undefined;
  }>();

  if (!storeRef.current) {
    storeRef.current = {
      states: (awareness?.states as Map<number, S>) || new Map(),
      localState: (awareness?.getLocalState() as S) || undefined,
    };
  }

  const { setLocalState, setLocalStateField } = useMemo(() => {
    const setLocalState = (state: S) => {
      awareness?.setLocalState(state);
    };

    const setLocalStateField = <K extends keyof S>(field: K, value: S[K]) => {
      awareness?.setLocalStateField(field as string, value);
    };

    return { setLocalState, setLocalStateField };
  }, [awareness]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleOnChange = () => {
        const states = new Map(awareness?.states as Map<number, S>);
        const localState = { ...awareness?.getLocalState() } as S;

        storeRef.current = { states, localState };
        onStoreChange();
      };

      awareness?.on("change", handleOnChange);
      return () => awareness?.off("change", handleOnChange);
    },
    [awareness],
  );

  const getSnapshot = useCallback(() => {
    if (!storeRef.current) {
      return {
        states: new Map<number, S>(),
        localState: undefined,
      };
    }

    return storeRef.current;
  }, []);

  const { states, localState } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  return { localState, states, setLocalState, setLocalStateField };
}
