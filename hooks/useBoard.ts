'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardStatus } from '@/lib/types';
import { getCards, saveCards, generateId } from '@/lib/storage';

export function useBoard(userId: string | undefined) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      return;
    }
    const all = getCards().filter((c) => c.userId === userId);
    setCards(all);
    setLoading(false);
  }, [userId]);

  const persist = useCallback(
    (updated: Card[]) => {
      setCards(updated);
      const all = getCards().filter((c) => c.userId !== userId);
      saveCards([...all, ...updated]);
    },
    [userId]
  );

  const createCard = useCallback(
    (title: string, description: string) => {
      if (!userId) return;
      const card: Card = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
      };
      persist([...cards, card]);
    },
    [cards, persist, userId]
  );

  const updateCard = useCallback(
    (id: string, title: string, description: string) => {
      persist(
        cards.map((c) =>
          c.id === id ? { ...c, title: title.trim(), description: description.trim(), updatedAt: new Date().toISOString() } : c
        )
      );
    },
    [cards, persist]
  );

  const moveCard = useCallback(
    (id: string, status: CardStatus) => {
      persist(
        cards.map((c) =>
          c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
        )
      );
    },
    [cards, persist]
  );

  const deleteCard = useCallback(
    (id: string) => {
      persist(cards.filter((c) => c.id !== id));
    },
    [cards, persist]
  );

  const filteredCards = searchQuery.trim()
    ? cards.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const getColumnCards = (status: CardStatus) =>
    filteredCards.filter((c) => c.status === status);

  return {
    cards: filteredCards,
    loading,
    searchQuery,
    setSearchQuery,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    getColumnCards,
  };
}
