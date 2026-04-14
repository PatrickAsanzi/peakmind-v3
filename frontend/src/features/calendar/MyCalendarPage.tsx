import { useCalendarEvents } from "./hooks/useCalendarEvents";

export default function MyCalendarPage() {
  const { data, isLoading, error } = useCalendarEvents();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Calendar
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Your wellbeing schedule
          </h1>
          <p className="text-slate-600">
            Review upcoming sessions, team check-ins, and recommended learning
            moments.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading calendar events…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load calendar events.
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((event) => (
            <article key={event.id} className="section-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {event.title}
                </h2>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {event.type}
                </p>
              </div>
              <p className="mt-3 text-slate-600">
                {new Date(event.start).toLocaleString()} –{" "}
                {new Date(event.end).toLocaleTimeString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
