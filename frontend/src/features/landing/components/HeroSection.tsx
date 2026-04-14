import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
            <Shield className="h-4 w-4" />
            Trusted wellness for teams and professionals
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              PeakMind helps teams build resilience, focus, and meaningful
              support.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A polished wellbeing workspace that brings daily check-ins, guided
              exercises, professional resources, and community support together
              in one modern hub.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/auth" className="button-primary">
              Start your free pilot
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore the platform
            </Link>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-950/20 ring-1 ring-white/10">
          <div className="flex items-center justify-between rounded-3xl bg-slate-900/90 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Team engagement
              </p>
              <p className="mt-3 text-2xl font-semibold">+38%</p>
            </div>
            <div className="rounded-3xl bg-teal-500/15 p-3 text-teal-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Weekly focus sessions</p>
              <p className="mt-3 text-xl font-semibold">Guided check-ins</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Psychological safety</p>
              <p className="mt-3 text-xl font-semibold">Confidential support</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              PeakMind impact
            </p>
            <p className="mt-3 text-3xl font-semibold">
              Powerful support for emotional wellbeing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
