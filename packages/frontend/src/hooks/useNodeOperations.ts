import React, { useMemo } from "react";

import { Vector2d } from "konva/lib/types";

import { EdgeType, NodeType } from "@/components/mock";

type useNodeOperationsParams = {
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>;
  setEdges: React.Dispatch<React.SetStateAction<EdgeType[]>>;
  stageSize: { width: number; height: number };
};

type CreateNodeParams = {
  parentId: string;
  position: Vector2d;
  type: NodeType["type"];
};

export type nodeOperationTypes = {
  onCreateNode: ({ parentId, position, type }: CreateNodeParams) => void;
};

export function useNodeOperations({
  setNodes,
  setEdges,
  stageSize,
}: useNodeOperationsParams) {
  return useMemo(
    () => ({
      onCreateNode: ({ parentId, position, type }: CreateNodeParams) => {
        const newNode = {
          id: "sampleId",
          type,
          x: position.x,
          y: position.y,
          name: "sampleName",
        };

        const newEdge = {
          from: parentId,
          to: newNode.id,
        };

        // TODO: Websocket 통신 이후 반영
        console.log({
          parentId,
          position,
          type,
          newEdge,
        });

        setNodes((prev) => [...prev, newNode]);
        setEdges((prev) => [...prev, newEdge]);
      },

      // TODO: 다른 노드 조작 추가
    }),
    [stageSize, setNodes, setEdges],
  );
}
