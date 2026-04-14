import type { FormEvent } from "react";

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
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          required
          placeholder="Your full name"
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
          placeholder="hello@peakmind.ai"
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
          placeholder="Create a password"
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
