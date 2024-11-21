import { useEffect, useState } from "react";

import { Edge, Node, SpaceData } from "shared/types";
import * as Y from "yjs";

import { useYjsStore } from "@/store/yjs";

import useY from "./yjs/useY";

export default function useYjsSpace() {
  const { yDoc, yProvider } = useYjsStore();
  const [yContext, setYContext] = useState<Y.Map<unknown>>();

  // TODO 코드 개선
  const yNodes = yContext?.get("nodes") as Y.Map<Node> | undefined;
  const yEdges = yContext?.get("edges") as Y.Map<Edge> | undefined;
  const nodes = useY(yNodes) as SpaceData["nodes"] | undefined;
  const edgesRaw = useY(yEdges) as
    | Record<string, { from: string; to: string }>
    | undefined;

  const [edges, setEdges] = useState<SpaceData["edges"] | undefined>();

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

    // NOTE nodes는 포함되지 않아도 될 것 같긴 하다 -> 이후 이를 고려해 로직 수정
  }, [edgesRaw, nodes]);

  useEffect(() => {
    if (!yDoc || !yProvider) {
      return undefined;
    }

    const handleOnSync = (/* isSynced: boolean */) => {
      const yContext = yDoc.getMap("context");
      setYContext(yContext);
    };

    yProvider.on("sync", handleOnSync);
    return () => yProvider.off("sync", handleOnSync);
  }, [yDoc, yProvider]);

  return { nodes, edges };
}
