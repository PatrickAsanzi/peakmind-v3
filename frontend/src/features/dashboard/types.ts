import type { CheckInDto } from "../checkin/types";

export interface ParsedCheckIn extends Omit<CheckInDto, "createdAt"> {
  createdAtDate: Date;
  mood: string | null;
  note: string | null;
  energyScore: number | null;
  stressScore: number | null;
}
