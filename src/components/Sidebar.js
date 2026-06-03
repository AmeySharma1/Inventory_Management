"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const adminNav = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: <GridIcon /> },
    ],
  },
  {
    group: "Inventory",
    items: [
      { label: "Products",    href: "/admin/products",   icon: <BoxIcon /> },
      { label: "Stock Levels", href: "/admin/stock",     icon: <BarChartIcon /> },
      { label: "Categories",  href: "/admin/categories", icon: <ListIcon /> },
    ],
  },
  {
    group: "Orders",
    items: [
      { label: "Quotations", href: "/admin/quotations", icon: <FileIcon />, badge: "new" },
      { label: "Orders",     href: "/admin/orders",     icon: <CartIcon /> },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Users",    href: "/admin/users",    icon: <UsersIcon /> },
      { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
    ],
  },
];

const buyerNav = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard",   href: "/buyer/dashboard", icon: <GridIcon /> },
      { label: "Browse Products", href: "/buyer/products", icon: <BoxIcon /> },
    ],
  },
  {
    group: "Orders",
    items: [
      { label: "My Orders",   href: "/buyer/orders", icon: <CartIcon /> },
      { label: "Quotations",  href: "/buyer/quotations", icon: <FileIcon /> },
    ],
  },
];

const sellerNav = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/seller/dashboard", icon: <GridIcon /> },
    ],
  },
  {
    group: "Products",
    items: [
      { label: "My Products",    href: "/seller/products",  icon: <BoxIcon /> },
      { label: "All Products",   href: "/seller/catalog",   icon: <BoxIcon /> },
    ],
  },
  {
    group: "Orders",
    items: [
      { label: "Place Order",    href: "/seller/new-order", icon: <PlusCircleIcon /> },
      { label: "My Orders",      href: "/seller/orders",    icon: <CartIcon /> },
      { label: "Quotations",     href: "/seller/quotations", icon: <FileIcon /> },
    ],
  },
];

export default function Sidebar({ role = "admin" }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const nav = role === "admin" ? adminNav : role === "buyer" ? buyerNav : sellerNav;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => d.user && setUser(d.user))
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
  };

  const displayName = user?.name || (role === "admin" ? "Admin" : role === "seller" ? "Seller" : "Buyer");
  const displayEmail = user?.email ?? "";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`glass flex flex-col h-screen sticky top-0 transition-all duration-300 z-20 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M2 7l10 5m0 0l10-5m-10 5v10" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold gradient-text leading-none">ChemStock</p>
            <p className="text-[10px] text-white/35 mt-0.5 capitalize">{role} Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {nav.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
                {group.group}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`sidebar-item flex items-center gap-3 px-3 py-2.5 cursor-pointer ${
                        active ? "active" : ""
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : ""}
                    >
                      <span className={active ? "text-purple-300" : "text-white/45"}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={`text-sm font-medium flex-1 ${active ? "text-white" : "text-white/60"}`}>
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="badge badge-purple text-[10px]">{item.badge}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-2 border-t border-white/8">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 glass-card rounded-xl">
            <div className="w-7 h-7 rounded-full btn-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-white/35 truncate">{displayEmail}</p>
            </div>
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg btn-secondary text-xs"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>

          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center w-9 h-9 rounded-lg btn-secondary hover:border-red-500/30 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── Icon components ──────────────────────────────────────────
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/><path d="M2 7l10 5m0 0l10-5m-10 5v10"/>
    </svg>
  );
}
function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h8M4 18h12"/>
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 002 1.58h9.78a2 2 0 001.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}
function PlusCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
