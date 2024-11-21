import { useState } from "react";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";

import { PaletteButtonType } from "@/components/space/PaletteMenu";

import { spaceActions } from "./useSpaceElements";

type DragState = {
  isDragging: boolean;
  startNode: Node | null;
  dragPosition: Vector2d | null;
};

export default function useDragNode(nodes: Node[], spaceActions: spaceActions) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startNode: null,
    dragPosition: null,
  });
  const [dropPosition, setDropPosition] = useState<Vector2d | null>(null);

  const handleDragStart = (node: Node) => {
    const nodePosition = { x: node.x, y: node.y };
    setDragState({
      isDragging: true,
      startNode: node,
      dragPosition: nodePosition,
    });

    setDropPosition(null);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.getLayer()?.getRelativePointerPosition();
    if (!position) return;

    setDragState((prev) => ({
      ...prev,
      dragPosition: position,
    }));
  };

  const handleDragEnd = () => {
    const { startNode, dragPosition } = dragState;
    if (!startNode || !dragPosition) return;

    const overlapNode = nodes.find((node) => {
      const isIntersects = Konva.Util.haveIntersection(
        {
          x: dragPosition.x,
          y: dragPosition.y,
          width: 60 * 2,
          height: 60 * 2,
        },
        {
          x: node.x,
          y: node.y,
          width: 64 * 2,
          height: 64 * 2,
        },
      );

      return isIntersects;
    });

    if (overlapNode && overlapNode.id !== startNode.id) {
      setDropPosition(null);
      spaceActions.createEdge(startNode, overlapNode);
    }

    if (!overlapNode) {
      setDropPosition(dragPosition);
    }

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      dragPosition: null,
    }));
  };

  const handlePaletteSelect = (type: PaletteButtonType, name: string = "") => {
    const { startNode } = dragState;

    if (!startNode || !dropPosition || type === "close") {
      setDropPosition(null);
      return;
    }

    spaceActions.createNode(type, startNode, dropPosition, name);
    setDragState({ isDragging: false, startNode: null, dragPosition: null });
    setDropPosition(null);
  };

  return {
    drag: {
      isActive: dragState.isDragging,
      startNode: dragState.startNode,
      position: dragState.dragPosition,
      handlers: {
        onDragStart: handleDragStart,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
      },
    },
    dropPosition,
    handlePaletteSelect,
  };
}
