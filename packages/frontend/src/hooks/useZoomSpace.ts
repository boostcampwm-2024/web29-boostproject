import React, { useRef } from "react";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const getMousePointTo = (
  stage: Konva.Stage,
  pointer: { x: number; y: number },
  oldScale: number,
) => {
  return {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };
};

const calculateNewScale = (
  oldScale: number,
  direction: number,
  scaleBy: number,
) => {
  return direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
};

const calculateNewPosition = (
  pointer: { x: number; y: number },
  mousePointTo: { x: number; y: number },
  newScale: number,
) => {
  return {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
};

interface UseZoomSpaceProps {
  stageRef: React.RefObject<Konva.Stage>;
  scaleBy?: number;
  minScale?: number;
  maxScale?: number;
}

export function useZoomSpace({
  stageRef,
  scaleBy = 1.018,
  minScale = 0.5,
  maxScale = 3,
}: UseZoomSpaceProps) {
  const lastDistRef = useRef<number | null>(null);

  const moveView = (event: KonvaEventObject<WheelEvent>) => {
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const currentScale = stage.scaleX();

      stage.position({
        x: stage.x() - event.evt.deltaX / currentScale,
        y: stage.y() - event.evt.deltaY / currentScale,
      });
    }
  };

  const zoomSpace = (event: KonvaEventObject<WheelEvent>) => {
    if (stageRef.current !== null) {
      const stage = stageRef.current;

      // Ctrl + 휠로 확대/축소
      if (event.evt.ctrlKey) {
        event.evt.preventDefault();

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = getMousePointTo(stage, pointer, oldScale);

        const direction =
          event.evt.deltaY > 0
            ? -1 // Ctrl + 휠: 아래로 휠 → 확대
            : 1; // Ctrl + 휠: 위로 휠 → 축소

        let newScale = calculateNewScale(oldScale, direction, scaleBy);

        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        if (newScale === oldScale) {
          return;
        }

        const newPosition = calculateNewPosition(
          pointer,
          mousePointTo,
          newScale,
        );
        stage.scale({ x: newScale, y: newScale });
        stage.position(newPosition);
      } else {
        // Ctrl 키가 없는 휠 이벤트는 화면 이동 처리
        moveView(event);
      }
    }
  };

  // 핀치 줌 로직
  const handleTouchMove = (event: KonvaEventObject<TouchEvent>) => {
    if (stageRef.current !== null && event.evt.touches.length === 2) {
      const stage = stageRef.current;
      const touch1 = event.evt.touches[0];
      const touch2 = event.evt.touches[1];

      // 두 손가락 사이 거리 계산
      const dist = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2,
      );

      if (lastDistRef.current !== null) {
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = getMousePointTo(stage, pointer, oldScale);

        // 확대/축소 비율 계산
        const scaleChange = lastDistRef.current / dist;
        let newScale = oldScale * scaleChange;

        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        if (newScale !== oldScale) {
          const newPosition = calculateNewPosition(
            pointer,
            mousePointTo,
            newScale,
          );
          stage.scale({ x: newScale, y: newScale });
          stage.position(newPosition);
        }
      }

      lastDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastDistRef.current = null;
  };

  return { zoomSpace, handleTouchMove, handleTouchEnd };
}
