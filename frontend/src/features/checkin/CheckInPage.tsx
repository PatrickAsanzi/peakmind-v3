import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCheckInPrompt } from "./hooks/useCheckInPrompt";
import { useCompleteCheckIn } from "./hooks/useCompleteCheckIn";

export default function CheckInPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useCheckInPrompt();
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const mutation = useCompleteCheckIn();

  return (
    <div className="space-y-8">
      <section className="section-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-teal-700">
            Daily check-in
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            How are you feeling today?
          </h1>
          <p className="text-slate-600">
            Share a quick mood update and a note to help PeakMind personalize
            your wellbeing plan.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="section-card text-slate-500">
          Loading check-in prompt…
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!user) return;
            mutation.mutate({ mood, note, userId: user.id });
          }}
          className="space-y-6"
        >
          <div className="section-card">
            <p className="text-sm text-slate-500">{data?.prompt}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {data?.moodOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMood(option)}
                  className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                    mood === option
                      ? "border-teal-700 bg-teal-50 text-teal-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="section-card">
            <label className="block text-sm font-medium text-slate-700">
              Notes for your guide
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Optional note for your check-in"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                rows={5}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !mood}
            className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending ? "Submitting…" : "Submit check-in"}
          </button>
        </form>
      )}
    </div>
  );
}
