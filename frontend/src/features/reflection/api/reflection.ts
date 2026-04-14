import type { ReflectionPrompt } from "../types";

export function getFridayReflection(): Promise<ReflectionPrompt> {
  return Promise.resolve({
    prompt:
      "What were the most meaningful moments this week, and what do you want to carry forward into next week?",
  });
}
