import { useCallback, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

import { NodeType } from "@/components/mock";

import { nodeOperationTypes } from "./useNodeOperations";

type useNodeDragParams = {
  nodeOperations: nodeOperationTypes;
};

export function useDragNode({ nodeOperations }: useNodeDragParams) {
  const [dragState, setDragState] = useState<{
    dragStartNodeId: string | null;
    dropPosition: Vector2d | null;
  }>({
    dragStartNodeId: null,
    dropPosition: null,
  });

  // Drag 시작: 파생된 노드Id 업데이트
  const handleDragStart = (nodeId: string) => {
    setDragState((prev) => ({ ...prev, dragStartNodeId: nodeId }));
  };

  // Drag 종료: 드롭한 위치 업데이트
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (!dragState.dragStartNodeId) return;

    const position = e.target.getLayer()?.getRelativePointerPosition();
    if (!position) return;

    setDragState((prev) => ({ ...prev, dropPosition: position }));
  };

  const handlePaletteSelect = useCallback(
    (type: NodeType["type"] | "close") => {
      if (
        !dragState.dropPosition ||
        !dragState.dragStartNodeId ||
        type === "close"
      ) {
        setDragState((prev) => ({
          ...prev,
          dropPosition: null,
          dragStartNodeId: null,
        }));
        return;
      }

      nodeOperations.onCreateNode?.({
        parentId: dragState.dragStartNodeId,
        position: dragState.dropPosition,
        type: type as NodeType["type"],
      });

      setDragState((prev) => ({
        ...prev,
        dropPosition: null,
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
