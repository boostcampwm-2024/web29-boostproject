import { Circle, Shape } from "react-konva";

import { Vector2d } from "konva/lib/types";

import { getDistanceFromPoints } from "@/lib/utils";

type GooeyConnectionProps = {
  startPosition: Vector2d;
  endPosition: Vector2d;
  debug?: boolean;
};

export default function GooeyConnection({
  startPosition,
  endPosition,
  debug = false,
}: GooeyConnectionProps) {
  const distance = getDistanceFromPoints(startPosition, endPosition);
  const NODE_RADIUS = 32;
  const HONEY_COLOR = "#FFF2CB";

  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;
  const angle = Math.atan2(dy, dx);

  // 거리에 따라 컨트롤 Point 결정
  const controlDistance = Math.min(distance * 0.5, NODE_RADIUS * 2);
  const middlePoint = {
    x: startPosition.x + (Math.cos(angle) * distance) / 2,
    y: startPosition.y + (Math.sin(angle) * distance) / 2,
  };

  const tangentLine = Math.sqrt((distance / 2) ** 2 - (2 * NODE_RADIUS) ** 2);
  const tangentAngle = Math.atan2(2 * NODE_RADIUS, tangentLine);

  // 제어점 계산
  const ctrl1 = {
    x: startPosition.x + Math.cos(angle) * controlDistance * 1.3,
    y: startPosition.y + Math.sin(angle) * controlDistance * 1.3,
  };
  const ctrl2 = {
    x: endPosition.x - Math.cos(angle) * controlDistance * 1.3,
    y: endPosition.y - Math.sin(angle) * controlDistance * 1.3,
  };

  // 곡선 시작점-끝점
  const start1 = {
    x: middlePoint.x - Math.cos(angle - tangentAngle) * tangentLine,
    y: middlePoint.y - Math.sin(angle - tangentAngle) * tangentLine,
  };

  const start2 = {
    x: middlePoint.x - Math.cos(angle + tangentAngle) * tangentLine,
    y: middlePoint.y - Math.sin(angle + tangentAngle) * tangentLine,
  };

  const end1 = {
    x: middlePoint.x + Math.cos(angle + tangentAngle) * tangentLine,
    y: middlePoint.y + Math.sin(angle + tangentAngle) * tangentLine,
  };

  const end2 = {
    x: middlePoint.x + Math.cos(angle - tangentAngle) * tangentLine,
    y: middlePoint.y + Math.sin(angle - tangentAngle) * tangentLine,
  };

  return (
    <>
      <Shape
        sceneFunc={(context) => {
          // 베지어 곡선 그리기
          context.beginPath();
          context.moveTo(start1.x, start1.y);
          context.bezierCurveTo(
            ctrl1.x,
            ctrl1.y,
            ctrl2.x,
            ctrl2.y,
            end1.x,
            end1.y,
          );
          context.lineTo(end2.x, end2.y);
          context.bezierCurveTo(
            ctrl2.x,
            ctrl2.y,
            ctrl1.x,
            ctrl1.y,
            start2.x,
            start2.y,
          );
          context.closePath();

          const gradient = context.createLinearGradient(
            startPosition.x,
            startPosition.y,
            endPosition.x,
            endPosition.y,
          );
          gradient.addColorStop(0, `${HONEY_COLOR}`);
          gradient.addColorStop(0.5, `${HONEY_COLOR}80`);
          gradient.addColorStop(1, `${HONEY_COLOR}`);

          context.fillStyle = gradient;
          context.fill();
          context.strokeStyle = HONEY_COLOR;
          context.lineWidth = 2 / (1 + distance / NODE_RADIUS); // 거리에 따라 선 두께 조절
          context.stroke();
        }}
      />
      {/* 제어점 디버깅 용도 */}
      {debug && (
        <>
          <Circle x={ctrl1.x} y={ctrl1.y} radius={1} fill="red" />
          <Circle x={ctrl2.x} y={ctrl2.y} radius={1} fill="red" />
          <Circle x={start1.x} y={start1.y} radius={2} fill="green" />
          <Circle x={end1.x} y={end1.y} radius={2} fill="blue" />
          <Circle x={start2.x} y={start2.y} radius={2} fill="green" />
          <Circle x={end2.x} y={end2.y} radius={2} fill="blue" />
        </>
      )}
    </>
  );
}
