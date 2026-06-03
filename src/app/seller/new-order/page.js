"use client";

import { useState, useMemo } from "react";

// Unit conversion factors — everything normalised to base unit
const UNIT_CONVERSIONS = {
  g: { baseUnit: "g", toBase: 1 },
  kg: { baseUnit: "g", toBase: 1000 },
  mL: { baseUnit: "mL", toBase: 1 },
  L: { baseUnit: "mL", toBase: 1000 },
  unit: { baseUnit: "unit", toBase: 1 },
};

// Compatible order units per stored base unit
const COMPATIBLE_UNITS = {
  g: ["g", "kg"],
  kg: ["g", "kg"],
  mL: ["mL", "L"],
  L: ["mL", "L"],
  unit: ["unit"],
};

const catalog = [
  { id: 1, name: "Sodium Chloride", sku: "NaCl-001", category: "Salts", baseUnit: "kg", pricePerBase: 500, stock: 150, emoji: "🧂" },
  { id: 2, name: "Ethanol 99%", sku: "ETOH-001", category: "Solvents", baseUnit: "L", pricePerBase: 900, stock: 45, emoji: "🧪" },
  { id: 3, name: "Hydrochloric Acid", sku: "HCl-001", category: "Acids", baseUnit: "L", pricePerBase: 1200, stock: 0.8, emoji: "⚗️" },
  { id: 4, name: "Sodium Hydroxide", sku: "NaOH-001", category: "Bases", baseUnit: "kg", pricePerBase: 800, stock: 2.3, emoji: "🔬" },
  { id: 5, name: "Glucose Powder", sku: "GLU-001", category: "Sugars", baseUnit: "kg", pricePerBase: 520, stock: 80, emoji: "🍬" },
  { id: 6, name: "Acetone", sku: "ACE-001", category: "Solvents", baseUnit: "L", pricePerBase: 420, stock: 12, emoji: "💧" },
  { id: 7, name: "Copper Sulfate", sku: "CuSO4-001", category: "Salts", baseUnit: "g", pricePerBase: 1.8, stock: 300, emoji: "🔷" },
  { id: 8, name: "Potassium Permanganate", sku: "KMnO4-001", category: "Reagents", baseUnit: "g", pricePerBase: 2.5, stock: 120, emoji: "🟣" },
  { id: 9, name: "Methyl Orange Indicator", sku: "MO-001", category: "Indicators", baseUnit: "g", pricePerBase: 15, stock: 50, emoji: "🟠" },
  { id: 10, name: "Distilled Water", sku: "H2O-001", category: "Solvents", baseUnit: "L", pricePerBase: 50, stock: 200, emoji: "💦" },
];

function convertToBase(qty, fromUnit) {
  const factor = UNIT_CONVERSIONS[fromUnit]?.toBase ?? 1;
  return qty * factor;
}

function getUnitPrice(product, orderUnit) {
  // price is stored per baseUnit; convert to per orderUnit
  const baseConv = UNIT_CONVERSIONS[product.baseUnit]?.toBase ?? 1;
  const orderConv = UNIT_CONVERSIONS[orderUnit]?.toBase ?? 1;
  // pricePerBase is ₹ per 1 baseUnit
  // price per orderUnit = pricePerBase * (orderConv / baseConv)
  return product.pricePerBase * (orderConv / baseConv);
}

export default function NewOrderPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // { product, qty, unit }
  const [step, setStep] = useState("catalog"); // catalog | review | confirm
  const [note, setNote] = useState("");

  const filteredCatalog = useMemo(
    () =>
      catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const addToCart = (product) => {
    if (cart.find((c) => c.product.id === product.id)) return;
    setCart((prev) => [
      ...prev,
      { product, qty: "", unit: COMPATIBLE_UNITS[product.baseUnit][0] },
    ]);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.product.id !== id));

  const updateCart = (id, field, value) => {
    setCart((prev) =>
      prev.map((c) => (c.product.id === id ? { ...c, [field]: value } : c))
    );
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const qty = parseFloat(item.qty) || 0;
        if (!qty) return sum;
        const pricePerOrderUnit = getUnitPrice(item.product, item.unit);
        return sum + qty * pricePerOrderUnit;
      }, 0),
    [cart]
  );

  const cartIsValid = cart.length > 0 && cart.every((c) => parseFloat(c.qty) > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">New Order</h1>
          <p className="text-white/40 text-sm mt-1">Search products, set quantities, and place a quotation</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2">
          {["catalog", "review", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  step === s
                    ? "btn-primary glow-purple"
                    : i < ["catalog", "review", "confirm"].indexOf(step)
                    ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                    : "glass text-white/30"
                }`}
              >
                {i < ["catalog", "review", "confirm"].indexOf(step) ? "✓" : i + 1}
              </div>
              <span className={`text-xs capitalize hidden sm:block ${step === s ? "text-white" : "text-white/30"}`}>
                {s}
              </span>
              {i < 2 && <div className="w-6 h-px bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      {step === "catalog" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Product catalog */}
          <div className="xl:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full pl-9 pr-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCatalog.map((p) => {
                const inCart = !!cart.find((c) => c.product.id === p.id);
                return (
                  <div
                    key={p.id}
                    className={`glass-card rounded-xl p-4 transition-all ${
                      inCart ? "border-purple-500/40 bg-purple-500/08" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-lg">
                          {p.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{p.name}</p>
                          <code className="text-[10px] text-purple-300 font-mono">{p.sku}</code>
                        </div>
                      </div>
                      <span className="badge badge-cyan text-[10px]">{p.category}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-emerald-400">
                          ₹{p.pricePerBase.toLocaleString("en-IN")}
                          <span className="text-white/30 text-xs font-normal">/{p.baseUnit}</span>
                        </p>
                        <p className={`text-xs mt-0.5 ${p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-amber-400" : "text-white/40"}`}>
                          Stock: {p.stock} {p.baseUnit}
                        </p>
                      </div>

                      <button
                        onClick={() => (inCart ? removeFromCart(p.id) : addToCart(p))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          inCart
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                            : p.stock === 0
                            ? "glass text-white/20 cursor-not-allowed"
                            : "btn-primary"
                        }`}
                        disabled={p.stock === 0 && !inCart}
                      >
                        {inCart ? "✓ Added" : p.stock === 0 ? "Out of stock" : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart sidebar */}
          <div className="glass rounded-2xl overflow-hidden h-fit sticky top-6">
            <div className="flex items-center justify-between p-4 border-b border-white/8">
              <h3 className="text-sm font-semibold text-white">Order Cart</h3>
              <span className="badge badge-purple">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">🛒</p>
                <p className="text-white/35 text-xs">Add products from the catalog</p>
              </div>
            ) : (
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cart.map((item) => {
                  const qty = parseFloat(item.qty) || 0;
                  const pricePerUnit = getUnitPrice(item.product, item.unit);
                  const lineTotal = qty * pricePerUnit;

                  return (
                    <div key={item.product.id} className="glass-card rounded-xl p-3">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-semibold text-white leading-tight flex-1 pr-2">
                          {item.product.name}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-white/25 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>

                      <div className="flex gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.qty}
                          min="0"
                          step="any"
                          onChange={(e) => updateCart(item.product.id, "qty", e.target.value)}
                          className="glass-input flex-1 px-2 py-1.5 rounded-lg text-xs"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => updateCart(item.product.id, "unit", e.target.value)}
                          className="glass-input px-2 py-1.5 rounded-lg text-xs w-16"
                        >
                          {COMPATIBLE_UNITS[item.product.baseUnit].map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>

                      {qty > 0 && (
                        <div className="text-[10px] space-y-0.5">
                          <div className="flex justify-between text-white/35">
                            <span>₹{pricePerUnit.toFixed(4)}/{item.unit}</span>
                            <span className="text-emerald-400 font-semibold">
                              ₹{lineTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          {item.unit !== item.product.baseUnit && (
                            <p className="text-cyan-400/60">
                              = {convertToBase(qty, item.unit)} {item.product.baseUnit}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {cart.length > 0 && (
              <div className="p-4 border-t border-white/8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Estimated Total</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{cartTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={() => setStep("review")}
                  disabled={!cartIsValid}
                  className="w-full btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Review Order →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/8">
              <h3 className="text-base font-bold text-white">Review Your Order</h3>
              <p className="text-white/40 text-sm mt-0.5">Verify quantities, units, and pricing before placing</p>
            </div>

            <div className="p-5 space-y-3">
              {cart.map((item) => {
                const qty = parseFloat(item.qty);
                const pricePerUnit = getUnitPrice(item.product, item.unit);
                const lineTotal = qty * pricePerUnit;
                const baseQty = convertToBase(qty, item.unit);

                return (
                  <div key={item.product.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{item.product.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.product.name}</p>
                        <code className="text-[10px] text-purple-300 font-mono">{item.product.sku}</code>
                      </div>
                    </div>
                    <div className="glass rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">Ordered</span>
                        <span className="text-white font-mono">{qty} {item.unit}</span>
                      </div>
                      {item.unit !== item.product.baseUnit && (
                        <div className="flex justify-between">
                          <span className="text-white/40">Converted to base</span>
                          <span className="text-cyan-300 font-mono">{baseQty} {item.product.baseUnit}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/40">Rate</span>
                        <span className="text-white font-mono">
                          ₹{item.product.pricePerBase}/{item.product.baseUnit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Price per {item.unit}</span>
                        <span className="text-white font-mono">₹{pricePerUnit.toFixed(6).replace(/\.?0+$/, "")}</span>
                      </div>
                      <div className="glass-divider" />
                      <div className="flex justify-between font-semibold">
                        <span className="text-white/60">Subtotal</span>
                        <span className="text-emerald-400">
                          ₹{lineTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div className="px-5 pb-5">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Order Notes (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions or requirements..."
                rows={2}
                className="glass-input w-full px-3 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            {/* Total */}
            <div className="px-5 pb-5">
              <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Grand Total</span>
                <span className="text-xl font-bold text-emerald-400">
                  ₹{cartTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => setStep("catalog")} className="flex-1 btn-secondary py-3 rounded-xl text-sm">
                ← Back
              </button>
              <button onClick={() => setStep("confirm")} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">
                Place Quotation →
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="max-w-md mx-auto animate-fade-in-up">
          <div className="glass-strong rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-float">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Quotation Placed!</h2>
            <p className="text-white/50 text-sm mb-1">Your quotation has been submitted</p>
            <code className="text-purple-300 font-mono text-sm">QUO-2024-043</code>

            <div className="glass rounded-xl p-4 mt-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Items</span>
                <span className="text-white">{cart.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Total</span>
                <span className="text-emerald-400 font-semibold">
                  ₹{cartTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Status</span>
                <span className="badge badge-warning">Pending Approval</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a href="/seller/quotations" className="flex-1">
                <button className="w-full btn-secondary py-3 rounded-xl text-sm">
                  View Quotations
                </button>
              </a>
              <button
                onClick={() => { setCart([]); setStep("catalog"); setNote(""); }}
                className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
