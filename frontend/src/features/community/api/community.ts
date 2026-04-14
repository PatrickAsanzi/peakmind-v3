import type { CommunityPost } from "../types";

export function getCommunityFeed(): Promise<CommunityPost[]> {
  return Promise.resolve([
    {
      id: "1",
      author: "Avery Johnson",
      message:
        "Just finished a quick breathing exercise before a client call — feeling grounded and ready.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      author: "Jordan Lee",
      message:
        "Shared a wellbeing check-in with my manager. Highly recommend keeping the conversation open.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
    {
      id: "3",
      author: "Morgan Smith",
      message:
        "Completed my first PeakMind reflection and discovered a better way to manage focus across meetings.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    },
  ]);
}
