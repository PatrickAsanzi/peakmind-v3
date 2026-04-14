import { useQuery } from "@tanstack/react-query";
import { getConsentStatus } from "../api/consent";
import type { ConsentStatus } from "../types";

export function useConsentStatus() {
  return useQuery<ConsentStatus, Error>({
    queryKey: ["consentStatus"],
    queryFn: getConsentStatus,
  });
}
