import { useMemo, useState } from "react";
import { useContentRecommendations } from "./hooks/useContentRecommendations";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Badge } from "../../shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/components/ui";

export default function ContentPage() {
  const { data, isLoading, error } = useContentRecommendations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...(data ? Array.from(new Set(data.map((item) => item.category))) : []),
    ],
    [data],
  );

  const filteredContent = useMemo(
    () =>
      data?.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      }) ?? [],
    [data, searchQuery, selectedCategory],
  );

  return (
    <div className="space-y-8">
      <Card className="space-y-6">
        <CardHeader>
          <span className="text-sm uppercase tracking-[0.24em] text-teal-700">
            On-demand learning
          </span>
          <CardTitle>Recommended wellbeing resources</CardTitle>
          <CardDescription>
            Curated content for your current focus, including stress management,
            resilience, and team wellbeing.
          </CardDescription>
          <h2 className="text-2xl font-semibold text-slate-900">
            Discover the best content for your current goals.
          </h2>
          <p className="text-slate-600">
            Filter by category, search by topic, and browse concise resources
            built for fast learning and better wellbeing.
          </p>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <div className="min-w-0">
            <Input
              placeholder="Search resources, topics, or insights"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="animate-pulse">
              <CardContent className="space-y-4">
                <div className="h-5 w-3/4 rounded-full bg-slate-200" />
                <div className="h-4 rounded-full bg-slate-200" />
                <div className="h-4 rounded-full bg-slate-200 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          Unable to load content recommendations.
        </div>
      ) : filteredContent.length === 0 ? (
        <Card className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600">
          No matching resources found. Try a different search or category.
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredContent.map((item) => (
            <Card key={item.id} className="h-full">
              <CardContent className="space-y-4">
                <Badge variant="accent">{item.category}</Badge>
                <h2 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="text-slate-600 line-clamp-4">
                  {item.description}
                </p>
                <Button className="mt-2">Read resource</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
