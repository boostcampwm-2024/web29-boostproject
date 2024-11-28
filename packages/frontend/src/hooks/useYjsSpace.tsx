import { useEffect, useState } from "react";

import { EdgeWithId, Node, SpaceData } from "shared/types";
import * as Y from "yjs";

import { generateUniqueId } from "@/lib/utils";
import { useYjsStore } from "@/store/yjs";

import useY from "./yjs/useY";

const MOCK_DATA = {
  nodes: {
    root: {
      id: "root",
      type: "head" as const,
      name: "허니의 스페이스",
      x: 0,
      y: 0,
    },
  },
  edges: {},
};

export default function useYjsSpace() {
  const { yDoc } = useYjsStore();

  const yContext = yDoc?.getMap("context") as Y.Map<Y.Map<unknown>> | undefined;

  const context = useY(yContext) as SpaceData | undefined;
  const nodes = context?.nodes;
  const edgesRaw = context?.edges as EdgeWithId[] | undefined;

  const [edges, setEdges] = useState<SpaceData["edges"] | undefined>();

  // update functions

  const defineNode = (node: Omit<Node, "id">, parentNodeId?: Node["id"]) => {
    const yNodes = yContext?.get("nodes") as Y.Map<Node> | undefined;
    const yEdges = yContext?.get("edges") as Y.Map<EdgeWithId> | undefined;

    if (!yDoc || !yNodes || !yEdges) {
      return;
    }

    const nodeId = generateUniqueId();
    const edgeId = generateUniqueId();

    yDoc.transact(() => {
      yNodes.set(nodeId, { id: nodeId, ...node });

      if (parentNodeId) {
        yEdges.set(edgeId, { from: parentNodeId, to: nodeId });
      }
    });
  };

  const defineEdge = (fromNodeId: string, toNodeId: string) => {
    const yNodes = yContext?.get("nodes") as Y.Map<Node> | undefined;
    const yEdges = yContext?.get("edges") as Y.Map<EdgeWithId> | undefined;

    if (!yDoc || !yNodes || !yEdges) {
      return;
    }

    const edgeId = generateUniqueId();

    yDoc.transact(() => {
      yEdges.set(edgeId, {
        from: fromNodeId,
        to: toNodeId,
      });
    });
  };

  const deleteNode = (nodeId: Node["id"]) => {
    const yNodes = yContext?.get("nodes") as Y.Map<Node> | undefined;
    const yEdges = yContext?.get("edges") as Y.Map<EdgeWithId> | undefined;

    if (!yDoc || !yNodes || !yEdges) {
      return;
    }

    yDoc.transact(() => {
      yNodes.delete(nodeId);

      // 이어진 edge도 삭제
      // MEMO: nodeToEdge 같은 별도 구조로 저장한 뒤, 찾는 게 더 바람직할 것 같다.
      [...yEdges.entries()]
        .filter(
          ([, edge]) => (edge && edge.from === nodeId) || edge.to === nodeId,
        )
        .forEach(([edgeId]) => {
          yEdges.delete(edgeId);
        });
    });
  };

  const updateNode = (nodeId: Node["id"], patch: Partial<Omit<Node, "id">>) => {
    const yNodes = yContext?.get("nodes") as Y.Map<Node> | undefined;

    const prev = yNodes?.get(nodeId);

    if (!yNodes || !prev) {
      return;
    }

    yNodes.set(nodeId, { ...prev, ...patch, id: nodeId });
  };

  // edgesRaw는 nodeId로만 구성되어 있음 -> Node로 변환
  useEffect(() => {
    const edgesData =
      edgesRaw &&
      Object.entries(edgesRaw).reduce<typeof edges>((ac, [edgeId, edge]) => {
        const from = nodes?.[edge.from];
        const to = nodes?.[edge.to];

        if (!from || !to) {
          return ac;
        }

        return {
          ...ac,
          [edgeId]: { from, to },
        };
      }, {});

    setEdges(edgesData);
  }, [edgesRaw, nodes]);

  /* NOTE - 개발 단계에서 프론트엔드 Space 개발을 위한 Mock 데이터 임의 설정 */
  if (import.meta.env.VITE_MOCK) {
    if (!yDoc || !nodes || Object.keys(nodes || {}).length === 0) {
      // mock 상태일 때도 yDoc에 초기 데이터 설정
      if (yDoc && yContext) {
        const yNodes = new Y.Map();
        const yEdges = new Y.Map();

        yDoc.transact(() => {
          // root 노드 설정
          yNodes.set(MOCK_DATA.nodes.root.id, MOCK_DATA.nodes.root);
          yContext.set("nodes", yNodes);
          yContext.set("edges", yEdges);
        });
      }

      return {
        nodes: MOCK_DATA.nodes,
        edges: MOCK_DATA.edges,
        defineNode,
        defineEdge,
        updateNode,
        deleteNode,
      };
    }
  }

  return { nodes, edges, updateNode, defineNode, defineEdge, deleteNode };
}
