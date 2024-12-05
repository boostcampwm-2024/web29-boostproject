import { ReactNode, useEffect, useRef, useState } from "react";
import { Circle, Group, KonvaNodeEvents, Text } from "react-konva";
import { useNavigate } from "react-router-dom";

import Konva from "konva";
import {
  KonvaEventObject,
  Node as KonvaNode,
  NodeConfig,
} from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

const RADIUS = 64;
const MORE_BUTTON_RADIUS = 12;

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
  ...rest
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
      {...rest}
    />
  );
};

type NodeMoreButtonProps = {
  onTap?:
    | ((evt: KonvaEventObject<PointerEvent, KonvaNode<NodeConfig>>) => void)
    | undefined;
  content: string;
};

Node.MoreButton = function NodeMoreButton({ content }: NodeMoreButtonProps) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!isTouch) return null;

  const handleTap = (e: KonvaEventObject<Event>) => {
    e.cancelBubble = true;

    const parentNode = e.target.findAncestor("Group").findAncestor("Group");

    if (!parentNode) return;

    const absolutePosition = parentNode.getAbsolutePosition();

    const contextMenuEvent = new MouseEvent("contextmenu", {
      button: 2,
      buttons: 2,
      clientX: absolutePosition.x,
      clientY: absolutePosition.y,
      bubbles: true,
    });

    parentNode.fire("contextmenu", {
      evt: contextMenuEvent,
      target: parentNode,
    });
  };

  return (
    <Group x={RADIUS - 20} y={-RADIUS + 20} onTap={handleTap}>
      <Circle
        x={0}
        y={0}
        radius={MORE_BUTTON_RADIUS}
        fill="#FFFFFF"
        stroke="#DED8D3"
        strokeWidth={1.5}
      />
      <Text
        x={0}
        y={1}
        fontSize={16}
        text={content}
        align="center"
        verticalAlign="middle"
        width={MORE_BUTTON_RADIUS * 2}
        height={MORE_BUTTON_RADIUS * 2}
        offsetX={MORE_BUTTON_RADIUS}
        offsetY={MORE_BUTTON_RADIUS}
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

export function NoteNode({
  id,
  x,
  y,
  name,
  src,
  onContextMenu,
  ...rest
}: NoteNodeProps) {
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
      onTap={() => {
        navigate(`/note/${src}`);
      }}
      onContextMenu={onContextMenu}
      {...rest}
    >
      <Node.Circle radius={RADIUS} fill="#FAF9F7" stroke="#DED8D3" />
      <Node.Text width={RADIUS * 2} fontSize={16} content={name} />
      <Node.MoreButton onTap={onContextMenu} content="⋮" />
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
  onContextMenu,
  ...rest
}: SubspaceNodeProps) {
  const navigate = useNavigate();

  return (
    <Node
      id={id}
      x={x}
      y={y}
      onClick={() => navigate(`/space/${src}`)}
      onTap={() => navigate(`/space/${src}`)}
      onContextMenu={onContextMenu}
      {...rest}
    >
      <Node.Circle radius={RADIUS} fill="#FFF4BB" stroke="#F9D46B" />
      <Node.Text
        width={RADIUS * 2}
        fontSize={16}
        fontStyle="700"
        content={name}
      />
      <Node.MoreButton onTap={onContextMenu} content="⋮" />
    </Node>
  );
}
