import type { ContentItem } from "../types";

export function getContentRecommendations(): Promise<ContentItem[]> {
  return Promise.resolve([
    {
      id: "1",
      category: "Resilience",
      title: "Three steps to reduce stress in high-pressure work",
      description:
        "A concise guide to staying calm and effective during busy days.",
    },
    {
      id: "2",
      category: "Focus",
      title: "Morning routines for more clarity",
      description:
        "Daily practices that help you start each workday with intention.",
    },
    {
      id: "3",
      category: "Team wellbeing",
      title: "How to make peer support part of your culture",
      description:
        "Practical advice for encouraging connection and psychological safety.",
    },
  ]);
}
