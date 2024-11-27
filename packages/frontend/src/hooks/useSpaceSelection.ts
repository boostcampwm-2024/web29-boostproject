import { useState } from "react";

import {
  SelectedEdgeInfo,
  SelectedNodeInfo,
} from "@/components/space/context-menu/type";

export default function useSpaceSelection() {
  const [selectedNode, setSelectNode] = useState<SelectedNodeInfo | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<SelectedEdgeInfo | null>(
    null,
  );

  const selectNode = ({ id, type }: SelectedNodeInfo) => {
    setSelectNode({
      id,
      type: type || null,
    });
    setSelectedEdge(null);
  };

  const selectEdge = ({ id }: SelectedEdgeInfo) => {
    setSelectedEdge({
      id,
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
