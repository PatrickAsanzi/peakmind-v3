import type { RecentCheckIn } from "../checkin/types";

export interface ParsedCheckIn extends RecentCheckIn {
  createdAtDate: Date;
  mood: string | null;
  note: string | null;
  energyScore: number | null;
  stressScore: number | null;
}
