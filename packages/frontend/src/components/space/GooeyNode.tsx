import { Circle } from "react-konva";

import { Vector2d } from "konva/lib/types";

type GooeyNodeProps = {
  startPosition: Vector2d;
  dragPosition: Vector2d;
};

export default function GooeyNode({
  startPosition,
  dragPosition,
}: GooeyNodeProps) {
  return (
    <Circle x={dragPosition.x} y={dragPosition.y} radius={60} fill="red" />
  );
}
