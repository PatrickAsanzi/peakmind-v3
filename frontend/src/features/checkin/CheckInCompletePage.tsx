import { Link } from "react-router-dom";

export default function CheckInCompletePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
        Check-in complete
      </p>
      <h1 className="text-3xl font-semibold text-slate-900">
        Thank you for sharing.
      </h1>
      <p className="text-slate-600">
        Your wellbeing update has been saved, and PeakMind is using it to tailor
        the next steps in your journey.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
