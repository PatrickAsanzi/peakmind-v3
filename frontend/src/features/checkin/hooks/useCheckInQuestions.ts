import { useQuery } from "@tanstack/react-query";
import { getCheckInQuestions } from "../api/checkin";
import type { CheckInQuestion } from "../types";

export function useCheckInQuestions() {
  return useQuery<CheckInQuestion[], Error>({
    queryKey: ["checkInQuestions"],
    queryFn: getCheckInQuestions,
  });
}
