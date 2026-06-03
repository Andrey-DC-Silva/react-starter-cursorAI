"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children, exact = false }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[var(--primary)] text-white"
          : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </Link>
  );
}
