import { apiFetch } from "../../../shared/api";
import type {
  CompleteCheckInPayload,
  CheckInQuestion,
  CreateCheckInDto,
  CheckInDto,
} from "../types";

export function getCheckInPrompt() {
  return Promise.resolve({
    prompt:
      "Choose the mood that best describes how you feel right now, then add any note that will help your guide support you today.",
    moodOptions: ["😌", "😟", "🔥", "😵"],
  });
}

export function getCheckInQuestions() {
  return apiFetch<CheckInQuestion[]>("/checkin-questions");
}

export function createCheckIn(payload: CreateCheckInDto) {
  return apiFetch<string>("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function completeCheckIn(payload: CompleteCheckInPayload) {
  const dto: CreateCheckInDto = {
    userId: payload.userId,
    notes: payload.note,
    responses: [],
  };
  await createCheckIn(dto);
  return { success: true, nextPath: "/dashboard" };
}

export function getUserCheckIns(userId: string, days?: number) {
  const params = days ? `?days=${days}` : "";
  return apiFetch<CheckInDto[]>(`/checkins/user/${userId}${params}`);
}

export function updateCheckIn(id: string, dto: CreateCheckInDto) {
  return apiFetch<boolean>(`/checkins/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}
