"use client";

import { useEffect, useState } from "react";

// ── Dummy data shown while DB is empty or loading fails ──────────────────────
const DUMMY_USERS = [
  {
    id: "d1", clerk_id: "dummy_1", email: "rajesh.kumar@chemco.in",
    name: "Rajesh Kumar", role: "seller", phone: "+91 98765 43210",
    company: "ChemCo Supplies", is_active: true,
    total_orders: 12, total_spent: 84500, created_at: "2026-01-15",
    _dummy: true,
  },
  {
    id: "d2", clerk_id: "dummy_2", email: "priya.sharma@biopharma.in",
    name: "Priya Sharma", role: "seller", phone: "+91 87654 32109",
    company: "BioPharma Labs", is_active: true,
    total_orders: 8, total_spent: 42300, created_at: "2026-02-10",
    _dummy: true,
  },
  {
    id: "d3", clerk_id: "dummy_3", email: "amit.patel@labsupply.in",
    name: "Amit Patel", role: "seller", phone: "+91 76543 21098",
    company: "Lab Supply Co.", is_active: true,
    total_orders: 5, total_spent: 19200, created_at: "2026-03-05",
    _dummy: true,
  },
];

const DUMMY_ORDERS = {
  d1: [
    { id: 1, ref: "QUO-2026-0012", status: "delivered", total_inr: 12500, item_count: 3, created_at: "2026-05-20" },
    { id: 2, ref: "QUO-2026-0009", status: "shipped",   total_inr: 8200,  item_count: 2, created_at: "2026-05-10" },
    { id: 3, ref: "QUO-2026-0006", status: "approved",  total_inr: 5600,  item_count: 1, created_at: "2026-04-28" },
  ],
  d2: [
    { id: 4, ref: "QUO-2026-0011", status: "pending",   total_inr: 7800,  item_count: 2, created_at: "2026-06-01" },
    { id: 5, ref: "QUO-2026-0007", status: "delivered", total_inr: 4500,  item_count: 1, created_at: "2026-05-15" },
  ],
  d3: [
    { id: 6, ref: "QUO-2026-0010", status: "approved",  total_inr: 3200,  item_count: 1, created_at: "2026-05-25" },
  ],
};

const ORDER_BADGE = {
  pending:   "badge-warning",
  approved:  "badge-success",
  rejected:  "badge-danger",
  shipped:   "badge-cyan",
  delivered: "badge-purple",
};

export default function UsersPage() {
  const [users, setUsers]         = useState(DUMMY_USERS);
  const [usingDummy, setUsingDummy] = useState(true);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [viewUser, setViewUser]   = useState(null);
  const [viewOrders, setViewOrders] = useState([]);
  const [editUser, setEditUser]   = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Fetch real users ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          setUsingDummy(false);
        }
        // If empty array — keep dummy so UI is never blank
      } catch {
        // Network error — keep dummy
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Open detail panel ─────────────────────────────────────────────────
  const openDetail = async (u) => {
    setViewUser(u);
    setViewOrders([]);
    if (u._dummy) {
      setViewOrders(DUMMY_ORDERS[u.id] ?? []);
      return;
    }
    try {
      const res  = await fetch(`/api/users/${u.id}`);
      const data = await res.json();
      if (res.ok) {
        setViewUser(data.user);
        setViewOrders(data.orders ?? []);
      }
    } catch {}
  };

  // ── Open edit modal ───────────────────────────────────────────────────
  const openEdit = (u) => {
    setEditUser(u);
    setSaveError("");
    setEditForm({
      name:      u.name      ?? "",
      role:      u.role      ?? "seller",
      phone:     u.phone     ?? "",
      company:   u.company   ?? "",
      is_active: u.is_active ?? true,
    });
  };

  // ── Save edits ────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (editUser?._dummy) {
      // For dummy users, just update local state
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
      if (viewUser?.id === editUser.id) setViewUser(v => ({ ...v, ...editForm }));
      setEditUser(null);
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const res  = await fetch(`/api/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...data.user } : u));
      if (viewUser?.id === editUser.id) setViewUser(v => ({ ...v, ...data.user }));
      setEditUser(null);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Deactivate ────────────────────────────────────────────────────────
  const deactivate = async (u) => {
    if (!confirm(`Deactivate ${u.name ?? u.email}?`)) return;
    if (u._dummy) {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: false } : x));
      return;
    }
    await fetch(`/api/users/${u.id}`, { method: "DELETE" });
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: false } : x));
  };

  // ── Filtered list ─────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const matchSearch =
      (u.name  ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const admins  = users.filter(u => u.role === "admin");
  const sellers = users.filter(u => u.role === "seller");
  const buyers  = users.filter(u => u.role === "seller" && (u.total_orders ?? 0) > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Users & Buyers</h1>
          <p className="text-white/40 text-sm mt-1">
            {users.length} total · {admins.length} admin · {sellers.length} seller · {buyers.length} with orders
            {usingDummy && <span className="ml-2 badge badge-warning">demo data</span>}
          </p>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",     value: users.length,   icon: "👥", accent: "#7c3aed" },
          { label: "Admins",          value: admins.length,  icon: "🛡️", accent: "#a78bfa" },
          { label: "Sellers",         value: sellers.length, icon: "🧑‍💼", accent: "#06b6d4" },
          { label: "Active Buyers",   value: buyers.length,  icon: "🛒", accent: "#10b981" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className="text-2xl font-bold text-white">{s.value}</span>
            </div>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search name, email, or company…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
        </div>
        <div className="flex gap-1 p-1 glass rounded-xl">
          {["All", "admin", "seller"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                roleFilter === r ? "btn-primary" : "text-white/40 hover:text-white/70"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Users table */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-sm">Loading users…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full glass-table">
                <thead>
                  <tr>
                    <th className="text-left">User</th>
                    <th className="text-left">Role</th>
                    <th className="text-right">Orders</th>
                    <th className="text-right">Total Spent</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="cursor-pointer" onClick={() => openDetail(u)}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            u.role === "admin"
                              ? "bg-purple-500/25 text-purple-300 border border-purple-500/35"
                              : "btn-primary"
                          }`}>
                            {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{u.name || "—"}</p>
                            <p className="text-xs text-white/40 truncate">{u.email}</p>
                            {u.company && <p className="text-[10px] text-white/25 truncate">{u.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "badge-purple" : "badge-cyan"}`}>
                          {u.role === "admin" ? "🛡 Admin" : "🧑‍💼 Seller"}
                        </span>
                      </td>
                      <td className="text-right text-sm font-semibold text-white">{u.total_orders ?? 0}</td>
                      <td className="text-right text-sm font-semibold text-emerald-400">
                        ₹{Number(u.total_spent ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${u.is_active ? "badge-success" : "badge-danger"}`}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openEdit(u)} title="Edit user"
                            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/40 hover:text-purple-300 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          {u.is_active && u.role !== "admin" && (
                            <button onClick={() => deactivate(u)} title="Deactivate"
                              className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/40 hover:text-red-400 transition-colors">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-white/30 text-sm">
                        No users match your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="glass rounded-2xl overflow-hidden">
          {viewUser ? (
            <>
              {/* User info */}
              <div className="p-5 border-b border-white/8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    viewUser.role === "admin"
                      ? "bg-purple-500/25 text-purple-300 border border-purple-500/35"
                      : "btn-primary"
                  }`}>
                    {(viewUser.name ?? viewUser.email ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">{viewUser.name || "—"}</h3>
                    <p className="text-xs text-white/40 truncate">{viewUser.email}</p>
                    {viewUser.company && <p className="text-[10px] text-white/25 truncate">{viewUser.company}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Role",        value: viewUser.role,      cap: true },
                    { label: "Status",      value: viewUser.is_active ? "Active" : "Inactive", cap: true },
                    { label: "Phone",       value: viewUser.phone     || "—",  cap: false },
                    { label: "Joined",      value: viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString("en-IN") : "—", cap: false },
                    { label: "Orders",      value: viewUser.total_orders ?? 0, cap: false },
                    { label: "Total Spent", value: `₹${Number(viewUser.total_spent ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, cap: false },
                  ].map(item => (
                    <div key={item.label} className="glass rounded-lg p-2.5">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider">{item.label}</p>
                      <p className={`text-white text-xs font-semibold mt-0.5 truncate ${item.cap ? "capitalize" : ""}`}>
                        {String(item.value)}
                      </p>
                    </div>
                  ))}
                </div>

                <button onClick={() => openEdit(viewUser)}
                  className="w-full btn-primary py-2.5 rounded-xl text-xs font-semibold mt-3">
                  ✏️ Edit User
                </button>
              </div>

              {/* Order history */}
              <div className="p-4">
                <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-3">
                  Order History
                </p>
                {viewOrders.length === 0 ? (
                  <p className="text-white/25 text-xs text-center py-6">No orders placed yet</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {viewOrders.map(o => (
                      <div key={o.id} className="glass-card rounded-xl p-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <code className="text-[10px] text-purple-300 font-mono">{o.ref}</code>
                            <p className="text-[10px] text-white/35 mt-0.5">
                              {o.item_count} item{o.item_count !== 1 ? "s" : ""} ·{" "}
                              {new Date(o.created_at).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-emerald-400">
                              ₹{Number(o.total_inr).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </p>
                            <span className={`badge ${ORDER_BADGE[o.status] ?? "badge-purple"} text-[9px] mt-0.5`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3 animate-float">👤</p>
              <p className="text-white/35 text-sm font-medium">Select a user</p>
              <p className="text-white/20 text-xs mt-1">Click any row to see their profile and order history</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setEditUser(null)}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-fade-in-up"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Edit User</h2>
              <button onClick={() => setEditUser(null)}
                className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 glass rounded-xl mb-5">
              <div className="w-9 h-9 rounded-full btn-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                {(editUser.name ?? editUser.email ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{editUser.email}</p>
                {editUser._dummy && <p className="text-[10px] text-amber-400/70">Demo user — changes saved locally only</p>}
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="field-label">Full Name</label>
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Full name"
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
              </div>

              {/* Role */}
              <div>
                <label className="field-label">Role</label>
                <div className="flex gap-2 p-1 glass rounded-xl">
                  {[
                    { key: "seller", label: "🧑‍💼 Seller" },
                    { key: "admin",  label: "🛡 Admin" },
                  ].map(r => (
                    <button key={r.key} type="button"
                      onClick={() => setEditForm({...editForm, role: r.key})}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        editForm.role === r.key ? "btn-primary" : "text-white/40 hover:text-white/70"
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
                {editForm.role === "admin" && (
                  <p className="text-amber-400 text-[11px] mt-1.5">
                    ⚠️ Grants full admin access to this user.
                  </p>
                )}
              </div>

              {/* Phone + Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Phone</label>
                  <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="field-label">Company</label>
                  <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}
                    placeholder="Company name"
                    className="glass-input w-full px-3 py-2.5 rounded-xl text-sm" />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-3.5 glass rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">Account Active</p>
                  <p className="text-xs text-white/35 mt-0.5">Inactive users are blocked from signing in</p>
                </div>
                <button type="button"
                  onClick={() => setEditForm({...editForm, is_active: !editForm.is_active})}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                    editForm.is_active ? "bg-emerald-500" : "bg-white/15"
                  }`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    editForm.is_active ? "left-6" : "left-0.5"
                  }`} />
                </button>
              </div>
            </div>

            {saveError && (
              <div className="mt-4 glass rounded-xl p-3 border border-red-500/30 bg-red-500/8">
                <p className="text-red-400 text-xs">{saveError}</p>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditUser(null)}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
