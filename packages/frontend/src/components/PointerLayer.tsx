import { useCallback, useEffect, useRef } from "react";
import { Group, Label, Layer, Tag, Text } from "react-konva";
import { Html } from "react-konva-utils";

import Konva from "konva";
import { WebsocketProvider } from "y-websocket";

import useYjsSpaceAwarenessStates from "@/hooks/useYjsSpaceAwareness";
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
      <Group x={100} y={0}>
        <Html>
          <div>
            <div>공유 중</div>
            <ul>
              {userStates &&
                [...userStates].map(([userClientId, userState]) => (
                  <li key={userClientId}>
                    <div
                      className="rounded-full w-4 h-4"
                      style={{
                        backgroundColor: userState.color,
                      }}
                    ></div>
                  </li>
                ))}
            </ul>
          </div>
        </Html>
      </Group>
      {userStates &&
        [...userStates].map(([clientId, { color, pointer }]) => {
          if (clientId === awareness?.clientID) {
            return null;
          }

          const pointerColor = color;

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
