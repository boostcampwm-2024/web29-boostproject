import { ReactNode, useEffect, useRef, useState } from "react";
import { Circle, Group, KonvaNodeEvents, Shape, Text } from "react-konva";
import { useNavigate } from "react-router-dom";

import Konva from "konva";
import { Vector2d } from "konva/lib/types";

const RADIUS = 64;

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
  stroke?: string;
  shadowColor?: string;
};

Node.Circle = function NodeCircle({
  radius,
  fill,
  stroke,
  shadowColor = "#F9D46B",
}: NodeCircleProps) {
  return (
    <Circle
      x={0}
      y={0}
      radius={radius}
      fill={fill}
      stroke={stroke}
      shadowColor={shadowColor}
    />
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

Node.MoreButton = function NodeMoreButton({ onTap }: { onTap: () => void }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouch) return null;

  return (
    <Group onTap={onTap}>
      <Circle
        x={45}
        y={-45}
        radius={12}
        fill="#FFFFFF"
        stroke="#FFB800"
        strokeWidth={1}
      />
    </Group>
  );
};

export type HeadNodeProps = {
  id: string;
  name: string;
} & NodeHandlers;

export function HeadNode({ id, name, ...rest }: HeadNodeProps) {
  return (
    <Node id={id} x={0} y={0} draggable {...rest}>
      <Node.Circle radius={RADIUS} fill="#FFD000" />
      <Node.Text
        width={RADIUS * 2}
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
      <Node.Circle radius={RADIUS} fill="#FAF9F7" stroke="#DED8D3" />
      <Node.Text width={RADIUS * 2} fontSize={16} content={name} />
      <Node.MoreButton onTap={() => console.log("터치!")} />
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
      <Node.Circle radius={RADIUS} fill="#FFF4BB" stroke="#F9D46B" />
      <Node.Text
        width={RADIUS * 2}
        fontSize={16}
        fontStyle="700"
        content={name}
      />
    </Node>
  );
}
