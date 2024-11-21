import type { Edge, Node } from "shared/types";

export const nodeSample: Node[] = [
  { id: "0", x: 0, y: 0, type: "head", name: "Hello World" },
  { id: "1", x: 100, y: 100, type: "note", name: "first" },
  { id: "2", x: -100, y: 100, type: "note", name: "second" },
];

export const edgeSample: Edge[] = [
  { from: nodeSample[0], to: nodeSample[1] },
  { from: nodeSample[0], to: nodeSample[2] },
];
