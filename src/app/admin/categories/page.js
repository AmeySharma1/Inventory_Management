"use client";

const categories = [
  { name: "Acids", count: 3, emoji: "⚗️", color: "#ef4444" },
  { name: "Bases", count: 2, emoji: "🔬", color: "#7c3aed" },
  { name: "Solvents", count: 4, emoji: "💧", color: "#06b6d4" },
  { name: "Salts", count: 3, emoji: "🧂", color: "#f59e0b" },
  { name: "Indicators", count: 1, emoji: "🟠", color: "#f97316" },
  { name: "Reagents", count: 2, emoji: "🟣", color: "#8b5cf6" },
  { name: "Sugars", count: 1, emoji: "🍬", color: "#10b981" },
  { name: "Other", count: 0, emoji: "📦", color: "#6b7280" },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-white/40 text-sm mt-1">{categories.length} product categories</p>
        </div>
        <button className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="glass-card rounded-xl p-5 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
              style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
            >
              {cat.emoji}
            </div>
            <p className="text-sm font-semibold text-white">{cat.name}</p>
            <p className="text-xs text-white/40 mt-1">{cat.count} product{cat.count !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
