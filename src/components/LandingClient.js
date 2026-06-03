"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  {
    key: "admin",
    emoji: "🛡️",
    label: "Admin",
    tagline: "System Administrator",
    description: "Full control over inventory, users, orders and system configuration.",
    features: ["Manage products & stock", "Approve quotations", "Manage all users", "Full analytics access"],
    color: "#7c3aed",
    gradient: "from-purple-600/25 to-purple-900/10",
    border: "border-purple-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(124,58,237,0.25)]",
    activeBorder: "border-purple-500/70",
    btnClass: "btn-primary",
  },
  {
    key: "seller",
    emoji: "🧑‍💼",
    label: "Seller",
    tagline: "Sales Representative",
    description: "Browse the catalog, place quotations and track your orders in real time.",
    features: ["Browse full catalog", "Place quotations in any unit", "Track order status", "View purchase history"],
    color: "#06b6d4",
    gradient: "from-cyan-600/25 to-cyan-900/10",
    border: "border-cyan-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    activeBorder: "border-cyan-500/70",
    btnClass: "btn-cyan",
  },
  {
    key: "buyer",
    emoji: "🛒",
    label: "Buyer",
    tagline: "Purchasing Agent",
    description: "Request price quotes, place orders and monitor delivery status.",
    features: ["Search & filter products", "Request price quotations", "Place direct orders", "Track delivery status"],
    color: "#10b981",
    gradient: "from-emerald-600/25 to-emerald-900/10",
    border: "border-emerald-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    activeBorder: "border-emerald-500/70",
    btnClass: "btn-success",
  },
];

export default function LandingClient() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleContinue = (action) => {
    if (!selected) return;
    router.push(`/auth/${selected}/${action}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center glow-purple animate-float">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 7l10 5m0 0l10-5m-10 5v10" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold gradient-text">ChemStock</span>
            <p className="text-white/30 text-xs">by AasaMedChem</p>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Who are you?
        </h1>
        <p className="text-white/45 text-lg max-w-md mx-auto leading-relaxed">
          Select your role to access the right portal for you.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-10">
        {ROLES.map((role, i) => {
          const isSelected = selected === role.key;
          return (
            <button
              key={role.key}
              onClick={() => setSelected(isSelected ? null : role.key)}
              onMouseEnter={() => setHoveredRole(role.key)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`
                relative text-left rounded-2xl p-6 transition-all duration-300 cursor-pointer
                glass-card bg-gradient-to-br ${role.gradient}
                border ${isSelected ? role.activeBorder : role.border}
                ${role.glow}
                ${isSelected ? "scale-[1.02] -translate-y-1" : ""}
                animate-fade-in-up
              `}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: role.color }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300"
                style={{
                  background: `${role.color}18`,
                  border: `1px solid ${role.color}30`,
                  transform: isSelected || hoveredRole === role.key ? "scale(1.1)" : "scale(1)",
                }}
              >
                {role.emoji}
              </div>

              {/* Text */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{role.label}</h3>
                <p className="text-xs font-medium mt-0.5" style={{ color: role.color }}>{role.tagline}</p>
                <p className="text-white/45 text-sm mt-2 leading-relaxed">{role.description}</p>
              </div>

              {/* Feature list */}
              <ul className="space-y-1.5">
                {role.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: role.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Select pill */}
              <div
                className="mt-5 w-full py-2 rounded-xl text-xs font-semibold text-center transition-all duration-300"
                style={{
                  background: isSelected ? role.color : `${role.color}15`,
                  color: isSelected ? "white" : role.color,
                  border: `1px solid ${role.color}${isSelected ? "00" : "30"}`,
                }}
              >
                {isSelected ? "✓ Selected" : `Select ${role.label}`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action buttons — appear when a role is selected */}
      <div
        className={`transition-all duration-500 ${
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {selected && (() => {
          const r = ROLES.find((x) => x.key === selected);
          return (
            <div className="glass-strong rounded-2xl p-6 text-center w-full max-w-sm">
              <p className="text-white/50 text-sm mb-4">
                Continue as <span className="text-white font-semibold">{r.emoji} {r.label}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleContinue("sign-in")}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${r.color}dd, ${r.color}aa)`,
                    border: `1px solid ${r.color}50`,
                    color: "white",
                    boxShadow: `0 4px 20px ${r.color}30`,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleContinue("sign-up")}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold btn-secondary transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      <p className="text-white/20 text-xs mt-8">AasaMedChem Inventory System · ChemStock v1.0</p>
    </div>
  );
}
