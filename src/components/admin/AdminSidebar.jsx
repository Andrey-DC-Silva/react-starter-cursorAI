import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Usuários" },
];

export function AdminSidebar({ currentPath }) {
  return (
    <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--card)] p-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Painel Admin
      </p>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? currentPath === "/admin"
              : currentPath.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--background)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
