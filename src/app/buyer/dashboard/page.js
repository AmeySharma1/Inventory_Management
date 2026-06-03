"use client";

const buyerStats = [
  { label: "Saved Quotations", value: "5", change: "2 new this week", icon: "📋", accent: "#7c3aed", bg: "from-purple-500/20 to-purple-900/10" },
  { label: "Approved Orders", value: "8", change: "3 completed", icon: "✅", accent: "#10b981", bg: "from-emerald-500/20 to-emerald-900/10" },
  { label: "Total Spent (INR)", value: "₹14,200", change: "This month", icon: "💰", accent: "#f59e0b", bg: "from-amber-500/20 to-amber-900/10" },
  { label: "Active Sellers", value: "12", change: "Browse catalog", icon: "⚗️", accent: "#06b6d4", bg: "from-cyan-500/20 to-cyan-900/10" },
];

const recentActivity = [
  { id: "QUO-2024-062", text: "Requested quotation for Hydrochloric Acid", date: "Today, 09:45" },
  { id: "ORD-2024-058", text: "Order approved for Distilled Water", date: "Yesterday" },
  { id: "QUO-2024-056", text: "Checked status for Ammonium Nitrate quote", date: "1 Jun 2026" },
];

export default function BuyerDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Buyer Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Welcome to your buyer portal. Your account is set up and ready.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {buyerStats.map((stat) => (
          <div key={stat.label} className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${stat.accent}22`, border: `1px solid ${stat.accent}33` }}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-white/10 text-white/75">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/45 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <a href="/buyer/dashboard" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Refresh
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full glass-table">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Activity</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="cursor-default">
                    <td>
                      <span className="font-mono text-purple-300 text-xs">{item.id}</span>
                    </td>
                    <td className="text-sm">{item.text}</td>
                    <td className="text-right text-sm text-white/60">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Quick Start</h3>
          <p className="text-sm text-white/55">Your buyer portal is ready. Use your dashboard to monitor quotes and order status from sellers.</p>
          <div className="space-y-3">
            <a href="/sign-in" className="block btn-secondary text-center py-3 rounded-xl">Sign in again</a>
            <a href="/" className="block btn-primary text-center py-3 rounded-xl">Return to home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
