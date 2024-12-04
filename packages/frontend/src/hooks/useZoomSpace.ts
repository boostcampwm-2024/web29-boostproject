import React from "react";

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
      }

    }
  };

  return { zoomSpace };
}
