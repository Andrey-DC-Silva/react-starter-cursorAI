import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Entrar — React Starter",
};

export default function LoginPage() {
  return (
    <Card
      title="Entrar"
      description="Acesse com e-mail e senha. Administradores são redirecionados ao painel."
    >
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">Carregando...</p>}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        Não tem conta?{" "}
        <Link href="/register" className="text-[var(--primary)] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </Card>
  );
}
