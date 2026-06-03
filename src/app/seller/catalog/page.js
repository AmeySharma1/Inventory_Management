"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Acids", "Bases", "Solvents", "Salts", "Indicators", "Reagents", "Sugars"];

const catalog = [
  { id: 1, name: "Sodium Chloride", sku: "NaCl-001", category: "Salts", baseUnit: "kg", pricePerBase: 500, stock: 150, desc: "High purity NaCl, suitable for laboratory and industrial use.", emoji: "🧂" },
  { id: 2, name: "Ethanol 99%", sku: "ETOH-001", category: "Solvents", baseUnit: "L", pricePerBase: 900, stock: 45, desc: "Anhydrous ethanol for analytical grade applications.", emoji: "🧪" },
  { id: 3, name: "Hydrochloric Acid", sku: "HCl-001", category: "Acids", baseUnit: "L", pricePerBase: 1200, stock: 0.8, desc: "37% HCl solution, reagent grade.", emoji: "⚗️" },
  { id: 4, name: "Sodium Hydroxide", sku: "NaOH-001", category: "Bases", baseUnit: "kg", pricePerBase: 800, stock: 2.3, desc: "Pellets form, ≥97% purity.", emoji: "🔬" },
  { id: 5, name: "Glucose Powder", sku: "GLU-001", category: "Sugars", baseUnit: "kg", pricePerBase: 520, stock: 80, desc: "D-Glucose monohydrate, fine powder.", emoji: "🍬" },
  { id: 6, name: "Acetone", sku: "ACE-001", category: "Solvents", baseUnit: "L", pricePerBase: 420, stock: 12, desc: "HPLC grade acetone, low water content.", emoji: "💧" },
  { id: 7, name: "Copper Sulfate", sku: "CuSO4-001", category: "Salts", baseUnit: "g", pricePerBase: 1.8, stock: 300, desc: "CuSO₄·5H₂O pentahydrate crystals.", emoji: "🔷" },
  { id: 8, name: "Potassium Permanganate", sku: "KMnO4-001", category: "Reagents", baseUnit: "g", pricePerBase: 2.5, stock: 120, desc: "Dark purple crystals, oxidising agent.", emoji: "🟣" },
  { id: 9, name: "Methyl Orange Indicator", sku: "MO-001", category: "Indicators", baseUnit: "g", pricePerBase: 15, stock: 50, desc: "pH 3.1–4.4 range indicator.", emoji: "🟠" },
  { id: 10, name: "Distilled Water", sku: "H2O-001", category: "Solvents", baseUnit: "L", pricePerBase: 50, stock: 200, desc: "Double-distilled, ultra-pure water.", emoji: "💦" },
  { id: 11, name: "Sulfuric Acid", sku: "H2SO4-001", category: "Acids", baseUnit: "L", pricePerBase: 950, stock: 5, desc: "98% concentration, analytical reagent.", emoji: "🔴" },
  { id: 12, name: "Acetic Acid", sku: "AA-001", category: "Acids", baseUnit: "L", pricePerBase: 680, stock: 20, desc: "Glacial acetic acid, 99.8% purity.", emoji: "🧴" },
];

const UNIT_ALIASES = {
  kg: ["kg", "g"],
  g: ["g", "kg"],
  L: ["L", "mL"],
  mL: ["mL", "L"],
  unit: ["unit"],
};

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let items = catalog.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });

    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "price-asc") items.sort((a, b) => a.pricePerBase - b.pricePerBase);
    else if (sortBy === "price-desc") items.sort((a, b) => b.pricePerBase - a.pricePerBase);
    else if (sortBy === "stock") items.sort((a, b) => b.stock - a.stock);

    return items;
  }, [search, category, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-white/40 text-sm mt-1">{catalog.length} products available</p>
        </div>
        <Link href="/seller/new-order">
          <button className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Place Order
          </button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-input px-4 py-2.5 rounded-xl text-sm min-w-36"
        >
          <option value="name">Sort: Name A-Z</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="stock">Stock: High to Low</option>
        </select>

        {/* View toggle */}
        <div className="flex gap-1 p-1 glass rounded-xl">
          <button onClick={() => setViewMode("grid")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "btn-primary" : "text-white/40 hover:text-white/70"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <button onClick={() => setViewMode("list")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "btn-primary" : "text-white/40 hover:text-white/70"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              category === c ? "btn-primary" : "glass text-white/50 hover:text-white/80"
            }`}
          >
            {c}
            {c !== "All" && (
              <span className="ml-1.5 opacity-60">
                ({catalog.filter((p) => p.category === c).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid view */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              className="glass-card rounded-xl p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl">
                  {p.emoji}
                </div>
                <span className={`badge ${p.stock === 0 ? "badge-danger" : p.stock < 5 ? "badge-warning" : "badge-success"} text-[10px]`}>
                  {p.stock === 0 ? "Out" : p.stock < 5 ? "Low" : "In Stock"}
                </span>
              </div>

              <p className="text-sm font-semibold text-white mb-0.5">{p.name}</p>
              <code className="text-[10px] text-purple-300 font-mono block mb-2">{p.sku}</code>
              <p className="text-[11px] text-white/35 leading-relaxed mb-3 line-clamp-2">{p.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-emerald-400">
                    ₹{p.pricePerBase.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-white/30">per {p.baseUnit}</p>
                </div>
                <span className="badge badge-cyan">{p.category}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/6 flex gap-1 flex-wrap">
                {UNIT_ALIASES[p.baseUnit]?.map((u) => (
                  <span key={u} className="px-2 py-0.5 glass rounded-md text-[10px] text-white/40">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full glass-table">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">Category</th>
                <th className="text-left">Available Units</th>
                <th className="text-right">Price</th>
                <th className="text-right">Stock</th>
                <th className="text-center">Availability</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.emoji}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <code className="text-[10px] text-purple-300 font-mono">{p.sku}</code>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-cyan">{p.category}</span></td>
                  <td>
                    <div className="flex gap-1">
                      {UNIT_ALIASES[p.baseUnit]?.map((u) => (
                        <span key={u} className="px-2 py-0.5 glass rounded-md text-[10px] text-white/50">{u}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-sm font-semibold text-emerald-400">
                      ₹{p.pricePerBase.toLocaleString("en-IN")}
                    </span>
                    <span className="text-white/30 text-xs">/{p.baseUnit}</span>
                  </td>
                  <td className="text-right">
                    <span className={`text-sm font-mono ${p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-amber-400" : "text-white/70"}`}>
                      {p.stock} {p.baseUnit}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${p.stock === 0 ? "badge-danger" : p.stock < 5 ? "badge-warning" : "badge-success"}`}>
                      {p.stock === 0 ? "Out of Stock" : p.stock < 5 ? "Low Stock" : "Available"}
                    </span>
                  </td>
                  <td>
                    <Link href="/seller/new-order">
                      <button disabled={p.stock === 0} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${p.stock === 0 ? "glass text-white/20 cursor-not-allowed" : "btn-primary"}`}>
                        Order
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white/40 text-sm">No products match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
