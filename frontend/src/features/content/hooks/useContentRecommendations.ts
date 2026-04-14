import { useQuery } from "@tanstack/react-query";
import { getContentRecommendations } from "../api/content";
import type { ContentItem } from "../types";

export function useContentRecommendations() {
  return useQuery<ContentItem[], Error>({
    queryKey: ["contentRecommendations"],
    queryFn: getContentRecommendations,
  });
}
