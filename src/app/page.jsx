import Link from "next/link";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteNavbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Full-stack com Next.js e JWT
          </h1>
          <p className="text-[var(--muted)]">
            Base do projeto com API REST, autenticação via cookie httpOnly,
            PostgreSQL com Prisma e painel administrativo para usuários com
            papel ADMIN.
          </p>

          <Card title="Sua sessão">
            {user ? (
              <>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">E-mail</dt>
                  <dd>{user.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Papel</dt>
                  <dd>{user.role}</dd>
                </div>
              </dl>
              <p className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href="/todos" className="text-[var(--primary)] hover:underline">
                  Tarefas →
                </Link>
                <Link href="/profile" className="text-[var(--primary)] hover:underline">
                  Meu perfil →
                </Link>
              </p>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Você não está autenticado.{" "}
                <Link href="/login" className="text-[var(--primary)] hover:underline">
                  Faça login
                </Link>{" "}
                ou{" "}
                <Link href="/register" className="text-[var(--primary)] hover:underline">
                  crie uma conta
                </Link>
                .
              </p>
            )}
          </Card>

          <Card title="API REST" description="Endpoints disponíveis na base">
            <ul className="space-y-1 font-mono text-sm text-[var(--muted)]">
              <li>GET /api/health</li>
              <li>POST /api/auth/register</li>
              <li>POST /api/auth/login</li>
              <li>POST /api/auth/logout</li>
              <li>GET /api/auth/me</li>
              <li>GET /api/admin/users (ADMIN)</li>
              <li>GET /api/todos (auth)</li>
              <li>POST /api/todos (auth)</li>
              <li>PATCH /api/todos/:id (auth)</li>
              <li>DELETE /api/todos/:id (auth)</li>
              <li>GET/PATCH/DELETE /api/users/me (auth)</li>
              <li>POST /api/admin/users (ADMIN)</li>
              <li>GET/PATCH/DELETE /api/admin/users/:id (ADMIN)</li>
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
