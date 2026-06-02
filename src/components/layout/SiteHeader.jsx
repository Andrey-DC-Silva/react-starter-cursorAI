import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          React Starter
        </Link>
        <nav className="flex items-center gap-4 text-sm">>
          {user ? (
            <>
              <span className="text-[var(--muted)]">{user.email}</spans>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="hover:underline">
                  Admin
                </Link>
              ) : null}
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
