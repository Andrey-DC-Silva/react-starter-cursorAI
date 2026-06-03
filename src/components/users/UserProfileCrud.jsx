"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserFormFields } from "@/components/users/UserFormFields";

export function UserProfileCrud({ initialUser }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: initialUser.name ?? "",
    email: initialUser.email,
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: values.name || null,
        email: values.email,
      };
      if (values.password.trim()) {
        payload.password = values.password;
      }

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao salvar");
        return;
      }

      setValues((current) => ({
        ...current,
        name: result.data.user.name ?? "",
        email: result.data.user.email,
        password: "",
      }));
      setSuccess("Perfil atualizado com sucesso.");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/me", { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao excluir conta");
        setLoading(false);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Dados da conta" description={`Papel: ${initialUser.role}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <UserFormFields
            values={values}
            onChange={onChange}
            showPassword
            disabled={loading}
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Card>

      <Card
        title="Zona de perigo"
        description="Exclui permanentemente sua conta e encerra a sessão."
      >
        <Button
          type="button"
          variant="danger"
          disabled={loading}
          onClick={handleDelete}
        >
          Excluir minha conta
        </Button>
      </Card>
    </div>
  );
}
