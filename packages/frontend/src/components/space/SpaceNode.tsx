import { forwardRef, useRef } from "react";
import { Circle, Group, Text } from "react-konva";

import type Konva from "konva";

export interface SpaceNodeProps {
  label?: string;
  x: number;
  y: number;
}
const SpaceNode = forwardRef<Konva.Group, SpaceNodeProps>(
  ({ label, x, y }, ref) => {
    const fillColor = "royalblue";

    const textRef = useRef<Konva.Text>(null);
    const textOffset = textRef.current
      ? { x: textRef.current.width() / 2, y: textRef.current.height() / 2 }
      : undefined;

    return (
      <Group ref={ref} x={x} y={y}>
        <Circle x={0} y={0} radius={48} fill={fillColor} />
        <Text
          ref={textRef}
          x={0}
          y={0}
          text={label}
          fill="white"
          offset={textOffset}
        />
      </Group>
    );
  },
);
SpaceNode.displayName = "SpaceNode";

export default SpaceNode;
