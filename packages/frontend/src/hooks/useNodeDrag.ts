import { useCallback, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

import { Node } from "@/components/mock";

import { nodeOperationTypes } from "./useNodeOperations";

type useNodeDragParams = {
  dragEnabled?: boolean;
  nodeOperations: nodeOperationTypes;
};

export function useNodeDrag({
  dragEnabled = true,
  nodeOperations,
}: useNodeDragParams) {
  const [dragState, setDragState] = useState<{
    dragStartNodeId: string | null;
    mousePosition: Vector2d | null;
  }>({
    dragStartNodeId: null,
    mousePosition: null,
  });

  // Drag 시작: 파생된 노드Id 업데이트
  const handleDragStart = (nodeId: string) => {
    if (!dragEnabled) return;
    setDragState((prev) => ({ ...prev, dragStartNodeId: nodeId }));
  };

  // Drag 종료: 드롭한 위치 업데이트
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (!dragEnabled || !dragState.dragStartNodeId) return;

    const position = e.target.getStage()?.getPointerPosition();
    if (!position) return;

    setDragState((prev) => ({ ...prev, mousePosition: position }));
  };

  const handlePaletteSelect = useCallback(
    (type: Node["type"] | "close") => {
      if (
        !dragState.mousePosition ||
        !dragState.dragStartNodeId ||
        type === "close"
      ) {
        setDragState((prev) => ({
          ...prev,
          mousePosition: null,
          dragStartNodeId: null,
        }));
        return;
      }

      nodeOperations.onCreateNode?.({
        parentId: dragState.dragStartNodeId,
        position: dragState.mousePosition,
        type: type as Node["type"],
      });

      setDragState((prev) => ({
        ...prev,
        mousePosition: null,
        dragStartNodeId: null,
      }));
    },
    [dragState, nodeOperations],
  );

  return {
    dragState,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handlePaletteSelect,
    },
  };
}
