import { useEffect, useState } from "react";
import { Group, Line } from "react-konva";

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

export default function Edge({
  from,
  to,
  id,
  onContextMenu,
  ...rest
}: EdgeProps) {
  const [points, setPoints] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
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
    <Group
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={onContextMenu}
    >
      <Line
        points={points}
        stroke={"#D4AD2F"}
        strokeWidth={isHovered ? 5 : 3}
        opacity={isHovered ? 1 : 0.8}
        {...rest}
      ></Line>
      <Line
        points={points}
        stroke="transparent"
        strokeWidth={7} // 우클릭 감지를 위한 영역 확장 용도
        hitStrokeWidth={7}
        name="edge"
        id={id}
      />
    </Group>
  );
}
