/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import Konva from "konva";

type NodeProps = {
  x: number;
  y: number;
  draggable?: boolean;
  children?: React.ReactNode;
} & Konva.GroupConfig;

export default function Node({
  x,
  y,
  draggable,
  children,
  ...rest
}: NodeProps) {
  return (
    <Group x={x} y={y} draggable={draggable} {...rest}>
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
  name: string;
};

export function HeadNode({ name }: HeadNodeProps) {
  const radius = 64;
  return (
    <Node x={0} y={0}>
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
  x: number;
  y: number;
  src: string;
  name: string;
};

export function NoteNode({ x, y, name }: NoteNodeProps) {
  // TODO: src 적용 필요
  const radius = 64;
  return (
    <Node x={x} y={y}>
      <Node.Circle radius={radius} fill="#FFF2CB" />
      <Node.Text fontSize={16} content={name} />
    </Node>
  );
}
