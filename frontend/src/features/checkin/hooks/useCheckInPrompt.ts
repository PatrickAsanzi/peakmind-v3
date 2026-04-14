import { useQuery } from "@tanstack/react-query";
import { getCheckInPrompt } from "../api/checkin";
import type { CheckInPrompt } from "../types";

export function useCheckInPrompt() {
  return useQuery<CheckInPrompt, Error>({
    queryKey: ["checkInPrompt"],
    queryFn: getCheckInPrompt,
  });
}
