"use client";

import { useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { Card } from "@/lib/types";

interface DeleteModalProps {
  card: Card;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({
  card,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Delete card</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-slate-700 font-medium mb-1">
                Are you sure you want to delete this card?
              </p>
              <p className="text-sm text-slate-500">
                &ldquo;
                <span className="font-medium text-slate-700">{card.title}</span>
                &rdquo; will be permanently removed. This action cannot be
                undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Delete card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
