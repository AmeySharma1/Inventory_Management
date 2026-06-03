"use client";

import { useState } from "react";

const demoQuotations = [
  {
    id: "QUO-2024-042",
    seller: "Rajesh Kumar",
    email: "rajesh@chemco.in",
    date: "3 Jun 2026, 10:15 AM",
    status: "pending",
    total: 12500,
    items: [
      { product: "Sodium Chloride", orderedQty: 25, orderedUnit: "kg", baseUnit: "kg", unitPrice: 500, convFactor: 1, total: 12500 },
    ],
  },
  {
    id: "QUO-2024-041",
    seller: "Priya Sharma",
    email: "priya@biopharma.in",
    date: "3 Jun 2026, 9:00 AM",
    status: "approved",
    total: 4500,
    items: [
      { product: "Ethanol 99%", orderedQty: 2500, orderedUnit: "mL", baseUnit: "L", unitPrice: 900, convFactor: 0.001, total: 2250 },
      { product: "Acetone", orderedQty: 2, orderedUnit: "L", baseUnit: "L", unitPrice: 420, convFactor: 1, total: 840 },
      { product: "Glucose Powder", orderedQty: 2000, orderedUnit: "g", baseUnit: "kg", unitPrice: 520, convFactor: 0.001, total: 1040 },
    ],
  },
  {
    id: "QUO-2024-040",
    seller: "Amit Patel",
    email: "amit@labsupply.in",
    date: "2 Jun 2026, 4:30 PM",
    status: "rejected",
    total: 8200,
    items: [
      { product: "Hydrochloric Acid", orderedQty: 5, orderedUnit: "L", baseUnit: "L", unitPrice: 1200, convFactor: 1, total: 6000 },
      { product: "Sodium Hydroxide", orderedQty: 2750, orderedUnit: "g", baseUnit: "kg", unitPrice: 800, convFactor: 0.001, total: 2200 },
    ],
  },
  {
    id: "QUO-2024-039",
    seller: "Sunita Rao",
    email: "sunita@medlabs.in",
    date: "2 Jun 2026, 11:00 AM",
    status: "pending",
    total: 6760,
    items: [
      { product: "Copper Sulfate", orderedQty: 500, orderedUnit: "g", baseUnit: "g", unitPrice: 1.8, convFactor: 1, total: 900 },
      { product: "Glucose Powder", orderedQty: 11, orderedUnit: "kg", baseUnit: "kg", unitPrice: 520, convFactor: 1, total: 5720 },
      { product: "Methanol", orderedQty: 360, orderedUnit: "mL", baseUnit: "L", unitPrice: 380, convFactor: 0.001, total: 136.8 },
    ],
  },
];

const statusConfig = {
  pending: { label: "Pending", cls: "badge-warning" },
  approved: { label: "Approved", cls: "badge-success" },
  rejected: { label: "Rejected", cls: "badge-danger" },
};

export default function AdminQuotations() {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = demoQuotations.filter(
    (q) => statusFilter === "All" || q.status === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quotations</h1>
          <p className="text-white/40 text-sm mt-1">
            {demoQuotations.filter((q) => q.status === "pending").length} awaiting your review
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {["All", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
              statusFilter === s ? "btn-primary" : "text-white/45 hover:text-white/70"
            }`}
          >
            {s}
            {s !== "All" && (
              <span className="ml-1.5 opacity-60">
                ({demoQuotations.filter((q) => q.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Quotation list */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelected(q)}
              className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                selected?.id === q.id ? "border-purple-500/50 bg-purple-500/10" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <code className="text-xs text-purple-300 font-mono">{q.id}</code>
                  <p className="text-sm font-semibold text-white mt-0.5">{q.seller}</p>
                  <p className="text-xs text-white/40">{q.email}</p>
                </div>
                <span className={`badge ${statusConfig[q.status].cls}`}>
                  {statusConfig[q.status].label}
                </span>
              </div>

              <div className="glass-divider my-3" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">{q.items.length} item{q.items.length > 1 ? "s" : ""}</p>
                  <p className="text-xs text-white/30 mt-0.5">{q.date}</p>
                </div>
                <p className="text-sm font-bold text-emerald-400">
                  ₹{q.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-white/40 text-sm">No quotations found</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-3">
          {selected ? (
            <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
              {/* Detail header */}
              <div className="p-5 border-b border-white/8">
                <div className="flex items-start justify-between">
                  <div>
                    <code className="text-xs text-purple-300 font-mono">{selected.id}</code>
                    <h3 className="text-lg font-bold text-white mt-1">{selected.seller}</h3>
                    <p className="text-sm text-white/40">{selected.email} · {selected.date}</p>
                  </div>
                  <span className={`badge ${statusConfig[selected.status].cls} text-sm px-3 py-1.5`}>
                    {statusConfig[selected.status].label}
                  </span>
                </div>
              </div>

              {/* Line items */}
              <div className="p-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Order Line Items
                </p>

                <div className="space-y-3 mb-5">
                  {selected.items.map((item, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-sm">⚗️</div>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.product}</p>
                            <p className="text-xs text-white/40">Base unit: {item.baseUnit}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-emerald-400">
                          ₹{item.total.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Conversion breakdown */}
                      <div className="glass rounded-xl p-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Ordered quantity</span>
                          <span className="text-white font-mono font-semibold">
                            {item.orderedQty} {item.orderedUnit}
                          </span>
                        </div>
                        {item.orderedUnit !== item.baseUnit && (
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">
                              Converted ({item.orderedUnit} → {item.baseUnit})
                            </span>
                            <span className="text-cyan-300 font-mono font-semibold">
                              {(item.orderedQty * item.convFactor).toFixed(6).replace(/\.?0+$/, "")} {item.baseUnit}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Unit price</span>
                          <span className="text-white font-mono">
                            ₹{item.unitPrice.toLocaleString("en-IN")}/{item.baseUnit}
                          </span>
                        </div>
                        <div className="glass-divider" />
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50 font-semibold">Subtotal</span>
                          <span className="text-emerald-400 font-semibold">
                            ₹{item.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Total Amount</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ₹{selected.total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Actions */}
                {selected.status === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 btn-danger py-2.5 rounded-xl text-sm font-semibold">
                      Reject
                    </button>
                    <button className="flex-1 btn-success py-2.5 rounded-xl text-sm font-semibold">
                      Approve Quotation
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl flex flex-col items-center justify-center p-16 h-full min-h-64">
              <p className="text-4xl mb-4 animate-float">📋</p>
              <p className="text-white/50 font-medium">Select a quotation to view details</p>
              <p className="text-white/25 text-sm mt-1">Click any quotation from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
