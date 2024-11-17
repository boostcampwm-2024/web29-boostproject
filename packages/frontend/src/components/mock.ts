import type { Edge, Node } from "shared/types";

export const nodes: Node[] = [
  { id: "0", x: 0, y: 0, type: "head", name: "Hello World" },
  { id: "1", x: 100, y: 100, type: "note", name: "first" },
  { id: "2", x: -100, y: 100, type: "note", name: "second" },
];

export const edges: Edge[] = [
  { from: nodes[0], to: nodes[1] },
  { from: nodes[0], to: nodes[2] },
];
