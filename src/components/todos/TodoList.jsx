"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = useCallback(async () => {
    setError("");
    const response = await fetch("/api/todos");
    const result = await response.json();

    if (!response.ok) {
      setError(result.error?.message ?? "Falha ao carregar tarefas");
      return;
    }

    setTodos(result.data.todos);
  }, []);

  useEffect(() => {
    loadTodos().finally(() => setLoading(false));
  }, [loadTodos]);

  async function handleAdd(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao criar tarefa");
        return;
      }

      setTitle("");
      setTodos((current) => [result.data.todo, ...current]);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(todo) {
    setError("");

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error?.message ?? "Falha ao atualizar tarefa");
      return;
    }

    setTodos((current) =>
      current.map((item) =>
        item.id === todo.id ? result.data.todo : item,
      ),
    );
  }

  async function handleDelete(todoId) {
    setError("");

    const response = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error?.message ?? "Falha ao remover tarefa");
      return;
    }

    setTodos((current) => current.filter((item) => item.id !== todoId));
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Carregando tarefas...</p>;
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          name="title"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="flex-1"
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "..." : "Adicionar"}
        </Button>
      </form>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {todos.length > 0 ? (
        <p className="text-sm text-[var(--muted)]">
          {completedCount} de {todos.length} concluída
          {completedCount === 1 ? "" : "s"}
        </p>
      ) : null}

      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            Nenhuma tarefa ainda. Adicione a primeira acima.
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                className="size-4 rounded border-[var(--border)]"
                aria-label={`Marcar "${todo.title}" como concluída`}
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? "text-[var(--muted)] line-through"
                    : ""
                }`}
              >
                {todo.title}
              </span>
              <Button
                type="button"
                variant="danger"
                className="px-2 py-1 text-xs"
                onClick={() => handleDelete(todo.id)}
              >
                Remover
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
