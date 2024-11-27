import { useRef, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Easings } from "konva/lib/Tween";
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
  animationEvent:
    | KonvaEventObject<MouseEvent>
    | KonvaEventObject<TouchEvent>
    | null;
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
    animationEvent: null,
  });

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCircle = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>,
  ) => {
    const group = e.target.getParent();
    const circle = group?.findOne("Circle");
    return circle;
  };

  const setHoldingAnimation = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent> | null,
    bool: boolean,
  ) => {
    if (!e) return;

    getCircle(e)?.to({
      easing: Easings.EaseInOut,
      shadowColor: "#F9D46B",
      shadowBlur: bool ? 10 : 0,
      duration: 0.5,
    });
  };

  // onMouseDown, onTouchStart
  const startHold = (
    node: Node,
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>,
  ) => {
    setMoveState((prev) => ({
      ...prev,
      isHolding: true,
      targetNode: node,
      animationEvent: e,
    }));

    setHoldingAnimation(e, true);

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

    setHoldingAnimation(moveState.animationEvent, false);

    setMoveState((prev) => ({
      ...prev,
      isHolding: false,
      targetNode: null,
      animationEvent: null,
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
    setHoldingAnimation(moveState.animationEvent, false);
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
      animationEvent: null,
    }));
  };

  return {
    move: {
      callbacks: { startHold, endHold, monitorHoldingPosition, endMove },
    },
    moveState,
  };
}
