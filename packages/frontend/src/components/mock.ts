export type NodeType = {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "head" | "note" | "url" | "image" | "subspace";
};

export type EdgeType = {
  from: NodeType["id"];
  to: NodeType["id"];
};

export const initialNodes: NodeType[] = [
  { id: "0", x: 0, y: 0, type: "head", name: "Hello World" },
  { id: "1", x: 100, y: 100, type: "note", name: "first" },
  { id: "2", x: -100, y: 100, type: "note", name: "second" },
];

export const initialEdges: EdgeType[] = [
  { from: "0", to: "1" },
  { from: "1", to: "2" },
];
