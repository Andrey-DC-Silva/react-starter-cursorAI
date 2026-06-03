"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserFormFields } from "@/components/users/UserFormFields";

const emptyCreate = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

function RoleBadge({ role }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        role === "ADMIN"
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      }`}
    >
      {role}
    </span>
  );
}

export function UserAdminCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCreate);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setError("");
    const response = await fetch("/api/admin/users");
    const result = await response.json();

    if (!response.ok) {
      setError(result.error?.message ?? "Falha ao carregar usuários");
      return;
    }

    setUsers(result.data.users);
  }, []);

  useEffect(() => {
    loadUsers().finally(() => setLoading(false));
  }, [loadUsers]);

  function onChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setForm(emptyCreate);
    setError("");
  }

  function openEdit(user) {
    setMode("edit");
    setEditingId(user.id);
    setForm({
      name: user.name ?? "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setError("");
  }

  function cancelForm() {
    setMode("list");
    setEditingId(null);
    setForm(emptyCreate);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const isCreate = mode === "create";
      const url = isCreate
        ? "/api/admin/users"
        : `/api/admin/users/${editingId}`;
      const method = isCreate ? "POST" : "PATCH";

      const payload = {
        name: form.name || null,
        email: form.email,
        role: form.role,
      };
      if (isCreate || form.password.trim()) {
        payload.password = form.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao salvar usuário");
        return;
      }

      cancelForm();
      await loadUsers();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Excluir o usuário ${user.email}?`,
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao excluir usuário");
        return;
      }

      if (editingId === user.id) {
        cancelForm();
      }
      await loadUsers();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Carregando usuários...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {users.length} usuário{users.length === 1 ? "" : "s"} no sistema
        </p>
        {mode === "list" ? (
          <Button type="button" onClick={openCreate}>
            Novo usuário
          </Button>
        ) : null}
      </div>

      {mode !== "list" ? (
        <Card
          title={mode === "create" ? "Criar usuário" : "Editar usuário"}
          description="CRUD completo via API admin."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <UserFormFields
              values={form}
              onChange={onChange}
              showRole
              showPassword
              passwordRequired={mode === "create"}
              disabled={submitting}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={cancelForm}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="px-2 py-2 font-medium">E-mail</th>
                <th className="px-2 py-2 font-medium">Nome</th>
                <th className="px-2 py-2 font-medium">Papel</th>
                <th className="px-2 py-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 py-8 text-center text-[var(--muted)]"
                  >
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="px-2 py-3">{user.email}</td>
                    <td className="px-2 py-3">{user.name ?? "—"}</td>
                    <td className="px-2 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          disabled={submitting}
                          onClick={() => openEdit(user)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="px-2 py-1 text-xs"
                          disabled={submitting}
                          onClick={() => handleDelete(user)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
