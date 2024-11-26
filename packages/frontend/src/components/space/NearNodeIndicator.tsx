import { Circle } from "react-konva";

import { Node } from "shared/types";

type NearNodeIndicatorProps = {
  overlapNode: Node;
};

export default function NearNodeIndicator({
  overlapNode,
}: NearNodeIndicatorProps) {
  return (
    <Circle
      x={overlapNode.x}
      y={overlapNode.y}
      radius={64}
      stroke="#FFB800"
      strokeWidth={4}
    />
  );
}
