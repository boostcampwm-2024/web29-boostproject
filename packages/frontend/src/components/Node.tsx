/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import Konva from "konva";

type NodeProps = {
  x: number;
  y: number;
  children?: React.ReactNode;
};

export default function Node({ x, y, children }: NodeProps) {
  return (
    <Group x={x} y={y}>
      {children}
    </Group>
  );
}

type NodeCirleProps = {
  radius: number;
  fill: string;
};

Node.Circle = function ({ radius, fill }: NodeCirleProps) {
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
      <Node.Circle radius={radius} fill="#FFF2CB" />
      <Node.Text
        width={radius * 2}
        fontSize={16}
        fontStyle="700"
        content={name}
      />
    </Node>
  );
}
