import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-teal-700">
            PeakMind
          </p>
          <p className="mt-4 max-w-sm text-slate-600">
            A modern wellness platform built for people who care about
            sustainable mental health, community, and performance.
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-700">
            Product
          </p>
          <nav className="mt-4 space-y-2 text-sm text-slate-600">
            <Link to="/">Overview</Link>
            <Link to="/auth">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-teal-700">
            Contact
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>support@peakmind.ai</p>
            <p>Built for professionals, teams, and communities.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
