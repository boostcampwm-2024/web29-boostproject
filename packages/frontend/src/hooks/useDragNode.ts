import { useState } from "react";

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

export default function useDragNode(spaceActions: spaceActions) {
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
    const { dragPosition } = dragState;
    setDropPosition(dragPosition);
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      dragPosition: null,
    }));
  };

  const handlePaletteSelect = (
    type: PaletteButtonType,
    name: string | undefined,
  ) => {
    const { startNode } = dragState;

    // FIXME: note 타입 외의 노드 생성 동작을 임시로 막음.
    if (
      !startNode ||
      !dropPosition ||
      type === "close" ||
      type === "image" ||
      type === "url"
    ) {
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
