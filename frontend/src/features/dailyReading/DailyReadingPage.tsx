import { useDailyReading } from "./hooks/useDailyReading";

export default function DailyReadingPage() {
  const { data, isLoading, error } = useDailyReading();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Daily reading
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Today’s insight
          </h1>
          <p className="text-slate-600">
            A short reading to help you start the day with clarity and
            resilience.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading today’s reading…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load the reading.
        </div>
      ) : (
        <div className="section-card">
          <h2 className="text-2xl font-semibold text-slate-900">
            {data?.title}
          </h2>
          <p className="mt-4 text-slate-700">{data?.summary}</p>
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">
            Estimated time: {data?.durationMinutes} min
          </p>
        </div>
      )}
    </div>
  );
}
