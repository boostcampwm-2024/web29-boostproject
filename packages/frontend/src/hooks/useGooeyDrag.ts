import { useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";

export default function useGooeyDrag(spaceActions) {
  const [startNode, setStartNode] = useState<Node | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<Vector2d | null>(null);
  const [dropPosition, setDropPosition] = useState<Vector2d | null>(null);

  const handleDragStart = (node: Node) => {
    const nodePosition = { x: node.x, y: node.y };

    setIsDragging(true);
    setDropPosition(null);
    setStartNode(node);
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

  const handlePaletteSelect = (type: Node["type"] | "close") => {
    if (!startNode || !dropPosition || type === "close") {
      setDropPosition(null);
      return;
    }

    spaceActions.createNode(type, startNode, dropPosition);
    setDropPosition(null);
    setStartNode(null);
  };

  return {
    startNode,
    isDragging,
    dragPosition,
    dropPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handlePaletteSelect,
  };
}
