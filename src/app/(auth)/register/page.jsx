import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Cadastrar — React Starter",
};

export default function RegisterPage() {
  return (
    <Card title="Criar conta" description="Registre-se para usar a aplicação.">
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        Já tem conta?{" "}
        <Link href="/login" className="text-[var(--primary)] hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
