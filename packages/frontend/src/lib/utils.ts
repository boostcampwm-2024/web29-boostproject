import { type ClassValue, clsx } from "clsx";
import { Vector2d } from "konva/lib/types";
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
