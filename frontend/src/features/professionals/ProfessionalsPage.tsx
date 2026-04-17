import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProfessionals,
  type ProfessionalProfile,
} from "../../shared/peakmind";
import { Button } from "../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/components/ui/card";
import { Input } from "../../shared/components/ui/input";
import { Badge } from "../../shared/components/ui/badge";

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const { data, isLoading, error } = useQuery<ProfessionalProfile[], Error>({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });

  const professionals = data ?? [];

  const specialties = useMemo(
    () => [
      "All",
      ...Array.from(new Set(professionals.map((profile) => profile.specialty))),
    ],
    [professionals],
  );

  const filteredProfessionals = useMemo(
    () =>
      professionals.filter((profile) => {
        const matchesSearch =
          profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.bio.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecialty =
          selectedSpecialty === "All" ||
          profile.specialty === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
      }),
    [professionals, searchQuery, selectedSpecialty],
  );

  return (
    <div className="space-y-8">
      <Card className="space-y-6">
        <CardHeader>
          <span className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Professionals
          </span>
          <CardTitle>Find a trusted expert</CardTitle>
          <CardDescription>
            Browse recommended coaches, therapists, and wellbeing professionals
            for confidential support.
          </CardDescription>
        </CardHeader>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <Input
            placeholder="Search by name, specialty, or expertise"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={
                  selectedSpecialty === specialty ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="animate-pulse">
              <CardContent className="space-y-4">
                <div className="h-6 rounded-full bg-slate-200" />
                <div className="h-4 rounded-full bg-slate-200 w-3/4" />
                <div className="h-3 rounded-full bg-slate-200 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          Unable to load professional profiles.
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600">
          No professionals found matching your search.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProfessionals.map((pro) => (
            <Card key={pro.id} className="h-full">
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {pro.name}
                    </h2>
                    <p className="mt-1 text-sm uppercase tracking-[0.24em] text-teal-700">
                      {pro.specialty}
                    </p>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <p className="text-slate-600">{pro.bio}</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="accent">Trusted expert</Badge>
                  <Badge variant="secondary">Confidential support</Badge>
                </div>
                <Button className="w-full mt-3">View profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
