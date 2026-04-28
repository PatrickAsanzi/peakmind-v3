import { apiFetch } from "../../../shared/api";

export interface DashboardMetricDto {
  key: string;
  values: number[];
  average: number | null;
}

export function getDashboardMetric(userId: string, filter: string) {
  const params = new URLSearchParams({ userId, filter });
  return apiFetch<DashboardMetricDto>(
    `/dashboard/metrics?${params.toString()}`,
  );
}
