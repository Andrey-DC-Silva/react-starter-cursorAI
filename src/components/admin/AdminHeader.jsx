import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function AdminHeader({ user }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold">Administração</h1>
        <p className="text-sm text-[var(--muted)]">{user.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm hover:underline">
          Site
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
