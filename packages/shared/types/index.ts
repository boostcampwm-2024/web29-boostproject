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
  id: string;
  parentContextId?: string;
  edges: Record<string, Edge>; // <edgeId, {}>
  nodes: Record<Node["id"], Node>;
};

export type SpaceEntityData = {
  id: string;
  parentContextId?: string;
  userId: string;
  urlPath: string;
  edges: Record<string, Edge>; // <edgeId, {}>
  nodes: Record<Node["id"], Node>;
};
