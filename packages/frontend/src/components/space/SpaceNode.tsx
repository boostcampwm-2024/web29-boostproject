import { forwardRef, useEffect, useRef, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import Konva from "konva";

// FIXME: 이런 동작이 많이 필요할 것 같아 별도의 파일로 분리할 것
function TextWithCenteredAnchor(props: Konva.TextConfig) {
  const ref = useRef<Konva.Text>(null);

  const [offsetX, setOffsetX] = useState<number | undefined>(undefined);
  const [offsetY, setOffsetY] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!ref.current || props.offset !== undefined) {
      return;
    }

    if (props.offsetX === undefined) {
      setOffsetX(ref.current.width() / 2);
    }

    if (props.offsetY === undefined) {
      setOffsetY(ref.current.height() / 2);
    }
  }, [props.offset, props.offsetX, props.offsetY]);

  return <Text ref={ref} offsetX={offsetX} offsetY={offsetY} {...props} />;
}

export interface SpaceNodeProps {
  label?: string;
  x: number;
  y: number;
}
const SpaceNode = forwardRef<Konva.Group, SpaceNodeProps>(
  ({ label, x, y }, ref) => {
    // TODO: 색상에 대해 정하기, 크기에 대해 정하기
    const fillColor = "royalblue";
    const textColor = "white";

    return (
      <Group ref={ref} x={x} y={y}>
        <Circle x={0} y={0} radius={48} fill={fillColor} />
        <TextWithCenteredAnchor x={0} y={0} text={label} fill={textColor} />
      </Group>
    );
  },
);
SpaceNode.displayName = "SpaceNode";

export default SpaceNode;
