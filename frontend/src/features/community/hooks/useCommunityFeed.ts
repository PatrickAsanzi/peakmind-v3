import { useQuery } from "@tanstack/react-query";
import { getCommunityFeed } from "../api/community";
import type { CommunityPost } from "../types";

export function useCommunityFeed() {
  return useQuery<CommunityPost[], Error>({
    queryKey: ["communityFeed"],
    queryFn: getCommunityFeed,
  });
}
