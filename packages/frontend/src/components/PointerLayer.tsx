import { useCallback, useEffect, useRef } from "react";
import { Layer } from "react-konva";

import Konva from "konva";
import { WebsocketProvider } from "y-websocket";

import useYjsSpaceAwarenessStates from "@/hooks/useYjsSpaceAwareness";
import { throttle } from "@/lib/utils";
import { useYjsStore } from "@/store/yjs";

import PointerCursor from "./PointerCursor";

export default function PointerLayer() {
  const layerRef = useRef<Konva.Layer>(null);

  const { yProvider } = useYjsStore();
  const awareness = (yProvider as WebsocketProvider | undefined)?.awareness;
  const { states: userStates, setLocalStateField } =
    useYjsSpaceAwarenessStates(awareness);

  const setLocalPointerPosition = useCallback(
    (position?: { x: number; y: number }) => {
      setLocalStateField?.("pointer", position || undefined);
    },
    [setLocalStateField],
  );

  useEffect(() => {
    const layer = layerRef.current;
    const stage = layer?.getStage();

    if (!stage) {
      return undefined;
    }

    const handlePointerMove = throttle(() => {
      const pointerPosition = stage.getRelativePointerPosition();
      setLocalPointerPosition(pointerPosition || undefined);
    }, 100);

    const handlePointerLeave = () => {
      setLocalPointerPosition(undefined);
    };

    stage.on("pointermove dragmove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerout", handlePointerLeave);
    return () => {
      stage.off("pointermove dragmove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerout", handlePointerLeave);
    };
  }, [setLocalPointerPosition]);

  return (
    <Layer ref={layerRef}>
      {userStates &&
        [...userStates].map(([clientId, { color, pointer }]) => {
          if (clientId === awareness?.clientID) {
            return null;
          }

          const pointerColor = color;

          return (
            pointer && (
              <PointerCursor
                key={clientId}
                position={pointer}
                color={pointerColor}
                label={`${clientId}`}
              />
            )
          );
        })}
    </Layer>
  );
}
