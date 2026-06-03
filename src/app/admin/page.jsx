export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/session";
import { isAuthTestMode } from "@/lib/auth/test-mode";
import { getUserStats } from "@/lib/auth/user-repository";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const { total, admins } = await getUserStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-[var(--muted)]">
          Bem-vindo, {user?.name ?? user?.email}.
        </p>
        {isAuthTestMode() ? (
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
            Modo de teste ativo — dados em memória, sem PostgreSQL.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Total de usuários">
          <p className="text-3xl font-bold">{total}</p>
        </Card>
        <Card title="Administradores">
          <p className="text-3xl font-bold">{admins}</p>
        </Card>
      </div>
    </div>
  );
}
