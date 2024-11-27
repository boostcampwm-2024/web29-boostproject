import { memo, useCallback, useMemo, useRef } from "react";
import { Group, Label, Path, Tag, Text } from "react-konva";

import Konva from "konva";

type PointerCursorProps = {
  position?: {
    x: number;
    y: number;
  };
  color: string;
  label?: string;
};

const PointerCursor = memo(({ color, position, label }: PointerCursorProps) => {
  const ref = useRef<Konva.Group>(null);

  const tween = useCallback((position: { x: number; y: number }) => {
    ref.current?.visible(true);
    ref.current?.to({
      x: position.x,
      y: position.y,
      duration: 0.1,
    });
  }, []);

  if (position) {
    tween({ ...position });
  }

  if (!position) {
    return null;
  }

  return (
    // https://github.com/steveruizok/perfect-cursors/blob/main/example/src/components/Cursor.tsx
    <Group ref={ref} listening={false} visible={false}>
      <Group x={-12} y={-12}>
        <Group x={1} y={1}>
          <Path data="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
          <Path data="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
        </Group>
        <Group>
          <Path data="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
          <Path data="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
        </Group>
        <Group>
          <Path
            fill={color}
            data="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z"
          />
          <Path
            fill={color}
            data="m13 10.814v11.188l2.969-2.866.428-.139h4.768z"
          />
        </Group>
      </Group>
      {label && (
        <Label x={24} y={24}>
          <Tag
            fill={color}
            opacity={0.2}
            pointerWidth={6}
            pointerHeight={12}
            cornerRadius={8}
          />
          <Text fill="black" padding={4} fontSize={12} text={label} />
        </Label>
      )}
    </Group>
  );
});

export default PointerCursor;
