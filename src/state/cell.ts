export interface Cell {
  id: string;
  type: 'code' | 'text';
  content: string;
}

export type CellTypes = 'code' | 'text';
