export interface CheckInPrompt {
  prompt: string;
  moodOptions: string[];
}

export interface CompleteCheckInPayload {
  mood: string;
  note: string;
  userId: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  notes: string;
  createdAt: string;
}
export interface RecentCheckIn {
  id: string;
  userId: string;
  notes: string;
  createdAt: string;
}
