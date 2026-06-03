import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { TestModeHint } from "@/components/auth/TestModeHint";
import { Card } from "@/components/ui/Card";
import { isAuthTestMode } from "@/lib/auth/test-mode";
import { TEST_ACCOUNTS_PUBLIC } from "@/lib/auth/test-users";

export const metadata = {
  title: "Entrar — React Starter",
};

export default function LoginPage() {
  const testMode = isAuthTestMode();

  return (
    <>
      <TestModeHint />
      <Card
        title="Entrar"
        description={
          testMode
            ? "Modo de teste: login sem banco de dados."
            : "Acesse com e-mail e senha. Administradores são redirecionados ao painel."
        }
      >
        <Suspense fallback={<p className="text-sm text-[var(--muted)]">Carregando...</p>}>
          <LoginForm
            testAccounts={testMode ? TEST_ACCOUNTS_PUBLIC : []}
          />
        </Suspense>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Não tem conta?{" "}
          <Link href="/register" className="text-[var(--primary)] hover:underline">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </>
  );
}
