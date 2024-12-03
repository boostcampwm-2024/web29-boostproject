export interface PerformanceResult {
  mysqlDuration: number;
  mongoDuration: number;
  difference: number;
}

export interface MockSpace {
  id: string;
  userId: string;
  name: string;
  edges: string;
  nodes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockNote {
  id: string;
  userId: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
