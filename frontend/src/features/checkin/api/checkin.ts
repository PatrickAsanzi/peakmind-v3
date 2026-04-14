import { apiFetch } from "@/shared/api";
import type { CompleteCheckInPayload } from "../types";

export function getCheckInPrompt() {
  return Promise.resolve({
    prompt:
      "Choose the mood that best describes how you feel right now, then add any note that will help your guide support you today.",
    moodOptions: ["Calm", "Stressed", "Motivated", "Overwhelmed"],
  });
}

export function createCheckIn(payload: { userId: string; notes: string }) {
  return apiFetch<string>("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function completeCheckIn(payload: CompleteCheckInPayload) {
  await createCheckIn({
    userId: payload.userId,
    notes: `Mood: ${payload.mood}${payload.note ? `\nNote: ${payload.note}` : ""}`,
  });
  return { success: true, nextPath: "/dashboard" };
}
