export type CardStatus = 'pending' | 'in-progress' | 'completed';

export interface Card {
  id: string;
  title: string;
  description: string;
  status: CardStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface ColumnDef {
  id: CardStatus;
  title: string;
  accent: string;
  badge: string;
  empty: string;
}
