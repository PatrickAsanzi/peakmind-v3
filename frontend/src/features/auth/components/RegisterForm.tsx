import type { FormEvent } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({
  name,
  email,
  password,
  isLoading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Name</span>
        <Input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          required
          placeholder="Your full name"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <Input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
          placeholder="hello@peakmind.ai"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <Input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
          placeholder="Create a password"
        />
      </label>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
