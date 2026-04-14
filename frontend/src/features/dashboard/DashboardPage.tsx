import { useAuth } from "@/features/auth/hooks/useAuth";

const dashboardSummary = {
  checkInStreak: 4,
  pendingTasks: 2,
  newestConnections: 3,
  lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Welcome back
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              {user?.name ? `${user.name}'s` : "Your"} PeakMind dashboard
            </h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Professional wellness insights updated daily
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Check-in streak
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {dashboardSummary.checkInStreak} days
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Pending actions
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {dashboardSummary.pendingTasks}
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Connections
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {dashboardSummary.newestConnections}
          </p>
        </div>
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Last check-in
          </p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {dashboardSummary.lastCheckIn}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <a
          href="/check-in"
          className="section-card transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Action
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">
            Submit today’s check-in
          </h2>
        </a>
        <a
          href="/community"
          className="section-card transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Explore
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">
            Join the community feed
          </h2>
        </a>
        <a
          href="/professionals"
          className="section-card transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Connect
          </p>
          <h2 className="mt-3 text-xl font-semibold text-slate-900">
            Find professionals
          </h2>
        </a>
      </section>
    </div>
  );
}
