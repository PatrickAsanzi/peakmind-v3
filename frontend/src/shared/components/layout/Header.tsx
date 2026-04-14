import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold">PeakMind</p>
            <p className="text-xs text-slate-500">Wellness for teams & pros</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Dashboard
          </Link>
          <Link
            to="/community"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Community
          </Link>
          <Link
            to="/professionals"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Professionals
          </Link>
          <Link
            to="/content"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Content
          </Link>
          <Link
            to="/calendar"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Calendar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 md:flex">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>{user.name ?? user.email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
