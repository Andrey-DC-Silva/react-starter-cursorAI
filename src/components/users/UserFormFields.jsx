import { Input } from "@/components/ui/Input";

export function UserFormFields({
  values,
  onChange,
  showRole = false,
  showPassword = true,
  passwordRequired = false,
  disabled = false,
}) {
  return (
    <div className="space-y-4">
      <Input
        label="Nome"
        name="name"
        value={values.name}
        onChange={(event) => onChange("name", event.target.value)}
        disabled={disabled}
      />
      <Input
        label="E-mail"
        name="email"
        type="email"
        required
        value={values.email}
        onChange={(event) => onChange("email", event.target.value)}
        disabled={disabled}
      />
      {showPassword ? (
        <Input
          label={passwordRequired ? "Senha" : "Nova senha (opcional)"}
          name="password"
          type="password"
          required={passwordRequired}
          minLength={passwordRequired ? 8 : undefined}
          value={values.password}
          onChange={(event) => onChange("password", event.target.value)}
          disabled={disabled}
        />
      ) : null}
      {showRole ? (
        <div className="space-y-1">
          <label htmlFor="role" className="block text-sm font-medium">
            Papel
          </label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={(event) => onChange("role", event.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none ring-[var(--primary)] focus:ring-2"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}
