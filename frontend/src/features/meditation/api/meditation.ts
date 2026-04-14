import type { MeditationSession } from "../types";

export function getMeditationSession(): Promise<MeditationSession> {
  return Promise.resolve({
    id: "meditation-1",
    title: "Grounding morning practice",
    description:
      "A 10-minute guided session to center your attention and set a positive intention for the day.",
    durationMinutes: 10,
  });
}
