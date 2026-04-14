import { useQuery } from "@tanstack/react-query";
import { getMeditationSession } from "../api/meditation";
import type { MeditationSession } from "../types";

export function useMeditationSession() {
  return useQuery<MeditationSession, Error>({
    queryKey: ["morningMeditation"],
    queryFn: getMeditationSession,
  });
}
