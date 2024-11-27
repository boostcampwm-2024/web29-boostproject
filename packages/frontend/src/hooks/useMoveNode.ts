import { useRef, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";

import { findOverlapNodes, getDistanceFromPoints } from "@/lib/utils";

type useMoveNodeProps = {
  nodes: Node[];
  spaceActions: {
    updateNode: (nodeId: Node["id"], patch: Partial<Omit<Node, "id">>) => void;
  };
};

type MoveState = {
  isHolding: boolean;
  isMoving: boolean;
  isOverlapping: boolean;
  nextPosition: Vector2d | null;
  targetNode: Node | null;
};

const HOLD_DURATION = 500;
const NODE_RADIUS = 64;

export default function useMoveNode({ nodes, spaceActions }: useMoveNodeProps) {
  const [moveState, setMoveState] = useState<MoveState>({
    isHolding: false,
    isMoving: false,
    isOverlapping: false,
    nextPosition: null,
    targetNode: null,
  });

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // onMouseDown, onTouchStart
  const startHold = (node: Node) => {
    setMoveState((prev) => ({
      ...prev,
      isHolding: true,
      targetNode: node,
    }));

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
    }
    holdTimer.current = setTimeout(() => {
      setMoveState((prev) => ({
        ...prev,
        isMoving: true,
      }));
    }, HOLD_DURATION);
  };

  // onMouseLeave, onMouseUp, onTouchEnd
  const endHold = () => {
    if (moveState.isMoving) return;

    setMoveState((prev) => ({
      ...prev,
      isHolding: false,
      targetNode: null,
    }));

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  // onDragMove
  const monitorHoldingPosition = (e: KonvaEventObject<DragEvent>) => {
    if (!moveState.isHolding) return;

    const layer = e.target.getLayer();
    if (!layer) return;

    const targetPosition = e.target.getAbsolutePosition(layer);
    const pointerPosition = layer.getRelativePointerPosition();
    if (!pointerPosition) return;

    const distance = getDistanceFromPoints(targetPosition, pointerPosition);
    if (distance > NODE_RADIUS) {
      endHold();
    }

    const overlapNodes = findOverlapNodes(pointerPosition, nodes);
    if (overlapNodes.length > 0) {
      setMoveState((prev) => ({
        ...prev,
        isOverlapping: true,
      }));
    } else {
      setMoveState((prev) => ({
        ...prev,
        isOverlapping: false,
      }));
    }
  };

  // onDragEnd
  const endMove = (e: KonvaEventObject<DragEvent>) => {
    if (!moveState.isMoving) return;

    const pointerPosition = e.target.getLayer()?.getRelativePointerPosition();
    if (!pointerPosition || !moveState.targetNode) return;

    if (!moveState.isOverlapping) {
      const { id } = moveState.targetNode;
      const { x, y } = pointerPosition;
      spaceActions.updateNode(id, { x, y });
    }
    setMoveState((prev) => ({
      ...prev,
      isHolding: false,
      isMoving: false,
      targetNode: null,
    }));
  };

  return {
    move: {
      callbacks: { startHold, endHold, monitorHoldingPosition, endMove },
    },
    moveState,
  };
}
