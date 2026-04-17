import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegister } from "./hooks/useRegister";
import RegisterForm from "./components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/components/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    try {
      await register({ name, email, password });
      toast.success("Account created successfully. Please sign in.");
      navigate("/auth");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to register.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-900/5">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
          Create your PeakMind account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Register and get started
        </h1>
        <p className="text-slate-600">
          Set up your account with your professional email and join your team
          wellness hub.
        </p>
      </div>

      <RegisterForm
        name={name}
        email={email}
        password={password}
        isLoading={isLoading}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/auth"
          className="font-semibold text-teal-700 underline transition hover:text-teal-900"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
