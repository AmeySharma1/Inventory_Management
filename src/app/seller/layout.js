import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function SellerLayout({ children }) {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  const role = session.role ?? "seller";

  // Admin visiting /seller/* → send to their own dashboard
  if (role === "admin") redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="seller" />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
