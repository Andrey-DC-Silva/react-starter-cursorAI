import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Admin — React Starter",
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
