"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardStatus, ColumnDef } from "@/lib/types";
import CardItem from "./CardItem";

interface ColumnProps {
  column: ColumnDef;
  cards: Card[];
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: CardStatus) => void;
  onDropCard: (cardId: string, targetStatus: CardStatus) => void;
  onAddCard?: () => void;
}

export default function Column({
  column,
  cards,
  onUpdate,
  onDelete,
  onMove,
  onDropCard,
  onAddCard,
}: ColumnProps) {
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const cardId = e.dataTransfer.getData("cardId");
    if (cardId) onDropCard(cardId, column.id);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      <div
        className={`rounded-2xl border-2 transition-all duration-200 flex flex-col h-full ${
          dragOver
            ? "border-blue-400 bg-blue-50/50 shadow-lg scale-[1.01]"
            : "border-slate-200 bg-slate-50/80"
        }`}
      >
        <div
          className={`px-4 py-3.5 rounded-t-2xl border-b border-slate-200 ${column.accent}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-semibold text-sm tracking-wide">
                {column.title}
              </h2>
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${column.badge}`}
              >
                {cards.length}
              </span>
            </div>
            {column.id === "pending" && onAddCard && (
              <button
                onClick={onAddCard}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors text-current opacity-70 hover:opacity-100"
                title="Add card"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>

        <div
          className="flex-1 p-3 space-y-2.5 min-h-[200px]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {cards.length === 0 ? (
            <div
              className={`h-full min-h-[160px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200"
              }`}
            >
              <p className="text-xs text-slate-400 font-medium">
                {column.empty}
              </p>
              {dragOver && (
                <p className="text-xs text-blue-500 mt-1">Release to drop</p>
              )}
            </div>
          ) : (
            cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onMove={onMove}
                isDragging={draggingId === card.id}
                onDragStart={(e) => {
                  setDraggingId(card.id);
                  e.dataTransfer.setData("cardId", card.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => setDraggingId(null)}
              />
            ))
          )}

          {cards.length > 0 && dragOver && (
            <div className="h-14 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center">
              <p className="text-xs text-blue-500">Drop here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
