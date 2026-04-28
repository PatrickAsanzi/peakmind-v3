import { apiFetch } from "../shared/api";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  userName?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  mood: string;
  notes: string;
  createdAt: string;
}

export interface CheckInPrompt {
  prompt: string;
  moodOptions: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface ConsentStatus {
  given: boolean;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  specialty: string;
  bio: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  start: string;
  end: string;
}

export interface ReflectionPrompt {
  prompt: string;
}

export interface OrgDashboardSummary {
  activeTeams: number;
  averageMood: number;
  completionRate: number;
  upcomingSessions: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  startsAt: string;
  endsAt: string;
  title: string;
  createdAt: string;
}

export interface OrgInsight {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
}

export interface LeadershipFeedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  feedback: string;
  createdAt: string;
}

export function createCheckIn(payload: {
  userId: string;
  mood: string;
  notes: string;
}) {
  return apiFetch<string>("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCheckInById(id: string) {
  return apiFetch<CheckIn>(`/checkins/${id}`);
}

export function getCheckInPrompt(): Promise<CheckInPrompt> {
  return Promise.resolve({
    prompt:
      "Choose the mood that best describes how you feel right now, then add any note that will help your guide support you today.",
    moodOptions: ["Calm", "Stressed", "Motivated", "Overwhelmed"],
  });
}

export async function completeCheckIn(payload: {
  mood: string;
  note: string;
  userId: string;
}) {
  await createCheckIn({
    userId: payload.userId,
    mood: payload.mood,
    notes: payload.note,
  });
  return { success: true, nextPath: "/dashboard" };
}

export function getCommunityFeed(): Promise<CommunityPost[]> {
  return Promise.resolve([
    {
      id: "1",
      author: "Avery Johnson",
      message:
        "Just finished a quick breathing exercise before a client call — feeling grounded and ready.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      author: "Jordan Lee",
      message:
        "Shared a wellbeing check-in with my manager. Highly recommend keeping the conversation open.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    },
    {
      id: "3",
      author: "Morgan Smith",
      message:
        "Completed my first PeakMind reflection and discovered a better way to manage focus across meetings.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    },
  ]);
}

export function getConsentStatus(): Promise<ConsentStatus> {
  return Promise.resolve({
    given: true,
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toLocaleDateString(),
  });
}

export function getContentRecommendations(): Promise<ContentItem[]> {
  return Promise.resolve([
    {
      id: "1",
      category: "Resilience",
      title: "Three steps to reduce stress in high-pressure work",
      description:
        "A concise guide to staying calm and effective during busy days.",
    },
    {
      id: "2",
      category: "Focus",
      title: "Morning routines for more clarity",
      description:
        "Daily practices that help you start each workday with intention.",
    },
    {
      id: "3",
      category: "Team wellbeing",
      title: "How to make peer support part of your culture",
      description:
        "Practical advice for encouraging connection and psychological safety.",
    },
  ]);
}

export function getDailyReading(): Promise<ReadingItem> {
  return Promise.resolve({
    id: "daily-reading-1",
    title: "Pause before you react",
    summary:
      "A short reflection on taking space in the middle of pressure so you can choose a calmer response.",
    durationMinutes: 4,
  });
}

export function getMeditationSession(): Promise<MeditationSession> {
  return Promise.resolve({
    id: "meditation-1",
    title: "Grounding morning practice",
    description:
      "A 10-minute guided session to center your attention and set a positive intention for the day.",
    durationMinutes: 10,
  });
}

export function getProfessionals(): Promise<ProfessionalProfile[]> {
  return Promise.resolve([
    {
      id: "pro-1",
      name: "Dr. Maya Patel",
      specialty: "Executive coaching",
      bio: "Helps leaders build resilience and sustain high performance with compassion.",
    },
    {
      id: "pro-2",
      name: "Sam Chen",
      specialty: "Team wellbeing",
      bio: "Supports managers and teams through stress reduction and communication coaching.",
    },
  ]);
}

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

export function getFridayReflection(): Promise<ReflectionPrompt> {
  return Promise.resolve({
    prompt:
      "What were the most meaningful moments this week, and what do you want to carry forward into next week?",
  });
}

export function getOrgDashboardSummary(): Promise<OrgDashboardSummary> {
  return Promise.resolve({
    activeTeams: 12,
    averageMood: 78,
    completionRate: 87,
    upcomingSessions: 5,
  });
}

export function createCommunity(payload: {
  name: string;
  description: string;
}) {
  return apiFetch<string>("/communities", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCommunityById(id: string) {
  return apiFetch<CommunityGroup>(`/communities/${id}`);
}

export function createArticle(payload: { title: string; content: string }) {
  return apiFetch<string>("/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getArticleById(id: string) {
  return apiFetch<Article>(`/articles/${id}`);
}

export function createAppointment(payload: {
  userId: string;
  startsAt: string;
  endsAt: string;
  title: string;
}) {
  return apiFetch<string>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAppointmentById(id: string) {
  return apiFetch<Appointment>(`/appointments/${id}`);
}

export function createOrgInsight(payload: { title: string; summary: string }) {
  return apiFetch<string>("/org-insights", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrgInsightById(id: string) {
  return apiFetch<OrgInsight>(`/org-insights/${id}`);
}

export function createLeadershipFeedback(payload: {
  fromUserId: string;
  toUserId: string;
  feedback: string;
}) {
  return apiFetch<string>("/leadership-feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLeadershipFeedbackById(id: string) {
  return apiFetch<LeadershipFeedback>(`/leadership-feedback/${id}`);
}
