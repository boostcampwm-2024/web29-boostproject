import { Circle } from "react-konva";

import { Vector2d } from "konva/lib/types";

import GooeyConnection from "./GooeyConnection";

type GooeyNodeProps = {
  startPosition: Vector2d;
  dragPosition: Vector2d;
  connectionVisible?: boolean;
  color?: string;
};

export default function GooeyNode({
  startPosition,
  dragPosition,
  connectionVisible = true,
  color = "#FFF2CB",
}: GooeyNodeProps) {
  return (
    <>
      <Circle x={dragPosition.x} y={dragPosition.y} radius={64} fill={color} />
      {connectionVisible && (
        <GooeyConnection
          startPosition={startPosition}
          endPosition={dragPosition}
        />
      )}
    </>
  );
}
