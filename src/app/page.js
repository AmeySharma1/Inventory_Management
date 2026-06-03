import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingClient from "@/components/LandingClient";

export default async function RootPage() {
  const session = await getSession();

  if (session?.role === "admin")  redirect("/admin/dashboard");
  if (session?.role === "seller") redirect("/seller/dashboard");
  if (session?.role === "buyer")  redirect("/buyer/dashboard");

  return <LandingClient />;
}
