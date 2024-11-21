import React, { useRef } from "react";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

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
  const animationFrameId = useRef<number | null>(null);

  const zoomSpace = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!event.evt.ctrlKey && !event.evt.metaKey) {
      return;
    }

    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let newScale =
        event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      if (newScale === oldScale) {
        return;
      }

      const newPosition = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        stage.scale({ x: newScale, y: newScale });
        stage.position(newPosition);
        stage.batchDraw();
      });
    }
  };

  return { zoomSpace };
}
