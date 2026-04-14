import { useMutation } from "@tanstack/react-query";
import { completeCheckIn } from "../api/checkin";
import type { CompleteCheckInPayload } from "../types";

export function useCompleteCheckIn() {
  return useMutation<
    { success: boolean; nextPath?: string },
    Error,
    CompleteCheckInPayload
  >({
    mutationFn: completeCheckIn,
  });
}
