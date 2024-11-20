import { useState } from "react";

import { Vector2d } from "konva/lib/types";
import { Edge, Node } from "shared/types";

type useSpaceNodeParams = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
};

export default function useSpaceNode({
  initialNodes = [],
  initialEdges = [],
}: useSpaceNodeParams) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const spaceActions = {
    createNode: (type: Node["type"], parentNode: Node, position: Vector2d) => {
      const newNode = {
        id: Math.random().toString(36),
        name: `New ${type}`,
        x: position.x,
        y: position.y,
        type,
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);

      if (parentNode) {
        const newEdge = {
          from: parentNode,
          to: newNode,
        };

        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
    },
  };

  return { nodes, edges, spaceActions };
}
