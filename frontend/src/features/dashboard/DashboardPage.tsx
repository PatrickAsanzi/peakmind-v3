import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarClock,
  HeartPulse,
  Lock,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isToday,
  parseISO,
  subDays,
} from "date-fns";
import { useAuth } from "../auth/hooks/useAuth";
import { apiFetch } from "../../shared/api";

interface RecentCheckIn {
  id: string;
  userId: string;
  notes: string;
  createdAt: string;
}

interface ParsedCheckIn extends RecentCheckIn {
  createdAtDate: Date;
  mood: string | null;
  note: string | null;
  energyScore: number | null;
  stressScore: number | null;
}

const moodScores: Record<string, number> = {
  calm: 4,
  motivated: 5,
  good: 4,
  grateful: 4,
  hopeful: 4,
  okay: 3,
  tired: 2,
  anxious: 2,
  stressed: 1,
  overwhelmed: 1,
  sad: 1,
};

const energyKeywords: Record<string, number> = {
  energized: 5,
  energetic: 5,
  motivated: 4,
  focused: 4,
  productive: 4,
  okay: 3,
  tired: 2,
  exhausted: 1,
  drained: 1,
  fatigued: 1,
};

const stressKeywords: Record<string, number> = {
  calm: 1,
  grounded: 1,
  relaxed: 1,
  okay: 2,
  focused: 2,
  anxious: 4,
  stressed: 5,
  overwhelmed: 5,
  burnt: 5,
  burned: 5,
};

function parseCheckInNotes(notes: string) {
  const moodMatch = notes.match(/Mood:\s*(.+)/i);
  const noteMatch = notes.match(/Note:\s*([\s\S]+)/i);

  const mood = moodMatch?.[1]?.trim() ?? null;
  const note = noteMatch?.[1]?.trim() ?? null;
  const normalizedText = `${mood ?? ""} ${note ?? ""} ${notes}`.toLowerCase();

  const energyScore = getKeywordScore(normalizedText, energyKeywords);
  const stressScore = getKeywordScore(normalizedText, stressKeywords);

  return {
    mood,
    note,
    energyScore,
    stressScore,
  };
}

function getKeywordScore(
  text: string,
  scoreMap: Record<string, number>,
): number | null {
  const matches = Object.entries(scoreMap)
    .filter(([keyword]) => text.includes(keyword))
    .map(([, score]) => score);

  if (!matches.length) {
    return null;
  }

  return average(matches);
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMetricValue(value: number | null, suffix = "/5") {
  if (value === null) {
    return "Not enough data";
  }

  return `${value.toFixed(1)}${suffix}`;
}

function describeScore(
  value: number | null,
  positiveLabels: [string, string, string],
  fallback: string,
) {
  if (value === null) {
    return fallback;
  }

  if (value >= 4) {
    return positiveLabels[0];
  }

  if (value >= 2.5) {
    return positiveLabels[1];
  }

  return positiveLabels[2];
}

export default function DashboardPage() {
  const { user } = useAuth();

  const recentCheckInsQuery = useQuery({
    queryKey: ["recent-checkins", user?.id],
    queryFn: () =>
      apiFetch<RecentCheckIn[]>(`/checkins/user/${user?.id}?days=14`),
    enabled: Boolean(user?.id),
  });

  const parsedCheckIns = useMemo<ParsedCheckIn[]>(() => {
    const items = recentCheckInsQuery.data ?? [];

    return items
      .map((item) => {
        const createdAtDate = parseISO(item.createdAt);
        const parsed = parseCheckInNotes(item.notes ?? "");

        return {
          ...item,
          createdAtDate,
          ...parsed,
        };
      })
      .filter((item) => !Number.isNaN(item.createdAtDate.getTime()));
  }, [recentCheckInsQuery.data]);

  const todayCheckIn = parsedCheckIns.find((item) => isToday(item.createdAtDate));
  const latestCheckIn = parsedCheckIns[0] ?? null;

  const metrics = useMemo(() => {
    const moodValues = parsedCheckIns
      .map((item) => {
        if (!item.mood) {
          return null;
        }

        return moodScores[item.mood.toLowerCase()] ?? null;
      })
      .filter((value): value is number => value !== null);

    const energyValues = parsedCheckIns
      .map((item) => item.energyScore)
      .filter((value): value is number => value !== null);

    const stressValues = parsedCheckIns
      .map((item) => item.stressScore)
      .filter((value): value is number => value !== null);

    return {
      averageMood: moodValues.length ? average(moodValues) : null,
      averageEnergy: energyValues.length ? average(energyValues) : null,
      averageStress: stressValues.length ? average(stressValues) : null,
    };
  }, [parsedCheckIns]);

  const streak = useMemo(() => {
    if (!parsedCheckIns.length) {
      return 0;
    }

    const uniqueDays = Array.from(
      new Set(parsedCheckIns.map((item) => format(item.createdAtDate, "yyyy-MM-dd"))),
    ).map((value) => parseISO(`${value}T00:00:00`));

    let currentStreak = 0;
    let cursor = todayCheckIn ? new Date() : subDays(new Date(), 1);

    for (const day of uniqueDays) {
      if (differenceInCalendarDays(cursor, day) === 0) {
        currentStreak += 1;
        cursor = subDays(cursor, 1);
      } else if (differenceInCalendarDays(cursor, day) > 0) {
        break;
      }
    }

    return currentStreak;
  }, [parsedCheckIns, todayCheckIn]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
      >
        <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 p-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                <Sparkles className="h-4 w-4" />
                Daily wellbeing snapshot
              </p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Welcome back, {firstName}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                Track how you have been feeling, review recent patterns, and take
                one small action to support your day.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                  Current streak
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {streak} day{streak === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                  Last reflection
                </p>
                <p className="mt-2 text-sm font-medium">
                  {latestCheckIn
                    ? formatDistanceToNow(latestCheckIn.createdAtDate, {
                        addSuffix: true,
                      })
                    : "No check-ins yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {!todayCheckIn ? (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-[2rem] border border-teal-100 bg-teal-50 p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
                Today's check-in
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                Take two minutes to log how you're feeling today
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A quick reflection helps you notice patterns early and build a
                more complete picture of your wellbeing over time.
              </p>
            </div>

            <Link
              to="/check-in"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Start today's check-in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      ) : (
        <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                You're checked in
              </p>
              <p className="mt-2 text-sm text-slate-700">
                You already completed today's reflection. Come back later if
                you want to review your recent notes.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <HeartPulse className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Avg mood
            </p>
          </div>
          <p className="mt-5 text-3xl font-semibold text-slate-900">
            {formatMetricValue(metrics.averageMood)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {describeScore(
              metrics.averageMood,
              ["Mostly positive", "Fairly steady", "Needs attention"],
              "Complete a few check-ins to see your mood trend.",
            )}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Energy proxy
            </p>
          </div>
          <p className="mt-5 text-3xl font-semibold text-slate-900">
            {formatMetricValue(metrics.averageEnergy)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {describeScore(
              metrics.averageEnergy,
              ["Energy seems strong", "Energy looks mixed", "Energy may be running low"],
              "We estimate energy from mood and note keywords when available.",
            )}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Stress proxy
            </p>
          </div>
          <p className="mt-5 text-3xl font-semibold text-slate-900">
            {formatMetricValue(metrics.averageStress)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {metrics.averageStress === null
              ? "Stress is estimated only when your check-ins include matching keywords."
              : metrics.averageStress >= 4
                ? "Recent language may suggest elevated stress."
                : metrics.averageStress >= 2.5
                  ? "Stress signals look moderate overall."
                  : "Recent entries suggest lower stress."}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Recent check-ins
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Your latest reflections
              </h2>
            </div>
            <Link
              to="/check-in"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              New check-in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            {recentCheckInsQuery.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-3xl border border-slate-200 p-5"
                  >
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : recentCheckInsQuery.isError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                We couldn't load your recent check-ins right now. Please try
                again in a moment.
              </div>
            ) : parsedCheckIns.length ? (
              <div className="space-y-4">
                {parsedCheckIns.slice(0, 5).map((checkIn) => (
                  <article
                    key={checkIn.id}
                    className="rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {checkIn.mood ? `Mood: ${checkIn.mood}` : "Daily reflection"}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          {format(checkIn.createdAtDate, "EEEE, MMM d")}
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {formatDistanceToNow(checkIn.createdAtDate, { addSuffix: true })}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {checkIn.note ?? checkIn.notes ?? "No additional notes provided."}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center">
                <CalendarClock className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No check-ins yet
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Start with your first daily reflection to unlock dashboard
                  insights and recent activity.
                </p>
                <Link
                  to="/check-in"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Complete your first check-in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Quick actions
            </p>
            <div className="mt-5 space-y-3">
              <Link
                to="/community"
                className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-slate-900"
              >
                Join the community feed
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                to="/professionals"
                className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-slate-900"
              >
                Find a professional
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                to="/content"
                className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-slate-900"
              >
                Explore guided content
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Suggested resources
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-0.5 h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Journaling prompt
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      What helped you feel most supported this week, and what do
                      you want more of tomorrow?
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <HeartPulse className="mt-0.5 h-5 w-5 text-rose-500" />
                  <div>
                    <p className="font-medium text-slate-900">Reset suggestion</p>
                    <p className="mt-1 text-sm text-slate-600">
                      If stress feels high, take a three-minute pause for slow
                      breathing or a short walk before your next task.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 text-teal-300" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                  Privacy
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Your reflections stay protected
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Check-ins are shown here to help you track patterns over time.
                  Keep sharing only what feels useful to you.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}