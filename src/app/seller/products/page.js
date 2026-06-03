"use client";

import { useState, useEffect } from "react";

const CATEGORIES = ["Acids", "Bases", "Solvents", "Salts", "Indicators", "Reagents", "Sugars", "Other"];
const UNITS = ["g", "kg", "mL", "L", "unit"];

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category_id: "",
    base_unit: "kg",
    base_price: "",
    stock_quantity: "",
    low_stock_threshold: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        // Filter for seller's own products
        const sellerProducts = data.products.filter(p => p.seller_id !== null);
        setProducts(sellerProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.sku || !formData.base_price) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          base_price: parseFloat(formData.base_price),
          stock_quantity: parseFloat(formData.stock_quantity) || 0,
          low_stock_threshold: parseFloat(formData.low_stock_threshold) || 0,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Product added successfully!");
        setFormData({
          name: "",
          sku: "",
          description: "",
          category_id: "",
          base_unit: "kg",
          base_price: "",
          stock_quantity: "",
          low_stock_threshold: "",
        });
        setShowForm(false);
        fetchProducts();
      } else {
        setError(data.error || "Failed to add product");
      }
    } catch (err) {
      setError("Error adding product");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Products</h1>
          <p className="text-white/40 text-sm mt-1">Manage and add products to your catalog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all font-medium text-sm"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Add New Product</h2>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sodium Chloride"
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., NaCl-001"
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product details..."
                className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={CATEGORIES.indexOf(cat) + 1}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Unit *</label>
                <select
                  value={formData.base_unit}
                  onChange={(e) => setFormData({ ...formData, base_unit: e.target.value })}
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                  required
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="0.00"
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  placeholder="0"
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Low Stock Alert</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  placeholder="0"
                  className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all font-medium"
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="text-center py-8 text-white/40">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white/40">No products yet. Add your first product to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="glass-strong rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-white/60">{product.sku}</p>
                {product.description && <p className="text-xs text-white/40 mt-1">{product.description}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">₹{parseFloat(product.base_price).toFixed(2)}</p>
                <p className="text-xs text-white/60">{product.stock_quantity} {product.base_unit} in stock</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
