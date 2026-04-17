import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";

const benefits = [
  "Rapid onboarding for leaders and professionals",
  "Integrated wellness, check-ins, and coaching workflows",
  "Secure, reliable data-driven insights",
];

export function CTASection() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-slate-950/95 p-10 text-white shadow-2xl shadow-slate-950/20">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-teal-300">
            Take the first step
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            Bring better mental health support into your organization.
          </h2>
          <p className="mt-4 max-w-xl text-slate-300">
            PeakMind gives your people professional wellbeing tools, community
            resources, and progress tracking in one cohesive experience.
          </p>
        </div>

        <Card className="space-y-4 rounded-[2rem] bg-slate-950/95 p-8 ring-1 ring-white/10">
          <CardContent className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-3xl bg-slate-900/80 px-5 py-4"
              >
                <p className="text-sm text-slate-200">{benefit}</p>
              </div>
            ))}
            <Link
              to="/auth/register"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-400"
            >
              Launch your pilot
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
