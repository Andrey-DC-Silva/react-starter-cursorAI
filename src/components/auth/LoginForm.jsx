"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm({ testAccounts = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginWithCredentials(credentials) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message ?? "Falha ao entrar");
        return;
      }

      const destination =
        result.data.user.role === "ADMIN" ? "/admin" : callbackUrl;
      router.push(destination);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await loginWithCredentials({ email, password });
  }

  function handleQuickLogin(account) {
    setEmail(account.email);
    setPassword(account.password);
    loginWithCredentials({
      email: account.email,
      password: account.password,
    });
  }

  return (
    <div className="space-y-4">
      {testAccounts.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {testAccounts.map((account) => (
            <Button
              key={account.email}
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => handleQuickLogin(account)}
            >
              Entrar como {account.label}
            </Button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
