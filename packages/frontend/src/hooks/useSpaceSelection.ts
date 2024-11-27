import { useState } from "react";

import { Node } from "shared/types";

export type selectedInfoType = {
  id: string;
  type?: Exclude<Node["type"], "url" | "image" | "head"> | null;
};

export default function useSpaceSelection() {
  const [selectedNode, setSelectNode] = useState<selectedInfoType | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<selectedInfoType | null>(
    null,
  );

  const selectNode = ({ id, type }: selectedInfoType) => {
    setSelectNode({
      id,
      type: type || null,
    });
    setSelectedEdge(null);
  };

  const selectEdge = ({ id }: selectedInfoType) => {
    setSelectedEdge({
      id,
      type: null,
    });
    setSelectNode(null);
  };

  const clearSelection = () => {
    setSelectNode(null);
    setSelectedEdge(null);
  };

  return {
    selectNode,
    selectEdge,
    selectedNode,
    selectedEdge,
    clearSelection,
  };
}
