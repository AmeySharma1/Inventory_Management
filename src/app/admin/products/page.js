"use client";

import { useState, useEffect } from "react";

const CATEGORIES = ["All", "Acids", "Bases", "Solvents", "Salts", "Indicators", "Reagents", "Sugars", "Other"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "All" || p.category_name === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-white/40 text-sm mt-1">View all products from sellers</p>
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Search Products</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Product name, SKU, or seller..."
            className="glass-input w-full px-4 py-2 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-white/60">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8 text-white/40">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white/40">No products found</p>
        </div>
      ) : (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Product Name</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">SKU</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Category</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Seller</th>
                  <th className="text-right py-4 px-4 text-white/60 font-semibold">Price</th>
                  <th className="text-left py-4 px-4 text-white/60 font-semibold">Stock</th>
                  <th className="text-center py-4 px-4 text-white/60 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-white">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-white/40 mt-1 truncate">{product.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/60 font-mono text-xs">{product.sku}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">
                        {product.category_name || "Other"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/80">{product.seller_name || "Admin"}</td>
                    <td className="py-4 px-4 text-right text-white font-semibold">
                      ₹{parseFloat(product.base_price).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white">
                        {parseFloat(product.stock_quantity).toFixed(1)} {product.base_unit}
                      </p>
                      {product.low_stock_threshold > 0 && parseFloat(product.stock_quantity) < parseFloat(product.low_stock_threshold) && (
                        <p className="text-xs text-amber-400 mt-1">Low stock ⚠️</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: product.is_active ? "#10b9811a" : "#6b72801a",
                          color: product.is_active ? "#10b981" : "#9ca3af",
                        }}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
