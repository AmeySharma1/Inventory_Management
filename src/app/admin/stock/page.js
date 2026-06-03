"use client";

const stockItems = [
  { name: "Sodium Chloride", sku: "NaCl-001", baseUnit: "kg", current: 150, threshold: 20, max: 200, emoji: "🧂" },
  { name: "Ethanol 99%", sku: "ETOH-001", baseUnit: "L", current: 45, threshold: 10, max: 100, emoji: "🧪" },
  { name: "Hydrochloric Acid", sku: "HCl-001", baseUnit: "L", current: 0.8, threshold: 2, max: 20, emoji: "⚗️" },
  { name: "Sodium Hydroxide", sku: "NaOH-001", baseUnit: "kg", current: 2.3, threshold: 5, max: 50, emoji: "🔬" },
  { name: "Glucose Powder", sku: "GLU-001", baseUnit: "kg", current: 80, threshold: 15, max: 150, emoji: "🍬" },
  { name: "Acetone", sku: "ACE-001", baseUnit: "L", current: 12, threshold: 5, max: 50, emoji: "💧" },
  { name: "Copper Sulfate", sku: "CuSO4-001", baseUnit: "g", current: 300, threshold: 500, max: 2000, emoji: "🔷" },
  { name: "Potassium Permanganate", sku: "KMnO4-001", baseUnit: "g", current: 120, threshold: 500, max: 2000, emoji: "🟣" },
  { name: "Methanol", sku: "METH-001", baseUnit: "L", current: 0, threshold: 5, max: 40, emoji: "🔴" },
  { name: "Distilled Water", sku: "H2O-001", baseUnit: "L", current: 200, threshold: 50, max: 500, emoji: "💦" },
];

export default function StockPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Stock Levels</h1>
        <p className="text-white/40 text-sm mt-1">Real-time inventory tracking</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "In Stock", count: stockItems.filter((i) => i.current > i.threshold).length, cls: "badge-success", accent: "#10b981" },
          { label: "Low Stock", count: stockItems.filter((i) => i.current > 0 && i.current <= i.threshold).length, cls: "badge-warning", accent: "#f59e0b" },
          { label: "Out of Stock", count: stockItems.filter((i) => i.current === 0).length, cls: "badge-danger", accent: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center" style={{ borderColor: `${s.accent}22` }}>
            <p className="text-2xl font-bold text-white">{s.count}</p>
            <span className={`badge ${s.cls} mt-1`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Stock table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full glass-table">
          <thead>
            <tr>
              <th className="text-left">Product</th>
              <th className="text-right">Current</th>
              <th className="text-right">Threshold</th>
              <th className="text-right">Max</th>
              <th className="text-left" style={{ minWidth: 160 }}>Level</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item) => {
              const pct = Math.min((item.current / item.max) * 100, 100);
              const isOut = item.current === 0;
              const isLow = !isOut && item.current <= item.threshold;
              const color = isOut ? "#ef4444" : isLow ? "#f59e0b" : "#10b981";
              return (
                <tr key={item.sku}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.emoji}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <code className="text-[10px] text-purple-300 font-mono">{item.sku}</code>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono text-sm" style={{ color }}>
                    {item.current} {item.baseUnit}
                  </td>
                  <td className="text-right font-mono text-sm text-white/40">
                    {item.threshold} {item.baseUnit}
                  </td>
                  <td className="text-right font-mono text-sm text-white/30">
                    {item.max} {item.baseUnit}
                  </td>
                  <td>
                    <div className="progress-bar w-36">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/30 mt-1 block">{pct.toFixed(0)}%</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${isOut ? "badge-danger" : isLow ? "badge-warning" : "badge-success"}`}>
                      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
