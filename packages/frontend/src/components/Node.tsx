import { ReactNode, useEffect, useRef, useState } from "react";
import { Circle, Group, KonvaNodeEvents, Text } from "react-konva";
import { useNavigate } from "react-router-dom";

import Konva from "konva";
import { Vector2d } from "konva/lib/types";

type NodeProps = {
  id: string;
  x: number;
  y: number;
  draggable?: boolean;
  children?: ReactNode;
} & Konva.GroupConfig &
  KonvaNodeEvents;

type NodeHandlers = {
  dragBoundFunc?: () => Vector2d;
} & KonvaNodeEvents;

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
  shadowColor?: string;
};

Node.Circle = function NodeCircle({
  radius,
  fill,
  shadowColor = "#F9D46B",
}: NodeCircleProps) {
  return (
    <Circle x={0} y={0} radius={radius} fill={fill} shadowColor={shadowColor} />
  );
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

export function NoteNode({ id, x, y, name, src, ...rest }: NoteNodeProps) {
  // TODO: src 적용 필요
  const navigate = useNavigate();
  const radius = 64;
  return (
    <Node
      id={id}
      x={x}
      y={y}
      onClick={(e) => {
        if (e.evt.button === 0) {
          navigate(`/note/${src}`);
        }
      }}
      {...rest}
    >
      <Node.Circle radius={radius} fill="#FFF2CB" />
      <Node.Text fontSize={16} content={name} />
    </Node>
  );
}

export type SubspaceNodeProps = {
  id: string;
  x: number;
  y: number;
  name: string;
  src: string;
} & NodeHandlers;

export function SubspaceNode({
  id,
  x,
  y,
  name,
  src,
  ...rest
}: SubspaceNodeProps) {
  const navigate = useNavigate();

  return (
    <Node
      id={id}
      x={x}
      y={y}
      onClick={() => navigate(`/space/${src}`)}
      {...rest}
    >
      <Node.Circle radius={64} fill="#FFF2CB" />
      <Node.Text fontSize={16} fontStyle="700" content={name} />
    </Node>
  );
}
