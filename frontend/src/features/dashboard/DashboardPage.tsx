import { useMemo, useState } from "react";
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
import DetailModal from "./DetailModal";
import { useCheckInQuestions } from "../checkin/hooks/useCheckInQuestions";
import { getDashboardMetric } from "./api/dashboard";
import type { ParsedCheckIn } from "../dashboard/types";
import type { CheckInDto, CheckInResponseDto } from "../checkin/types";
import { updateCheckIn } from "../checkin/api/checkin";
import { getUserCheckIns } from "../checkin/api/checkin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Slider } from "../checkin/components/ChekinSlider";

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
  const { data: checkInQuestions } = useCheckInQuestions();

  const recentCheckInsQuery = useQuery({
    queryKey: ["recent-checkins", user?.id],
    queryFn: () => getUserCheckIns(user!.id, 14),
    enabled: Boolean(user?.id),
  });

  const parsedCheckIns = useMemo<ParsedCheckIn[]>(() => {
    const items: CheckInDto[] = recentCheckInsQuery.data ?? [];

    return items
      .map((item) => {
        const createdAtDate = parseISO(item.createdAt);

        const getResponse = (key: string) =>
          item.responses?.find((r) => r.key === key) as
            | CheckInResponseDto
            | undefined;

        const moodResp = getResponse("mood");
        const energyResp = getResponse("energy");
        const stressResp = getResponse("stress");

        return {
          ...item,
          createdAtDate,
          mood: moodResp ? moodResp.emoji || String(moodResp.value) : null,
          note: item.notes ?? null,
          energyScore: energyResp ? energyResp.value : null,
          stressScore: stressResp ? stressResp.value : null,
        };
      })
      .filter((item) => !Number.isNaN(item.createdAtDate.getTime()));
  }, [recentCheckInsQuery.data]);

  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInDto | null>(
    null,
  );
  const [editingResponses, setEditingResponses] = useState<
    Record<string, number>
  >({});
  const [editingNotes, setEditingNotes] = useState<string>("");

  const openCheckIn = (item: CheckInDto) => {
    setSelectedCheckIn(item);
    const initial: Record<string, number> = {};
    item.responses?.forEach((r) => (initial[r.key] = r.value));
    setEditingResponses(initial);
    setEditingNotes(item.notes ?? "");
  };

  const closeCheckIn = () => {
    setSelectedCheckIn(null);
    setEditingResponses({});
    setEditingNotes("");
  };

  const saveCheckIn = async () => {
    if (!selectedCheckIn || !user) return;
    // Build DTO — compute emoji from question options based on updated value
    // fall back to existing response emoji when question options are unavailable
    const dto = {
      userId: user.id,
      notes: editingNotes,
      responses: Object.entries(editingResponses).map(([key, value]) => {
        const question = checkInQuestions?.find((q) => q.key === key);
        const emojiFromQuestion = question?.emojis?.[Math.max(0, value - 1)];
        const existingEmoji =
          selectedCheckIn.responses.find((r) => r.key === key)?.emoji ?? "";
        return {
          key,
          emoji: emojiFromQuestion ?? existingEmoji,
          value,
        };
      }),
    };

    try {
      const success = await updateCheckIn(selectedCheckIn.id, dto);

      if (success) {
        window.location.reload();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update check-in");
    }
  };

  const todayCheckIn = parsedCheckIns.find((item) =>
    isToday(item.createdAtDate),
  );
  const latestCheckIn = parsedCheckIns[0] ?? null;

  const moodMetricQuery = useQuery({
    queryKey: ["dashboard-metric", user?.id, "mood"],
    queryFn: () => getDashboardMetric(user!.id, "mood"),
    enabled: Boolean(user?.id),
  });

  const energyMetricQuery = useQuery({
    queryKey: ["dashboard-metric", user?.id, "energy"],
    queryFn: () => getDashboardMetric(user!.id, "energy"),
    enabled: Boolean(user?.id),
  });

  const stressMetricQuery = useQuery({
    queryKey: ["dashboard-metric", user?.id, "stress"],
    queryFn: () => getDashboardMetric(user!.id, "stress"),
    enabled: Boolean(user?.id),
  });

  const metrics = {
    averageMood: moodMetricQuery.data?.average ?? null,
    averageEnergy: energyMetricQuery.data?.average ?? null,
    averageStress: stressMetricQuery.data?.average ?? null,
  };

  const streak = useMemo(() => {
    if (!parsedCheckIns.length) {
      return 0;
    }

    const uniqueDays = Array.from(
      new Set(
        parsedCheckIns.map((item) => format(item.createdAtDate, "yyyy-MM-dd")),
      ),
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
      {/* Hero banner — kept as a raw div since it has a custom gradient header treatment that Card doesn't model */}
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
                Track how you have been feeling, review recent patterns, and
                take one small action to support your day.
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

      {/* Check-in CTA / already checked in */}
      {!todayCheckIn ? (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="border-teal-100 bg-teal-50 p-6 shadow-sm">
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
          </Card>
        </motion.section>
      ) : (
        <Card className="border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                You're checked in
              </p>
              <p className="mt-2 text-sm text-slate-700">
                You already completed today's reflection. You can now review
                your recent check-ins.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Metric cards */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 shadow-sm">
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
        </Card>

        <Card className="p-6 shadow-sm">
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
              [
                "Energy seems strong",
                "Energy looks mixed",
                "Energy may be running low",
              ],
              "We estimate energy from mood and note keywords when available.",
            )}
          </p>
        </Card>

        <Card className="p-6 shadow-sm">
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
        </Card>
      </section>

      {/* Recent check-ins + sidebar */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-6 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Recent check-ins
                </p>
                <CardTitle className="mt-2 text-2xl">
                  Your latest reflections
                </CardTitle>
              </div>
              {todayCheckIn ? (
                <span className="text-sm text-muted-foreground">
                  ✅ Today's check-in completed
                </span>
              ) : (
                <Link
                  to="/check-in"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  New check-in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </CardHeader>

          <CardContent className="mt-6">
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
                    onClick={() => {
                      const raw = (recentCheckInsQuery.data ?? []).find(
                        (r) => r.id === checkIn.id,
                      );
                      if (raw) openCheckIn(raw as CheckInDto);
                    }}
                    className="cursor-pointer rounded-3xl border border-slate-200 p-5 transition hover:border-teal-200 hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {checkIn.mood
                            ? `Mood: ${checkIn.mood}`
                            : "Daily reflection"}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          {format(checkIn.createdAtDate, "EEEE, MMM d")}
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {formatDistanceToNow(checkIn.createdAtDate, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </article>
                ))}
                {/* Detail modal / slide-over */}
                {selectedCheckIn ? (
                  <DetailModal
                    selectedCheckIn={selectedCheckIn}
                    editingResponses={editingResponses}
                    setEditingResponses={setEditingResponses}
                    editingNotes={editingNotes}
                    setEditingNotes={setEditingNotes}
                    onClose={closeCheckIn}
                    onSave={saveCheckIn}
                  />
                ) : null}
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
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="p-6 shadow-sm">
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Quick actions
              </p>
            </CardHeader>
            <CardContent className="mt-5 space-y-3">
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
            </CardContent>
          </Card>

          {/* Suggested resources */}
          <Card className="p-6 shadow-sm">
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Suggested resources
              </p>
            </CardHeader>
            <CardContent className="mt-5 space-y-4">
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
                    <p className="font-medium text-slate-900">
                      Reset suggestion
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      If stress feels high, take a three-minute pause for slow
                      breathing or a short walk before your next task.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-slate-950 p-6 text-white shadow-sm">
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
          </Card>
        </div>
      </section>
    </div>
  );
}
