import type { ConsentStatus } from "../types";

export function getConsentStatus(): Promise<ConsentStatus> {
  return Promise.resolve({
    given: true,
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toLocaleDateString(),
  });
}
