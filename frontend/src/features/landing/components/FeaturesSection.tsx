const features = [
  {
    title: "Daily human-centered check-ins",
    description:
      "Capture mood, energy, and progress with guided reflections designed for teams and individuals.",
  },
  {
    title: "Live coaching-ready workflows",
    description:
      "Bring structured exercises, meditation, and skill-building resources into every session.",
  },
  {
    title: "Community and professional connection",
    description:
      "Enable trusted collaboration between colleagues, managers, and support professionals.",
  },
  {
    title: "Insightful reporting",
    description:
      "Track wellbeing trends, engagement, and outcomes across your organization.",
  },
];

export function FeaturesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
        <span className="text-sm uppercase tracking-[0.28em] text-teal-700">
          What we deliver
        </span>
        <h2 className="text-3xl font-semibold text-slate-900">
          Designed for high-performing teams and modern professionals.
        </h2>
        <p className="max-w-xl text-slate-600">
          PeakMind combines science-backed support with user-friendly workflows
          so your people can stay resilient, productive, and engaged.
        </p>
      </div>

      <div className="grid gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="section-card">
            <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
              Feature
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
