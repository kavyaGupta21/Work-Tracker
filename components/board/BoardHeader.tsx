"use client";

import { useState } from "react";
import { Search, Plus, LogOut, User, LayoutDashboard, X } from "lucide-react";

interface BoardHeaderProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddCard: () => void;
  onLogout: () => void;
  totalCards: number;
}

export default function BoardHeader({
  userName,
  searchQuery,
  onSearchChange,
  onAddCard,
  onLogout,
  totalCards,
}: BoardHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-slate-900">
                Kanban Board
              </h1>
              <p className="text-xs text-slate-500">
                {totalCards} {totalCards === 1 ? "card" : "cards"} total
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search cards..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onAddCard}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Card</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[100px] truncate">
                  {userName}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {userName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
