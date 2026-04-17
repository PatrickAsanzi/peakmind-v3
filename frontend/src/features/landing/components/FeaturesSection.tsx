import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

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
      <Card className="space-y-6">
        <CardHeader>
          <span className="text-sm uppercase tracking-[0.28em] text-teal-700">
            What we deliver
          </span>
          <CardTitle>
            Designed for high-performing teams and modern professionals.
          </CardTitle>
          <CardDescription>
            PeakMind combines science-backed support with user-friendly
            workflows so your people can stay resilient, productive, and
            engaged.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="space-y-4">
            <CardContent>
              <Badge variant="secondary">Feature</Badge>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
