import { Circle, Shape } from "react-konva";

import { Vector2d } from "konva/lib/types";

import { getDistanceFromPoints } from "@/lib/utils";

type GooeyConnectionProps = {
  startPosition: Vector2d;
  endPosition: Vector2d;
};

export default function GooeyConnection({
  startPosition,
  endPosition,
}: GooeyConnectionProps) {
  const distance = getDistanceFromPoints(startPosition, endPosition);
  const NODE_RADIUS = 32;
  const HONEY_COLOR = "#FFF2CB";

  const dx = endPosition.x - startPosition.x;
  const dy = endPosition.y - startPosition.y;
  const angle = Math.atan2(dy, dx);

  // 거리에 따라 컨트롤 Point 결정
  const controlDistance = Math.min(distance * 0.5, NODE_RADIUS * 2);

  // 제어점 계산
  const ctrl1 = {
    x: startPosition.x + Math.cos(angle) * controlDistance * 2,
    y: startPosition.y + Math.sin(angle) * controlDistance * 2,
  };
  const ctrl2 = {
    x: endPosition.x - Math.cos(angle) * controlDistance * 2,
    y: endPosition.y - Math.sin(angle) * controlDistance * 2,
  };

  return (
    <>
      <Shape
        sceneFunc={(context) => {
          // 접점 계산
          const startAngle = angle + Math.PI / 2;
          const endAngle = angle - Math.PI / 2;

          // 시작점과 끝점의 두 접점 계산 (1.8이 원 벗어나지 않는 최대값)
          const start1 = {
            x: startPosition.x + Math.cos(startAngle) * NODE_RADIUS * 1.8,
            y: startPosition.y + Math.sin(startAngle) * NODE_RADIUS * 1.8,
          };
          const start2 = {
            x: startPosition.x + Math.cos(endAngle) * NODE_RADIUS * 1.8,
            y: startPosition.y + Math.sin(endAngle) * NODE_RADIUS * 1.8,
          };

          const end1 = {
            x: endPosition.x + Math.cos(startAngle) * NODE_RADIUS * 1.8,
            y: endPosition.y + Math.sin(startAngle) * NODE_RADIUS * 1.8,
          };
          const end2 = {
            x: endPosition.x + Math.cos(endAngle) * NODE_RADIUS * 1.8,
            y: endPosition.y + Math.sin(endAngle) * NODE_RADIUS * 1.8,
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
          context.lineWidth = 2 / (1 + distance / NODE_RADIUS); // 거리에 따라 선 두께 조절
          context.stroke();
        }}
      />
      {/* 제어점 디버깅 용도 */}
      <Circle x={ctrl1.x} y={ctrl1.y} radius={1} fill="red" />
      <Circle x={ctrl2.x} y={ctrl2.y} radius={1} fill="red" />
    </>
  );
}
