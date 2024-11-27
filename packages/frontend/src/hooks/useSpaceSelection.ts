import { useState } from "react";

export default function useSpaceSelection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  };

  const selectEdge = (edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
  };

  const clearSelection = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  return {
    selectNode,
    selectEdge,
    selectedNodeId,
    selectedEdgeId,
    clearSelection,
  };
}
