import { Node } from "shared/types";

export type ContextMenuItemConfig = {
  label: string;
  action: () => void;
};

export type SelectedNodeInfo = {
  id: string;
  type: Exclude<Node["type"], "url" | "image" | "head">;
};

export type SelectedEdgeInfo = {
  id: string;
};

export type ContextMenuActions = {
  onNodeUpdate: (nodeId: string, patch: Partial<Node>) => void;
  onNodeDelete: (nodeId: string) => void;
  onEdgeDelete: (edgeId: string) => void;
};

export type SelectionState = {
  selectedNode: SelectedNodeInfo | null;
  selectedEdge: SelectedEdgeInfo | null;
  clearSelection: () => void;
  onClearSelection: () => void;
};
