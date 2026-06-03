export const dynamic = "force-dynamic";

import { UserAdminCrud } from "@/components/users/UserAdminCrud";
import { isAuthTestMode } from "@/lib/auth/test-mode";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Usuários</h2>
        <p className="text-sm text-[var(--muted)]">
          CRUD completo (criar, editar, excluir).
          {isAuthTestMode()
            ? " Modo de teste: dados em memória."
            : " Dados no PostgreSQL."}
        </p>
      </div>
      <UserAdminCrud />
    </div>
  );
}
