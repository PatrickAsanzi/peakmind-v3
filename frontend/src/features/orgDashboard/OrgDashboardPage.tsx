import { Link } from "react-router-dom";

export default function OrgDashboardPage() {
  const summary = {
    activeTeams: 12,
    averageMood: 78,
    completionRate: 87,
    upcomingSessions: 5,
  };

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
              Organization
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Leadership dashboard
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Back to personal dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Active teams
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {summary.activeTeams}
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Average mood
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {summary.averageMood}
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Completion
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {summary.completionRate}%
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Upcoming sessions
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {summary.upcomingSessions}
          </p>
        </div>
      </div>
    </div>
  );
}
