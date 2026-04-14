import type { CalendarEvent } from "../types";

export function getCalendarEvents(): Promise<CalendarEvent[]> {
  return Promise.resolve([
    {
      id: "event-1",
      title: "Weekly check-in",
      type: "Wellness session",
      start: new Date(Date.now() + 3600 * 1000 * 3).toISOString(),
      end: new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
    },
    {
      id: "event-2",
      title: "Leader reflection prep",
      type: "Planning",
      start: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
      end: new Date(Date.now() + 3600 * 1000 * 25).toISOString(),
    },
  ]);
}
