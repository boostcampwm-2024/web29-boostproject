export type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "head" | "note" | "url" | "image" | "subspace";
};

export const initialNodes: Node[] = [
  { id: "0", x: 0, y: 0, type: "head", name: "Hello World" },
  { id: "1", x: 100, y: 100, type: "note", name: "first" },
  { id: "2", x: -100, y: 100, type: "note", name: "second" },
];
