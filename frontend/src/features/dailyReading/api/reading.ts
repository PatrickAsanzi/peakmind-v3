import type { ReadingItem } from "../types";

export function getDailyReading(): Promise<ReadingItem> {
  return Promise.resolve({
    id: "daily-reading-1",
    title: "Pause before you react",
    summary:
      "A short reflection on taking space in the middle of pressure so you can choose a calmer response.",
    durationMinutes: 4,
  });
}
