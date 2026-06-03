"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const params = useParams();
  const role = params?.role || "seller";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [secretVerified, setSecretVerified] = useState(role !== "admin");
  const [secretError, setSecretError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleColors = {
    admin: "#7c3aed",
    seller: "#06b6d4",
    buyer: "#10b981",
  };
  const accent = roleColors[role] || "#7c3aed";

  const roleEmoji = role === "admin" ? "\u{1F6E1}\uFE0F" : role === "buyer" ? "\u{1F6D2}" : "\u{1F9D1}\u200D\u{1F4BC}";

  // Step 1: Verify admin secret before showing form
  const handleVerifySecret = (e) => {
    e.preventDefault();
    setSecretError("");
    if (!adminSecret.trim()) {
      setSecretError("Please enter the admin passphrase.");
      return;
    }
    setSecretVerified(true);
  };

  // Step 2: Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { name, email, password, role };
      if (role === "admin") body.adminSecret = adminSecret;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let data;
      try { data = await res.json(); } catch { data = { error: "Server error. Please try again." }; }
      if (!res.ok) {
        setError(data.error || `Registration failed (${res.status}).`);
        setLoading(false);
        return;
      }
      const userRole = data.user?.role;
      if (userRole === "admin") router.push("/admin/dashboard");
      else if (userRole === "seller") router.push("/seller/dashboard");
      else if (userRole === "buyer") router.push("/buyer/dashboard");
      else router.push("/");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to role selection
        </Link>

        <div className="glass-strong rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
              style={{ background: `${accent}22`, border: `1px solid ${accent}40` }}
            >
              {roleEmoji}
            </div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-white/40 text-sm mt-1 capitalize">Sign up as {role}</p>
          </div>

          {/* Admin: Gate behind secret first */}
          {role === "admin" && !secretVerified && (
            <>
              {secretError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {secretError}
                </div>
              )}
              <form onSubmit={handleVerifySecret} className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-purple-300">
                    Admin registration requires a secret passphrase. Only authorized personnel can create admin accounts.
                  </p>
                </div>
                <div>
                  <label className="field-label">Admin Secret Passphrase</label>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter admin passphrase"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${accent}dd, ${accent}aa)`,
                    border: `1px solid ${accent}50`,
                    boxShadow: `0 4px 20px ${accent}30`,
                  }}
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {/* Registration form (shown after admin secret verified, or immediately for non-admin) */}
          {secretVerified && (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accent}dd, ${accent}aa)`,
                    border: `1px solid ${accent}50`,
                    boxShadow: `0 4px 20px ${accent}30`,
                  }}
                >
                  {loading ? "Creating account\u2026" : "Create Account"}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-white/35 text-xs mt-6">
            Already have an account?{" "}
            <Link href={`/auth/${role}/sign-in`} className="text-white/70 hover:text-white underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
