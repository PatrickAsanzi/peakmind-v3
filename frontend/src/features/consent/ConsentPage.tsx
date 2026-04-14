import { useConsentStatus } from "./hooks/useConsentStatus";

export default function ConsentPage() {
  const { data, isLoading, error } = useConsentStatus();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Privacy & consent
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Personal data permissions
          </h1>
          <p className="text-slate-600">
            Review and manage your consent settings for wellbeing tracking and
            professional collaboration.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading consent details…
        </div>
      ) : error ? (
        <div className="section-card text-rose-600">
          Unable to load consent status.
        </div>
      ) : (
        <div className="section-card">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Current status
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {data?.given ? "Consent provided" : "Consent not yet given"}
          </p>
          <p className="mt-3 text-slate-600">
            Last updated: {data?.updatedAt ?? "Unknown"}
          </p>
        </div>
      )}
    </div>
  );
}
