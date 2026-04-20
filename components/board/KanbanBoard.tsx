"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader as Loader2 } from "lucide-react";
import { ColumnDef, CardStatus } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useBoard } from "@/hooks/useBoard";
import BoardHeader from "./BoardHeader";
import Column from "./Column";
import CardModal from "./CardModal";

const COLUMNS: ColumnDef[] = [
  {
    id: "pending",
    title: "Pending",
    accent: "bg-amber-50 text-amber-800",
    badge: "bg-amber-200 text-amber-800",
    empty: "No pending cards",
  },
  {
    id: "in-progress",
    title: "In Progress",
    accent: "bg-blue-50 text-blue-800",
    badge: "bg-blue-200 text-blue-800",
    empty: "Nothing in progress",
  },
  {
    id: "completed",
    title: "Completed",
    accent: "bg-emerald-50 text-emerald-800",
    badge: "bg-emerald-200 text-emerald-800",
    empty: "No completed cards",
  },
];

export default function KanbanBoard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const {
    cards,
    loading,
    searchQuery,
    setSearchQuery,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    getColumnCards,
  } = useBoard(user?.id);
  const [createOpen, setCreateOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-medium">
            Loading your board...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const totalCards = cards.length;
  const filteredTotal = COLUMNS.reduce(
    (sum, col) => sum + getColumnCards(col.id).length,
    0,
  );
  const isFiltering = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <BoardHeader
        userName={user.name}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddCard={() => setCreateOpen(true)}
        onLogout={handleLogout}
        totalCards={totalCards}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isFiltering && (
          <div className="mb-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Showing <strong>{filteredTotal}</strong> result
            {filteredTotal !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={getColumnCards(col.id)}
              onUpdate={updateCard}
              onDelete={deleteCard}
              onMove={moveCard}
              onDropCard={(cardId, targetStatus) => {
                const card = cards.find((c) => c.id === cardId);
                if (card && card.status !== targetStatus) {
                  moveCard(cardId, targetStatus);
                }
              }}
              onAddCard={
                col.id === "pending" ? () => setCreateOpen(true) : undefined
              }
            />
          ))}
        </div>

        {totalCards === 0 && !isFiltering && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Your board is empty
            </h3>
            <p className="text-slate-500 text-sm mb-5">
              Create your first card to get started
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create first card
            </button>
          </div>
        )}
      </main>

      {createOpen && (
        <CardModal
          mode="create"
          onClose={() => setCreateOpen(false)}
          onCreate={createCard}
        />
      )}
    </div>
  );
}
