import { useQuery } from "@tanstack/react-query";
import { getDailyReading } from "../api/reading";
import type { ReadingItem } from "../types";

export function useDailyReading() {
  return useQuery<ReadingItem, Error>({
    queryKey: ["dailyReading"],
    queryFn: getDailyReading,
  });
}
