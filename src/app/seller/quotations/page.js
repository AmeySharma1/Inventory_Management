"use client";

const myQuotations = [
  { id: "QUO-2024-042", date: "3 Jun 2026, 10:15 AM", items: 1, total: 12500, status: "pending" },
  { id: "QUO-2024-038", date: "2 Jun 2026, 09:00 AM", items: 3, total: 4500, status: "approved" },
  { id: "QUO-2024-035", date: "1 Jun 2026, 03:30 PM", items: 1, total: 5200, status: "shipped" },
  { id: "QUO-2024-031", date: "30 May 2026, 11:00 AM", items: 2, total: 3800, status: "delivered" },
  { id: "QUO-2024-028", date: "28 May 2026, 02:15 PM", items: 1, total: 420, status: "rejected" },
];

const statusConfig = {
  pending:   { label: "Pending",   cls: "badge-warning", icon: "⏳" },
  approved:  { label: "Approved",  cls: "badge-success", icon: "✅" },
  shipped:   { label: "Shipped",   cls: "badge-cyan",    icon: "🚚" },
  delivered: { label: "Delivered", cls: "badge-purple",  icon: "📦" },
  rejected:  { label: "Rejected",  cls: "badge-danger",  icon: "❌" },
};

export default function SellerQuotations() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">My Quotations</h1>
        <p className="text-white/40 text-sm mt-1">{myQuotations.length} quotations placed</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full glass-table">
          <thead>
            <tr>
              <th className="text-left">Quotation ID</th>
              <th className="text-left">Date</th>
              <th className="text-center">Items</th>
              <th className="text-right">Total (INR)</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {myQuotations.map((q) => (
              <tr key={q.id} className="cursor-pointer">
                <td>
                  <div className="flex items-center gap-2">
                    <span>{statusConfig[q.status].icon}</span>
                    <code className="text-xs text-purple-300 font-mono">{q.id}</code>
                  </div>
                </td>
                <td className="text-sm text-white/60">{q.date}</td>
                <td className="text-center">
                  <span className="badge badge-purple">{q.items} item{q.items > 1 ? "s" : ""}</span>
                </td>
                <td className="text-right font-semibold text-emerald-400 text-sm">
                  ₹{q.total.toLocaleString("en-IN")}
                </td>
                <td className="text-center">
                  <span className={`badge ${statusConfig[q.status].cls}`}>
                    {statusConfig[q.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
