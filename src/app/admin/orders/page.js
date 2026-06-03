"use client";

import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders?status=");
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
    draft: { label: "Draft", color: "#6366f1" },
    pending: { label: "Pending", color: "#f59e0b" },
    approved: { label: "Approved", color: "#10b981" },
    rejected: { label: "Rejected", color: "#ef4444" },
    shipped: { label: "Shipped", color: "#06b6d4" },
    delivered: { label: "Delivered", color: "#10b981" },
  };

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-white/40 text-sm mt-1">Monitor all orders from buyers</p>
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

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-8 text-white/40">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white/40">
            {filter ? `No ${filter} orders` : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Order Reference</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Buyer</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Items</th>
                  <th className="text-right py-4 px-4 text-white/60 font-semibold">Amount</th>
                  <th className="text-center py-4 px-4 text-white/60 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const config = statusConfig[order.status] || { label: "Unknown", color: "#6b7280" };
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-semibold text-white">{order.ref}</td>
                      <td className="py-4 px-4 text-white/80">{order.buyer_name || "—"}</td>
                      <td className="py-4 px-4 text-white/60">{order.item_count} item{order.item_count !== 1 ? "s" : ""}</td>
                      <td className="py-4 px-4 text-right text-white font-bold">
                        ₹{parseFloat(order.total_inr).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: `${config.color}22`, color: config.color }}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/60 text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="glass-strong w-full max-w-2xl rounded-2xl p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/40 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Order Reference</p>
                  <p className="text-white font-semibold">{selectedOrder.ref}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Order Date</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Items</p>
                  <p className="text-white font-semibold">{selectedOrder.item_count}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Amount</p>
                  <p className="text-emerald-400 font-bold text-lg">
                    ₹{parseFloat(selectedOrder.total_inr).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-1">Current Status</p>
                <div>
                  {(() => {
                    const config = statusConfig[selectedOrder.status] || { label: "Unknown", color: "#6b7280" };
                    return (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: `${config.color}22`, color: config.color }}
                      >
                        {config.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/60 text-sm mb-2">Notes</p>
                  <p className="text-white/80">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
