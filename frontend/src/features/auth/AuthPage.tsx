import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin } from "./hooks/useLogin";
import LoginForm from "./components/LoginForm";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await signIn(email, password);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-900/5">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          PeakMind login
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Sign in to your account
        </h1>
        <p className="text-slate-600">
          Use your team credentials or professional email so we can connect you
          to the right wellness workflows.
        </p>
      </div>

      <LoginForm
        email={email}
        password={password}
        isLoading={isLoading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
