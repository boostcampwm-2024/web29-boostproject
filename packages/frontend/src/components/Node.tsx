import { ReactNode, useEffect, useRef, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

type NodeProps = {
  id: string;
  x: number;
  y: number;
  draggable?: boolean;
  children?: ReactNode;
} & Konva.GroupConfig;

type NodeHandlers = {
  onDragStart: () => void;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: () => void;
  dragBoundFunc?: () => Vector2d;
};

export default function Node({
  id,
  x,
  y,
  draggable = true,
  children,
  ...rest
}: NodeProps) {
  return (
    <Group id={id} x={x} y={y} draggable={draggable} {...rest}>
      {children}
    </Group>
  );
}

type NodeCircleProps = {
  radius: number;
  fill: string;
};

Node.Circle = function NodeCircle({ radius, fill }: NodeCircleProps) {
  return <Circle x={0} y={0} radius={radius} fill={fill} />;
};

type NodeTextProps = {
  content: string;
  fontSize?: number;
  fontStyle?: string;
  width?: number;
};

Node.Text = function NodeText({
  content,
  fontSize,
  fontStyle,
  width,
}: NodeTextProps) {
  const ref = useRef<Konva.Text>(null);
  const [offset, setOffset] = useState<Konva.Vector2d | undefined>(undefined);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    setOffset({ x: ref.current.width() / 2, y: ref.current.height() / 2 });
  }, [content]);

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      fontStyle={fontStyle}
      offset={offset}
      text={content}
      width={width}
      align="center"
      wrap="none"
      ellipsis
    />
  );
};

export type HeadNodeProps = {
  id: string;
  name: string;
} & NodeHandlers;

export function HeadNode({ id, name, ...rest }: HeadNodeProps) {
  const radius = 64;
  return (
    <Node id={id} x={0} y={0} draggable {...rest}>
      <Node.Circle radius={radius} fill="#FFCC00" />
      <Node.Text
        width={radius * 2}
        fontSize={16}
        fontStyle="700"
        content={name}
      />
    </Node>
  );
}

export type NoteNodeProps = {
  id: string;
  x: number;
  y: number;
  src: string;
  name: string;
} & NodeHandlers;

export function NoteNode({ id, x, y, name, ...rest }: NoteNodeProps) {
  // TODO: src 적용 필요
  const radius = 64;
  return (
    <Node id={id} x={x} y={y} {...rest}>
      <Node.Circle radius={radius} fill="#FFF2CB" />
      <Node.Text fontSize={16} content={name} />
    </Node>
  );
}
