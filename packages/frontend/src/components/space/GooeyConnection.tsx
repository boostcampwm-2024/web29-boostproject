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
  const NODE_RADIUS = 64;
  const HONEY_COLOR = "#FFF2CB";

  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;

  const angle = Math.atan2(dy, dx);

  // 수직 드래그 시 일관성을 위한 변화량 계산
  const controlDistanceX = Math.min(Math.abs(dx) * 0.5, NODE_RADIUS);
  const controlDistanceY = Math.min(Math.abs(dy) * 0.5, NODE_RADIUS);

  // 제어점 계산
  const ctrl1 = {
    x: startPosition.x + Math.cos(angle) * controlDistanceX * 1.7,
    y: startPosition.y + Math.sin(angle) * controlDistanceY * 1.7,
  };
  const ctrl2 = {
    x: endPosition.x - Math.cos(angle) * controlDistanceX * 1.7,
    y: endPosition.y - Math.sin(angle) * controlDistanceY * 1.7,
  };

  return (
    <>
      <Shape
        sceneFunc={(context) => {
          // 접점 계산
          const startAngle = angle + Math.PI / 2;
          const endAngle = angle - Math.PI / 2;

          // 시작점과 끝점의 두 접점 계산
          const start1 = {
            x: startPosition.x + Math.cos(startAngle) * NODE_RADIUS * 0.9,
            y: startPosition.y + Math.sin(startAngle) * NODE_RADIUS * 0.9,
          };
          const start2 = {
            x: startPosition.x + Math.cos(endAngle) * NODE_RADIUS * 0.9,
            y: startPosition.y + Math.sin(endAngle) * NODE_RADIUS * 0.9,
          };

          const end1 = {
            x: endPosition.x + Math.cos(startAngle) * NODE_RADIUS * 0.9,
            y: endPosition.y + Math.sin(startAngle) * NODE_RADIUS * 0.9,
          };
          const end2 = {
            x: endPosition.x + Math.cos(endAngle) * NODE_RADIUS * 0.9,
            y: endPosition.y + Math.sin(endAngle) * NODE_RADIUS * 0.9,
          };

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
          context.lineWidth = 2 / (1 + distance / NODE_RADIUS);
          context.stroke();
        }}
      />
      {debug && (
        <>
          <Circle x={ctrl1.x} y={ctrl1.y} radius={1} fill="red" />
          <Circle x={ctrl2.x} y={ctrl2.y} radius={1} fill="red" />
        </>
      )}
    </>
  );
}
