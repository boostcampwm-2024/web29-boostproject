import { useEffect, useState } from "react";
import { Line } from "react-konva";

import Konva from "konva";

import type { NodeType } from "./mock";

type EdgeProps = {
  from: NodeType["id"];
  to: NodeType["id"];
  nodes: NodeType[];
} & Konva.LineConfig;

export default function Edge({ from, to, nodes }: EdgeProps) {
  const [points, setPoints] = useState<number[]>([]);
  const RADIUS = 64;

  useEffect(() => {
    const fromNode = nodes.find((node) => node.id === from);
    const toNode = nodes.find((node) => node.id === to);

    if (fromNode && toNode) {
      // 두 노드 간의 방향 벡터를 계산
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 방향 벡터를 정규화하여 반지름만큼 떨어진 점을 계산
      const offsetX = (dx / distance) * RADIUS;
      const offsetY = (dy / distance) * RADIUS;

      // Line의 시작점과 끝점을 각각 노드 원의 경계로 조정
      setPoints([
        fromNode.x + offsetX,
        fromNode.y + offsetY,
        toNode.x - offsetX,
        toNode.y - offsetY,
      ]);
    }
  }, [from, to, nodes]);

  return <Line points={points} stroke={"#FFCC00"} strokeWidth={3}></Line>;
}
