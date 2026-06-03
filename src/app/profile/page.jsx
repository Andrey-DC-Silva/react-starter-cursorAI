import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { UserProfileCrud } from "@/components/users/UserProfileCrud";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Meu perfil — React Starter",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <>
      <SiteNavbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meu perfil</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Atualize seus dados ou exclua sua conta via{" "}
            <code className="rounded bg-[var(--card)] px-1">/api/users/me</code>.
          </p>
        </div>
        <UserProfileCrud initialUser={user} />
      </main>
    </>
  );
}
