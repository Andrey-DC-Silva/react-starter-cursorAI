"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1">
      <AdminSidebar currentPath={pathname} />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
