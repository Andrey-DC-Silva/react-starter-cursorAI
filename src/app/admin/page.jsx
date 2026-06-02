export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const [totalUsers, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-[var(--muted)]">
          Bem-vindo, {user?.name ?? user?.email}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Total de usuários">
          <p className="text-3xl font-bold">{totalUsers}</p>
        </Card>
        <Card title="Administradores">
          <p className="text-3xl font-bold">{adminCount}</p>
        </Card>
      </div>
    </div>
  );
}
