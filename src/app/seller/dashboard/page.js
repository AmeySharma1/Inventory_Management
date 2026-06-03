"use client";

const sellerStats = [
  {
    label: "Total Orders",
    value: "18",
    change: "+3 this week",
    positive: true,
    icon: "🛒",
    accent: "#7c3aed",
    bg: "from-purple-500/20 to-purple-900/10",
  },
  {
    label: "Pending Quotations",
    value: "3",
    change: "Awaiting approval",
    positive: null,
    icon: "📋",
    accent: "#f59e0b",
    bg: "from-amber-500/20 to-amber-900/10",
  },
  {
    label: "Total Spent (INR)",
    value: "₹87,400",
    change: "This month",
    positive: true,
    icon: "💰",
    accent: "#10b981",
    bg: "from-emerald-500/20 to-emerald-900/10",
  },
  {
    label: "Products Ordered",
    value: "24",
    change: "Unique products",
    positive: true,
    icon: "⚗️",
    accent: "#06b6d4",
    bg: "from-cyan-500/20 to-cyan-900/10",
  },
];

const recentOrders = [
  { id: "QUO-2024-042", product: "Sodium Chloride", qty: "25 kg", total: "₹12,500", status: "pending", date: "Today, 10:15 AM" },
  { id: "QUO-2024-038", product: "Ethanol 99%", qty: "2.5 L", total: "₹2,250", status: "approved", date: "Yesterday" },
  { id: "QUO-2024-035", product: "Glucose Powder", qty: "10 kg", total: "₹5,200", status: "shipped", date: "1 Jun 2026" },
  { id: "ORD-2024-030", product: "Acetone", qty: "1 L", total: "₹420", status: "delivered", date: "30 May 2026" },
];

const statusConfig = {
  pending: { label: "Pending", cls: "badge-warning" },
  approved: { label: "Approved", cls: "badge-success" },
  shipped: { label: "Shipped", cls: "badge-cyan" },
  delivered: { label: "Delivered", cls: "badge-purple" },
  rejected: { label: "Rejected", cls: "badge-danger" },
};

export default function SellerDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Wednesday, 3 June 2026 · Welcome back, Seller</p>
        </div>
        <a href="/seller/new-order">
          <button className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            New Order
          </button>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sellerStats.map((s, i) => (
          <div key={i} className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${s.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${s.accent}22`, border: `1px solid ${s.accent}33` }}
              >
                {s.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                s.positive === true ? "bg-emerald-500/15 text-emerald-400" :
                s.positive === false ? "bg-red-500/15 text-red-400" :
                "bg-amber-500/15 text-amber-400"
              }`}>
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-white/45 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders table */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <h3 className="text-sm font-semibold text-white">Recent Quotations & Orders</h3>
            <a href="/seller/quotations" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full glass-table">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Product</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="cursor-pointer">
                    <td>
                      <span className="font-mono text-purple-300 text-xs">{o.id}</span>
                      <span className="block text-white/30 text-[11px]">{o.date}</span>
                    </td>
                    <td className="text-sm">{o.product}</td>
                    <td className="text-right text-sm font-mono">{o.qty}</td>
                    <td className="text-right text-sm font-semibold text-emerald-400">{o.total}</td>
                    <td className="text-center">
                      <span className={`badge ${statusConfig[o.status].cls}`}>{statusConfig[o.status].label}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>

          {[
            { label: "Browse Catalog", desc: "Search & filter 248 products", icon: "🔍", href: "/seller/catalog", accent: "#7c3aed" },
            { label: "Place New Order", desc: "Select products & quantities", icon: "🛒", href: "/seller/new-order", accent: "#06b6d4" },
            { label: "My Quotations", desc: "Track order status", icon: "📋", href: "/seller/quotations", accent: "#f59e0b" },
            { label: "Order History", desc: "View past transactions", icon: "📊", href: "/seller/orders", accent: "#10b981" },
          ].map((action, i) => (
            <a key={i} href={action.href}>
              <div className="glass-card rounded-xl p-4 cursor-pointer group flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${action.accent}18` }}
                >
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="text-xs text-white/35">{action.desc}</p>
                </div>
                <svg className="text-white/20 group-hover:text-white/50 transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
