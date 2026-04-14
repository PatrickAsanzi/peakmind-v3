import { useQuery } from "@tanstack/react-query";
import { getProfessionals, type ProfessionalProfile } from "@/shared/peakmind";

export default function ProfessionalsPage() {
  const { data, isLoading, error } = useQuery<ProfessionalProfile[], Error>({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Professionals
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Find a trusted expert
          </h1>
          <p className="text-slate-600">
            Browse recommended coaches, therapists, and wellbeing professionals
            for confidential support.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading professionals…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load professional profiles.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {data?.map((pro) => (
            <article key={pro.id} className="section-card">
              <h2 className="text-xl font-semibold text-slate-900">
                {pro.name}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-teal-700">
                {pro.specialty}
              </p>
              <p className="mt-4 text-slate-600">{pro.bio}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
