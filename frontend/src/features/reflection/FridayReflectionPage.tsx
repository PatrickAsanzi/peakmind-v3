import { useQuery } from "@tanstack/react-query";
import {
  getFridayReflection,
  type ReflectionPrompt,
} from "../../shared/peakmind";

export default function FridayReflectionPage() {
  const { data, isLoading, error } = useQuery<ReflectionPrompt, Error>({
    queryKey: ["fridayReflection"],
    queryFn: getFridayReflection,
  });

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Weekly reflection
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Friday reflection
          </h1>
          <p className="text-slate-600">
            Capture the week’s progress and plan a more centered week ahead.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading reflection prompt…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load the reflection prompt.
        </div>
      ) : (
        <div className="section-card">
          <h2 className="text-2xl font-semibold text-slate-900">
            {data?.prompt}
          </h2>
          <p className="mt-4 text-slate-600">
            Take a moment to review your wins, challenges, and what you want to
            carry into next week.
          </p>
        </div>
      )}
    </div>
  );
}
