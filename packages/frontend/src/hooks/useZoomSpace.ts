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
  deltaY: number,
  scaleBy: number,
) => {
  return deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
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
  scaleBy = 1.05,
  minScale = 0.5,
  maxScale = 2.5,
}: UseZoomSpaceProps) {
  const zoomSpace = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    const isControlWheelZoom =
      event.evt.deltaMode === WheelEvent.DOM_DELTA_LINE && event.evt.ctrlKey;
    const isTrackpadGesture =
      event.evt.deltaMode === WheelEvent.DOM_DELTA_PIXEL && event.evt.ctrlKey;

    // NOTE - 마우스휠 동작 방향 반대로 수정할 수 있는지 검토 필요
    // [ctrl + 마우스휠] 또는 [트랙패드 제스처]만 허용
    if (!isControlWheelZoom && !isTrackpadGesture) {
      return;
    }

    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = getMousePointTo(stage, pointer, oldScale);

      let newScale = calculateNewScale(oldScale, -event.evt.deltaY, scaleBy);

      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      if (newScale === oldScale) {
        return;
      }

      const newPosition = calculateNewPosition(pointer, mousePointTo, newScale);
      stage.scale({ x: newScale, y: newScale });
      stage.position(newPosition);
    }
  };

  return { zoomSpace };
}
