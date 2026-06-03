"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { NavLink } from "@/components/layout/NavLink";

const adminLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Usuários" },
];

export function AdminNavbar({ user }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/admin" className="text-lg font-semibold">
            Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                exact={link.exact}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-[var(--muted)]">{user.email}</span>
          <Link href="/profile" className="hover:underline">
            Perfil
          </Link>
          <Link href="/" className="hover:underline">
            Site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
