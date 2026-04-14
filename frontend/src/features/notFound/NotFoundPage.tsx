import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
        Page not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">
        404: Lost in the mind map
      </h1>
      <p className="mt-4 text-slate-600">
        The route you tried to reach doesn’t exist yet. Let’s get you back on
        track.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
      >
        Return home
      </Link>
    </div>
  );
}
