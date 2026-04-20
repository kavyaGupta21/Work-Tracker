'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import {
  getUsers,
  saveUsers,
  getUserByEmail,
  getUserById,
  getSession,
  saveSession,
  clearSession,
  generateId,
  hashPassword,
} from '@/lib/storage';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = getSession();
    if (sessionId) {
      const found = getUserById(sessionId);
      setUser(found);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const found = getUserByEmail(email);
    if (!found) return { error: 'No account found with this email.' };
    if (found.password !== hashPassword(password)) return { error: 'Incorrect password.' };
    saveSession(found.id);
    setUser(found);
    return {};
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    const existing = getUserByEmail(email);
    if (existing) return { error: 'An account with this email already exists.' };
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    const users = getUsers();
    saveUsers([...users, newUser]);
    saveSession(newUser.id);
    setUser(newUser);
    return {};
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
