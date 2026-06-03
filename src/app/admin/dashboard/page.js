"use client";

import { useState, useEffect } from "react";

const dummyStats = [];

// No longer using dummy data - fetching real data from APIs


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersRes = await fetch("/api/orders?status=");
      const ordersData = await ordersRes.json();
      const allOrders = ordersData.orders || [];
      
      // Fetch products
      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      const allProducts = productsData.products || [];

      // Calculate stats
      const activeOrders = allOrders.filter(o => ["pending", "approved", "shipped"].includes(o.status)).length;
      const pendingOrders = allOrders.filter(o => o.status === "pending").length;
      const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total_inr || 0), 0);

      setStats({
        totalProducts: allProducts.length,
        activeOrders,
        pendingOrders,
        totalRevenue,
      });

      // Sort and limit orders for display
      setOrders(allOrders.slice(0, 10));
      setProducts(allProducts.slice(0, 8));
    } catch (err) {
      console.error("Error fetching data:", err);
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })} · System Overview
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-8 text-white/40">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-strong rounded-2xl p-5 bg-gradient-to-br from-purple-500/20 to-purple-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20">
                  <span className="text-purple-400">📦</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
              <p className="text-white/45 text-xs mt-1">Total Products</p>
            </div>

            <div className="glass-strong rounded-2xl p-5 bg-gradient-to-br from-cyan-500/20 to-cyan-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/20">
                  <span className="text-cyan-400">🛒</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.activeOrders}</p>
              <p className="text-white/45 text-xs mt-1">Active Orders</p>
            </div>

            <div className="glass-strong rounded-2xl p-5 bg-gradient-to-br from-amber-500/20 to-amber-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20">
                  <span className="text-amber-400">⏳</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
              <p className="text-white/45 text-xs mt-1">Pending Orders</p>
            </div>

            <div className="glass-strong rounded-2xl p-5 bg-gradient-to-br from-emerald-500/20 to-emerald-900/10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/20">
                  <span className="text-emerald-400">💰</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-white/45 text-xs mt-1">Total Revenue</p>
            </div>
          </div>

          {/* Orders Section */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <a href="/admin/orders" className="text-cyan-400 hover:text-cyan-300 text-sm">
                View All →
              </a>
            </div>

            {orders.length === 0 ? (
              <p className="text-white/40 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Order</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Buyer</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Items</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const config = statusConfig[order.status] || { label: "Unknown", color: "#6b7280" };
                      return (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{order.ref}</td>
                          <td className="py-3 px-4 text-white/80">{order.buyer_name || "—"}</td>
                          <td className="py-3 px-4 text-white/60">{order.item_count}</td>
                          <td className="py-3 px-4 text-white font-semibold">
                            ₹{parseFloat(order.total_inr).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ background: `${config.color}22`, color: config.color }}
                            >
                              {config.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white/60 text-xs">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Latest Products from Sellers</h2>
              <a href="/admin/products" className="text-cyan-400 hover:text-cyan-300 text-sm">
                View All →
              </a>
            </div>

            {products.length === 0 ? (
              <p className="text-white/40 text-center py-8">No products yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="glass rounded-lg p-3 hover:border-white/20 border border-white/10 transition-all">
                    <h3 className="font-semibold text-white text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-white/60 truncate">{product.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-white/60">{product.seller_name}</p>
                      <p className="text-emerald-400 font-semibold text-xs">₹{parseFloat(product.base_price).toFixed(0)}</p>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{product.stock_quantity} {product.base_unit}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
