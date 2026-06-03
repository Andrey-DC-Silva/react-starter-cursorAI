import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { TodoList } from "@/components/todos/TodoList";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "Tarefas — React Starter",
};

export default async function TodosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/todos");
  }

  return (
    <>
      <SiteNavbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Minhas tarefas</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Gerencie sua lista via API REST em{" "}
            <code className="rounded bg-[var(--card)] px-1">/api/todos</code>.
          </p>
        </div>

        <Card title="To-do list">
          <TodoList />
        </Card>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          <Link href="/" className="text-[var(--primary)] hover:underline">
            Voltar ao início
          </Link>
        </p>
      </main>
    </>
  );
}
