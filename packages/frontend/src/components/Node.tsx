/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import Konva from "konva";

type NodeProps = {
  id: string;
  x: number;
  y: number;
  draggable?: boolean;
  onDragStart?: (id: string) => void;
  children?: React.ReactNode;
} & Konva.GroupConfig;

export default function Node({
  id,
  x,
  y,
  draggable,
  onDragStart,
  children,
  ...rest
}: NodeProps) {
  const handleDragStart = () => {
    if (id && onDragStart) {
      onDragStart(id);
    }
  };

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragStart={handleDragStart}
      {...rest}
    >
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

type HeadNodeProps = {
  id: string;
  name: string;
  onDragStart?: (id: string) => void;
};

export function HeadNode({ id, name, onDragStart }: HeadNodeProps) {
  const radius = 64;
  return (
    <Node x={0} y={0} id={id} onDragStart={onDragStart} draggable>
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

type NoteNodeProps = {
  id: string;
  x: number;
  y: number;
  src: string;
  name: string;
  onDragStart?: (id: string) => void;
};

export function NoteNode({ id, x, y, name, onDragStart }: NoteNodeProps) {
  // TODO: src 적용 필요
  const radius = 64;
  return (
    <Node x={x} y={y} id={id} onDragStart={onDragStart} draggable>
      <Node.Circle radius={radius} fill="#FFF2CB" />
      <Node.Text fontSize={16} content={name} />
    </Node>
  );
}
