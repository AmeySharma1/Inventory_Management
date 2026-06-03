"use client";

import { useState, useEffect } from "react";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    draft: { label: "Draft", cls: "badge-warning", color: "#f59e0b" },
    pending: { label: "Pending", cls: "badge-warning", color: "#f59e0b" },
    approved: { label: "Approved", cls: "badge-success", color: "#10b981" },
    rejected: { label: "Rejected", cls: "badge-error", color: "#ef4444" },
    shipped: { label: "Shipped", cls: "badge-cyan", color: "#06b6d4" },
    delivered: { label: "Delivered", cls: "badge-success", color: "#10b981" },
  };

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Orders</h1>
          <p className="text-white/40 text-sm mt-1">Track and manage your orders</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
            filter === ""
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          All Orders ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                filter === status
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8 text-white/40">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white/40">
            {filter ? `No ${filter} orders` : "You haven't placed any orders yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const config = statusConfig[order.status] || {};
            return (
              <div
                key={order.id}
                className="glass-strong rounded-xl p-4 hover:border-white/20 border border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{order.ref}</h3>
                    <p className="text-xs text-white/60">
                      {new Date(order.created_at).toLocaleDateString()} · {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                      style={{ background: `${config.color}22`, color: config.color }}
                    >
                      {config.label}
                    </div>
                    <p className="text-xl font-bold text-white">₹{parseFloat(order.total_inr).toFixed(0)}</p>
                  </div>
                </div>
                {order.notes && (
                  <p className="text-xs text-white/40 border-t border-white/10 pt-2">Notes: {order.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
