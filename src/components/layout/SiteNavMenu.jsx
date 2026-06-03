"use client";

import { NavLink } from "@/components/layout/NavLink";

export function SiteNavMenu({ isAdmin, isAuthenticated }) {
  return (
    <nav className="flex flex-wrap items-center gap-1">
      <NavLink href="/" exact>
        Início
      </NavLink>
      {isAuthenticated ? (
        <>
          <NavLink href="/todos">Tarefas</NavLink>
          <NavLink href="/profile">Perfil</NavLink>
        </>
      ) : null}
      {isAdmin ? (
        <NavLink href="/admin">Admin</NavLink>
      ) : null}
    </nav>
  );
}
