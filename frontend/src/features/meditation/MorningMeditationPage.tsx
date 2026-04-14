import { useMeditationSession } from "./hooks/useMeditationSession";

export default function MorningMeditationPage() {
  const { data, isLoading, error } = useMeditationSession();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Morning meditation
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Start your day calm and focused
          </h1>
          <p className="text-slate-600">
            A guided meditation session designed for a grounded morning routine.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading meditation details…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load the meditation session.
        </div>
      ) : (
        <div className="section-card">
          <h2 className="text-2xl font-semibold text-slate-900">
            {data?.title}
          </h2>
          <p className="mt-4 text-slate-700">{data?.description}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">
            Duration: {data?.durationMinutes} min
          </p>
        </div>
      )}
    </div>
  );
}
