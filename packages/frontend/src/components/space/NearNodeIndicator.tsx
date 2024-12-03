import React from "react";
import { Circle } from "react-konva";

import { Node } from "shared/types";

type NearNodeIndicatorProps = {
  overlapNode: Node;
};

function NearNodeIndicator({ overlapNode }: NearNodeIndicatorProps) {
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

function areEqual(
  prevProps: NearNodeIndicatorProps,
  nextProps: NearNodeIndicatorProps,
) {
  return (
    prevProps.overlapNode.x === nextProps.overlapNode.x &&
    prevProps.overlapNode.y === nextProps.overlapNode.y
  );
}

export const MemoizedNearIndicator = React.memo(NearNodeIndicator, areEqual);
