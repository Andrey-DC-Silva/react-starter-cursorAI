import { TEST_ACCOUNTS_PUBLIC } from "@/lib/auth/test-users";
import { isAuthTestMode } from "@/lib/auth/test-mode";

export function TestModeHint() {
  if (!isAuthTestMode()) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-medium">Modo de teste (sem banco de dados)</p>
      <p className="mt-1 text-amber-800 dark:text-amber-200">
        Use as contas abaixo ou os botões rápidos no formulário.
      </p>
      <ul className="mt-2 space-y-1 font-mono text-xs">
        {TEST_ACCOUNTS_PUBLIC.map((account) => (
          <li key={account.email}>
            {account.label}: {account.email} / {account.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
