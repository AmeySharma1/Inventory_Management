import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function BuyerLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/");

  if (session.role === "admin")  redirect("/admin/dashboard");
  if (session.role === "seller") redirect("/seller/dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="buyer" />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
