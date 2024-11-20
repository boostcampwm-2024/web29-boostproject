import { useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

export default function useGooeyDrag() {
  const [startNodeState, setStartNodeState] = useState<{
    startPosition: Vector2d | null;
    startNodeId: string | null;
  }>({ startPosition: null, startNodeId: null });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<Vector2d | null>(null);
  const [dropPosition, setDropPosition] = useState<Vector2d | null>(null);

  const handleDragStart = (nodeId, nodePosition) => {
    setIsDragging(true);
    setDropPosition(null);
    setStartNodeState((prev) => ({
      ...prev,
      startPosition: nodePosition,
      startNodeId: nodeId,
    }));
    setDragPosition(nodePosition);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.getLayer()?.getRelativePointerPosition();
    if (!position) return;

    setDragPosition(position);
  };

  const handleDragEnd = () => {
    setDropPosition(dragPosition);
    setIsDragging(false);
    setDragPosition(null);
  };

  return {
    startNodeState,
    isDragging,
    dragPosition,
    dropPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
