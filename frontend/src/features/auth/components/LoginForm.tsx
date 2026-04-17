import type { FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
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
          placeholder="Enter your password"
        />
      </label>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
