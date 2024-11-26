import { Circle } from "react-konva";

import { Vector2d } from "konva/lib/types";

import GooeyConnection from "./GooeyConnection";

type GooeyNodeProps = {
  startPosition: Vector2d;
  dragPosition: Vector2d;
};

export default function GooeyNode({
  startPosition,
  dragPosition,
}: GooeyNodeProps) {
  return (
    <>
      <Circle
        x={dragPosition.x}
        y={dragPosition.y}
        radius={64}
        fill="#FFF2CB"
      />
      <GooeyConnection
        startPosition={startPosition}
        endPosition={dragPosition}
      />
    </>
  );
}
