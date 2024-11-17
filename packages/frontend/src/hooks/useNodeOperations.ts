// hooks/useNodeOperations.ts
import React, { useMemo } from "react";

import { Vector2d } from "konva/lib/types";
import { X } from "lucide-react";

import { Node } from "@/components/mock";

type useNodeOperationsParams = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  stageSize: { width: number; height: number };
};

type CreateNodeParams = {
  parentId: string;
  position: Vector2d;
  type: Node["type"];
};

export type nodeOperationTypes = {
  onCreateNode: ({ parentId, position, type }: CreateNodeParams) => void;
};

export function useNodeOperations({
  nodes,
  setNodes,
  stageSize,
}: useNodeOperationsParams) {
  return useMemo(
    () => ({
      onCreateNode: ({ parentId, position, type }: CreateNodeParams) => {
        const newNode = {
          id: "sampleId",
          type,
          x: position.x - stageSize.width / 2,
          y: position.y - stageSize.height / 2,
          name: "sampleName",
        };

        // TODO: Websocket 통신
        console.log({
          parentId,
          position,
          type,
        });

        setNodes((prev) => [...prev, newNode]);
      },

      // TODO: 다른 노드 조작 추가
    }),
    [stageSize, setNodes],
  );
}
