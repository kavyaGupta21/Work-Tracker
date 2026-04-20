"use client";

import { useState } from "react";
import { Pencil, Trash2, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Card, CardStatus } from "@/lib/types";
import CardModal from "./CardModal";
import DeleteModal from "./DeleteModal";

const STATUS_LABELS: Record<CardStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const NEXT_STATUS: Record<CardStatus, CardStatus | null> = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: null,
};

const PREV_STATUS: Record<CardStatus, CardStatus | null> = {
  pending: null,
  "in-progress": "pending",
  completed: "in-progress",
};

interface CardItemProps {
  card: Card;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: CardStatus) => void;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CardItem({
  card,
  onUpdate,
  onDelete,
  onMove,
  isDragging,
  onDragStart,
  onDragEnd,
}: CardItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const next = NEXT_STATUS[card.status];
  const prev = PREV_STATUS[card.status];

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={`group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isDragging ? "opacity-40 scale-95 rotate-1" : "hover:-translate-y-0.5"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug flex-1 line-clamp-2">
            {card.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {card.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />
            {timeAgo(card.updatedAt)}
          </span>

          <div className="flex items-center gap-1">
            {prev && (
              <button
                onClick={() => onMove(card.id, prev)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title={`Move to ${STATUS_LABELS[prev]}`}
              >
                <ArrowLeft size={11} />
                {STATUS_LABELS[prev]}
              </button>
            )}
            {next && (
              <button
                onClick={() => onMove(card.id, next)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title={`Move to ${STATUS_LABELS[next]}`}
              >
                {STATUS_LABELS[next]}
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      {editOpen && (
        <CardModal
          mode="edit"
          card={card}
          onClose={() => setEditOpen(false)}
          onUpdate={onUpdate}
        />
      )}

      {deleteOpen && (
        <DeleteModal
          card={card}
          onConfirm={() => onDelete(card.id)}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}
