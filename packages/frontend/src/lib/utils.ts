import { type ClassValue, clsx } from "clsx";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";
import { twMerge } from "tailwind-merge";

export default {};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type getDistanceFromPoints = (
  firstPoint: Vector2d | null,
  secondPoint: Vector2d | null,
) => number;

export const getDistanceFromPoints: getDistanceFromPoints = (
  firstPoint,
  secondPoint,
) => {
  if (!firstPoint || !secondPoint) {
    return 0;
  }

  const dx = secondPoint.x - firstPoint.x;
  const dy = secondPoint.y - firstPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance;
};

type findOverlapNodes = (dragPosition: Vector2d, nodes: Node[]) => Node[];

export const findOverlapNodes: findOverlapNodes = (dragPosition, nodes) => {
  const overlapNodes = nodes.filter((node) => {
    const isIntersects = Konva.Util.haveIntersection(
      {
        x: dragPosition.x,
        y: dragPosition.y,
        width: 64 * 2,
        height: 64 * 2,
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

  return overlapNodes;
};

type findNearestNode = (position: Vector2d, overlapNodes: Node[]) => Node;

export const findNearestNode: findNearestNode = (position, overlapNodes) => {
  if (overlapNodes.length === 1) return overlapNodes[0];

  const sortedNodes = overlapNodes.sort((a, b) => {
    return (
      getDistanceFromPoints({ x: b.x, y: b.y }, position) -
      getDistanceFromPoints({ x: a.x, y: a.y }, position)
    );
  });

  return sortedNodes[0];
};
