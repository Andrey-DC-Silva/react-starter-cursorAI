import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SiteNavMenu } from "@/components/layout/SiteNavMenu";

export async function SiteNavbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            React Starter
          </Link>
          <SiteNavMenu
            isAdmin={user?.role === "ADMIN"}
            isAuthenticated={Boolean(user)}
          />
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-[var(--muted)]">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-white hover:bg-[var(--primary-hover)]"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
