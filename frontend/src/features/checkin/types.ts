export interface CheckInPrompt {
  prompt: string;
  moodOptions: string[];
}

export interface CompleteCheckInPayload {
  mood: string;
  note: string;
  userId: string;
}
