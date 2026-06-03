"use client";

export default function SellerOrders() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Order History</h1>
        <p className="text-white/40 text-sm mt-1">All completed and past orders</p>
      </div>
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-4xl mb-4 animate-float">📦</p>
        <p className="text-white/50 font-medium">Order history will appear here</p>
        <p className="text-white/25 text-sm mt-1">Once your quotations are fulfilled, they'll show up as completed orders</p>
      </div>
    </div>
  );
}
