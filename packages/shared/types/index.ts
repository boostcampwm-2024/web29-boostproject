export type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "head" | "note" | "url" | "image" | "subspace";
};

export type Edge = {
  from: Node;
  to: Node;
};

export type EdgeWithId = {
  from: string;
  to: string;
};

export type SpaceData = {
  contextId: string;
  parentContextId?: string;
  edges: Record<string, Edge>; // <edgeId, {}>
  nodes: Record<Node["id"], Node>;
};
