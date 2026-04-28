export interface CheckInPrompt {
  prompt: string;
  moodOptions: string[];
}

export interface CheckInQuestion {
  id: string;
  key: string;
  title: string;
  description: string;
  labels: string[];
  emojis: string[];
  color: string;
  inverse: boolean;
  optional: boolean;
  order: number;
  createdAt: string;
}

export interface CompleteCheckInPayload {
  mood: string;
  note: string;
  userId: string;
}

export interface CreateCheckInResponseDto {
  key: string;
  emoji: string;
  value: number;
}

export interface CreateCheckInDto {
  userId: string;
  notes: string;
  responses: CreateCheckInResponseDto[];
}

export interface CheckInResponseDto {
  id: string;
  key: string;
  emoji: string;
  value: number;
}

export interface CheckInDto {
  id: string;
  userId: string;
  notes: string;
  createdAt: string;
  responses: CheckInResponseDto[];
}

export interface CheckIn {
  id: string;
  userId: string;
  mood: string;
  notes: string;
  createdAt: string;
}
export interface RecentCheckIn {
  id: string;
  userId: string;
  mood: string;
  notes: string;
  createdAt: string;
}
