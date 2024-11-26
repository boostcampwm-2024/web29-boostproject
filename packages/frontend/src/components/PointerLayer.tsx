import { useCallback, useEffect, useRef } from "react";
import { Group, Label, Layer, Tag, Text } from "react-konva";

import Konva from "konva";
import { WebsocketProvider } from "y-websocket";

import useYjsSpaceAwarenessStates from "@/hooks/useYjsSpaceAwareness";
import { useYjsStore } from "@/store/yjs";

import PointerCursor from "./PointerCursor";

// 노출과 명도는 유지, 색상만 랜덤
function getFallbackColor(clientId: number) {
  const hue = clientId % 360;
  return `hsl(${hue}, 20%, 50%)`;
}

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

    const handlePointerMove = () => {
      const pointerPosition = stage.getRelativePointerPosition();
      console.log(pointerPosition);
      setLocalPointerPosition(pointerPosition || undefined);
    };

    const handlePointerLeave = () => {
      setLocalPointerPosition(undefined);
    };

    stage.on("pointermove pointerover", handlePointerMove);
    stage.on("pointerleave pointerout pointercancel", handlePointerLeave);
    return () => {
      stage.off("pointermove pointerover", handlePointerMove);
      stage.off("pointerleave pointerout pointercancel", handlePointerLeave);
    };
  }, [setLocalPointerPosition]);

  return (
    <Layer ref={layerRef}>
      {userStates &&
        [...userStates].map(([clientId, { color, pointer }]) => {
          if (clientId === awareness?.clientID) {
            return null;
          }

          const pointerColor = color || getFallbackColor(clientId);

          return (
            pointer && (
              <Group key={clientId} x={pointer.x} y={pointer.y}>
                <PointerCursor color={pointerColor} />
                <Label x={12} y={12}>
                  <Tag
                    fill={pointerColor}
                    opacity={0.2}
                    pointerWidth={6}
                    pointerHeight={12}
                    cornerRadius={8}
                  />
                  <Text
                    fill="black"
                    padding={4}
                    fontSize={12}
                    text={`${clientId}`}
                  />
                </Label>
              </Group>
            )
          );
        })}
    </Layer>
  );
}
