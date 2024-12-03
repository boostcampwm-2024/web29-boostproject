import { useEffect, useState } from "react";
import { Circle, Group, Line, Text } from "react-konva";

import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import type { Edge } from "shared/types";

type EdgeProps = Edge & Konva.LineConfig;

const BUTTON_RADIUS = 12;

type EdgeEditButtonProps = {
  points: number[];
  onTap?:
    | ((evt: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => void)
    | undefined;
};

function EdgeEditButton({ points, onTap }: EdgeEditButtonProps) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouch || points.length < 4) return null;

  const handleTap = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (onTap) {
      const { target } = e;
      console.log(target);
    }
  };

  const middleX = (points[0] + points[2]) / 2;
  const middleY = (points[1] + points[3]) / 2;

  return (
    <Group x={middleX} y={middleY} onTap={handleTap}>
      <Circle
        radius={BUTTON_RADIUS}
        fill="#FAF9F7"
        stroke="#FFFFFF"
        strokeWidth={2}
      />
      <Text
        fontSize={16}
        fill="#787878"
        text="×"
        align="center"
        verticalAlign="middle"
        width={BUTTON_RADIUS * 2}
        height={BUTTON_RADIUS * 2}
        offsetX={BUTTON_RADIUS}
        offsetY={BUTTON_RADIUS - 1}
      />
    </Group>
  );
}

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
      <EdgeEditButton points={points} />
    </Group>
  );
}
