import { useRef, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";

import { PaletteButtonType } from "@/components/space/PaletteMenu";
import { findNearestNode, findOverlapNodes } from "@/lib/utils";

type DragState = {
  isDragging: boolean;
  startNode: Node | null;
  overlapNode: Node | null;
  dragPosition: Vector2d | null;
};

type spaceActions = {
  createNode: (
    type: Node["type"],
    parentNode: Node,
    position: Vector2d,
    name?: string,
  ) => void;
  createEdge: (fromNode: Node, toNode: Node) => void;
};

export default function useDragNode(nodes: Node[], spaceActions: spaceActions) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startNode: null,
    overlapNode: null,
    dragPosition: null,
  });
  const [dropPosition, setDropPosition] = useState<Vector2d | null>(null);

  const animationFrameId = useRef<number>();
  const lastPositionRef = useRef<Vector2d | null>();

  const handleDragStart = (node: Node) => {
    const nodePosition = { x: node.x, y: node.y };
    setDragState((prev) => ({
      ...prev,
      isDragging: true,
      startNode: node,
      dragPosition: nodePosition,
    }));

    setDropPosition(null);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.getLayer()?.getRelativePointerPosition();
    if (!position) return;

    lastPositionRef.current = position;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      const filteredNodes = nodes.filter(
        (node) => node.id !== dragState.startNode?.id,
      );
      const overlapNodes = findOverlapNodes(position, filteredNodes);
      const selectedNode =
        overlapNodes.length > 0
          ? findNearestNode(position, overlapNodes)
          : null;

      setDragState((prev) => ({
        ...prev,
        dragPosition: position,
        overlapNode: selectedNode,
      }));

      animationFrameId.current = undefined;
    });
  };

  const handleDragEnd = (isMoving: boolean = false) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const { startNode, dragPosition, overlapNode } = dragState;
    if (!startNode || !dragPosition) return;

    if (!overlapNode && !isMoving) {
      setDropPosition(dragPosition);
    }

    if (overlapNode && overlapNode.id !== startNode.id && !isMoving) {
      setDropPosition(null);
      spaceActions.createEdge(startNode, overlapNode);
    }

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      dragPosition: null,
      overlapNode: null,
    }));
  };

  const handlePaletteSelect = (type: PaletteButtonType, name: string = "") => {
    const { startNode } = dragState;

    // FIXME: note/subspace 타입 외의 노드 생성 동작을 임시로 막음.
    if (
      !startNode ||
      !dropPosition ||
      type === "close" ||
      type === "image" ||
      type === "url"
    ) {
      if (type === "image" || type === "url")
        window.alert("아직 지원하지 않는 타입이에요.");
      setDropPosition(null);
      return;
    }

    spaceActions.createNode(type, startNode, dropPosition, name);

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      startNode: null,
      dragPosition: null,
    }));
    setDropPosition(null);
  };

  return {
    drag: {
      isActive: dragState.isDragging,
      startNode: dragState.startNode,
      overlapNode: dragState.overlapNode,

      position: dragState.dragPosition,
      handlers: {
        onDragStart: handleDragStart,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
      },
    },
    dropPosition,
    setDropPosition,
    handlePaletteSelect,
  };
}
