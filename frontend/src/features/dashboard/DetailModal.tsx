import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Slider } from "../checkin/components/ChekinSlider";
import { parseISO, isToday } from "date-fns";
import type { CheckInDto } from "../checkin/types";
import { useCheckInQuestions } from "../checkin/hooks/useCheckInQuestions";

interface Props {
  selectedCheckIn: CheckInDto;
  editingResponses: Record<string, number>;
  setEditingResponses: (
    updater:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>),
  ) => void;
  editingNotes: string;
  setEditingNotes: (s: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function DetailModal({
  selectedCheckIn,
  editingResponses,
  setEditingResponses,
  editingNotes,
  setEditingNotes,
  onClose,
  onSave,
}: Props) {
  const { data: checkInQuestions } = useCheckInQuestions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-w-2xl w-full p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {new Date(selectedCheckIn.createdAt).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </CardTitle>
                <CardDescription>
                  {isToday(parseISO(selectedCheckIn.createdAt))
                    ? "Today's reflection"
                    : "Reflection"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <button onClick={onClose} className="text-sm text-slate-500">
                  Close
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {selectedCheckIn.responses.map((r) => (
                <div key={r.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.key}</div>
                    <div className="text-sm text-slate-500">
                      {(() => {
                        const question = checkInQuestions?.find(
                          (q) => q.key === r.key,
                        );
                        const currentValue = editingResponses[r.key] ?? r.value;
                        const emojiFromQuestion =
                          question?.emojis?.[Math.max(0, currentValue - 1)];
                        return (
                          (emojiFromQuestion ?? r.emoji ?? "") +
                          ` • ${currentValue}/5`
                        );
                      })()}
                    </div>
                  </div>

                  {isToday(parseISO(selectedCheckIn.createdAt)) ? (
                    <Slider
                      value={[editingResponses[r.key] ?? r.value]}
                      onValueChange={([v]) =>
                        setEditingResponses((prev) => ({
                          ...prev,
                          [r.key]: v,
                        }))
                      }
                      min={1}
                      max={5}
                      step={1}
                    />
                  ) : null}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Private notes
                </label>
                <textarea
                  className="mt-2 w-full rounded-lg border border-slate-200 p-3"
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  disabled={!isToday(parseISO(selectedCheckIn.createdAt))}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>

          <div className="p-4 flex justify-end gap-2">
            {isToday(parseISO(selectedCheckIn.createdAt)) ? (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onSave}>Save</Button>
              </>
            ) : (
              <Button onClick={onClose}>Close</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
