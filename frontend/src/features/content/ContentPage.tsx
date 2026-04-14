import { useContentRecommendations } from "./hooks/useContentRecommendations";

export default function ContentPage() {
  const { data, isLoading, error } = useContentRecommendations();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            On-demand learning
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Recommended wellbeing resources
          </h1>
          <p className="text-slate-600">
            Curated content for your current focus, including stress management,
            resilience, and team wellbeing.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading content recommendations…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load content recommendations.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {data?.map((item) => (
            <article key={item.id} className="section-card">
              <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
                {item.category}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
