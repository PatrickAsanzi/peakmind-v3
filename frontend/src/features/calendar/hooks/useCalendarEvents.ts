import { useQuery } from "@tanstack/react-query";
import { getCalendarEvents } from "../api/calendar";
import type { CalendarEvent } from "../types";

export function useCalendarEvents() {
  return useQuery<CalendarEvent[], Error>({
    queryKey: ["calendarEvents"],
    queryFn: getCalendarEvents,
  });
}
