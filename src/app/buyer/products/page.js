"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Acids", "Bases", "Solvents", "Salts", "Indicators", "Reagents", "Sugars", "Other"];

export default function BuyerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category_name === category;
      return matchSearch && matchCat && p.is_active;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1, unit: product.base_unit }]);
  };

  const updateCartItem = (index, field, value) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.base_price);
    }, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.id,
            ordered_qty: item.quantity,
            ordered_unit: item.unit,
          })),
          notes: "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Order placed successfully!");
        setCart([]);
        setShowCart(false);
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (err) {
      alert("Error placing order");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Browse Products</h1>
          <p className="text-white/40 text-sm mt-1">Discover and order from our sellers</p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium text-sm"
        >
          Cart ({cart.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-strong rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product name or SKU..."
                className="glass-input w-full px-3 py-2 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-white/60">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8 text-white/40">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="glass-strong rounded-xl p-8 text-center">
              <p className="text-white/40">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="glass-strong rounded-xl p-4 flex flex-col justify-between hover:border-white/20 border border-white/10 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        <p className="text-xs text-white/60">{product.sku}</p>
                      </div>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">
                        {product.category_name || "Other"}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-xs text-white/40 mb-3">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-white/60">Seller</p>
                        <p className="text-white font-medium">{product.seller_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60">Price</p>
                        <p className="text-lg font-bold text-emerald-400">
                          ₹{parseFloat(product.base_price).toFixed(2)}/{product.base_unit}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm font-medium border border-emerald-500/30"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-end">
          <div className="glass-strong w-full max-w-2xl rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-white/40 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-white/40 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="glass rounded-lg p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.name}</p>
                        <p className="text-xs text-white/60">{item.seller_name}</p>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => updateCartItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                        className="glass-input w-16 px-2 py-1 rounded text-xs text-center"
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => updateCartItem(idx, "unit", e.target.value)}
                        className="glass-input px-2 py-1 rounded text-xs"
                      >
                        <option value={item.base_unit}>{item.base_unit}</option>
                      </select>
                      <p className="text-white font-medium w-16 text-right">
                        ₹{(item.quantity * parseFloat(item.base_price)).toFixed(0)}
                      </p>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-red-400 hover:text-red-300 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <div className="flex items-center justify-between text-lg font-bold text-white mb-4">
                    <span>Total</span>
                    <span className="text-emerald-400">₹{calculateTotal().toFixed(0)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
