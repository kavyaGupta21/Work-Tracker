import { User, Card } from './types';

const USERS_KEY = 'kanban_users';
const CARDS_KEY = 'kanban_cards';
const SESSION_KEY = 'kanban_session';


export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserById = (id: string): User | null => {
  return getUsers().find((u) => u.id === id) ?? null;
};

export const getUserByEmail = (email: string): User | null => {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const getCards = (): Card[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCards = (cards: Card[]): void => {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
};

export const getSession = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
};

export const saveSession = (userId: string): void => {
  localStorage.setItem(SESSION_KEY, userId);
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};
