import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const role = session.role ?? "seller";

  // Only admins may access /admin/*
  if (role !== "admin") redirect("/seller/dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
