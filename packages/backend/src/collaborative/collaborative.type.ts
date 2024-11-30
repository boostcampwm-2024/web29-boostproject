export interface SpaceDocument {
  id: string;
  parentContextNodeId: string | null;
  edges: string;
  nodes: string;
}

export interface NoteDocument {
  id: string;
  content: string;
}

export type DocumentType = 'space' | 'note';
export type Document = SpaceDocument | NoteDocument;
