import { useEffect, useState } from "react";
import { Line } from "react-konva";

import Konva from "konva";
import type { Edge } from "shared/types";

type EdgeProps = Edge & Konva.LineConfig;

function calculateOffsets(
  from: { x: number; y: number },
  to: { x: number; y: number },
  radius: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const offsetX = (dx / distance) * radius;
  const offsetY = (dy / distance) * radius;

  return { offsetX, offsetY };
}

export default function Edge({ from, to, ...rest }: EdgeProps) {
  const [points, setPoints] = useState<number[]>([]);
  const RADIUS = 64;

  useEffect(() => {
    if (from && to) {
      const { offsetX, offsetY } = calculateOffsets(from, to, RADIUS);

      setPoints([
        from.x + offsetX,
        from.y + offsetY,
        to.x - offsetX,
        to.y - offsetY,
      ]);
    }
  }, [from, to]);

  return (
    <Line points={points} stroke={"#FFCC00"} strokeWidth={3} {...rest}></Line>
  );
}
