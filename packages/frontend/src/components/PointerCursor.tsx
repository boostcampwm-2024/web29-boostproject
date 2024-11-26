import { Group, Path } from "react-konva";

type PointerCursorProps = {
  x?: number;
  y?: number;
  color: string;
};

export default function PointerCursor({
  color,
  x = 0,
  y = 0,
}: PointerCursorProps) {
  return (
    // https://github.com/steveruizok/perfect-cursors/blob/main/example/src/components/Cursor.tsx
    <Group x={x - 12} y={y - 12}>
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
  );
}
