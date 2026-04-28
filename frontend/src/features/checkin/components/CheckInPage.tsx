import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCheckInQuestions } from "../hooks/useCheckInQuestions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui";
import { Slider } from "./ChekinSlider";
import { createCheckIn } from "../api/checkin";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Shield,
  Heart,
  Brain,
  Zap,
  Briefcase,
  Users,
  Moon,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { toast } from "sonner";

interface CheckInData {
  mood: number;
  stress: number;
  energy: number;
  workload_pressure: number;
  work_satisfaction: number;
  belonging: number;
  sleep_quality: number;
  private_notes: string;
}

export default function CheckInPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { data: backendQuestions, isLoading } = useCheckInQuestions();

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CheckInData>({
    mood: 3,
    stress: 3,
    energy: 3,
    workload_pressure: 3,
    work_satisfaction: 3,
    belonging: 3,
    sleep_quality: 3,
    private_notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, isAuthLoading, navigate]);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Build responses array matching backend DTO
      const responses = questions.map((q) => {
        const value = data[
          q.key as keyof Omit<CheckInData, "private_notes">
        ] as number;
        const emoji = q.emojis?.[value - 1] ?? "";
        return {
          key: q.key,
          emoji,
          value,
        };
      });

      await createCheckIn({
        userId: user.id,
        notes: data.private_notes,
        responses,
      });

      toast.success("Check-in complete! ✨", {
        description: "Your wellbeing data has been recorded privately.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting check-in:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  // Create question objects with proper structure for rendering
  const iconMap: Record<string, React.ComponentType<any>> = {
    mood: Heart,
    stress: Brain,
    energy: Zap,
    workload_pressure: Briefcase,
    work_satisfaction: Briefcase,
    belonging: Users,
    sleep_quality: Moon,
  };

  const questions =
    backendQuestions?.map((q) => ({
      ...q,
      icon: iconMap[q.key] ?? Heart,
    })) || [];

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isNotesStep = currentStep === questions.length;

  if (isAuthLoading || !user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Exit</span>
        </Link>
        {/* Progress indicator */}
        <div className="flex items-center gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i <= currentStep ? "bg-teal-700" : "bg-slate-300"
              }`}
            />
          ))}
          <div
            className={`h-1.5 w-6 rounded-full transition-colors ${
              isNotesStep ? "bg-teal-700" : "bg-slate-300"
            }`}
          />
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {!isNotesStep ? (
              currentQuestion && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-2">
                      <div
                        className={`w-14 h-14 rounded-2xl ${currentQuestion.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <currentQuestion.icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="text-xl">
                        {currentQuestion.title}
                      </CardTitle>
                      <CardDescription>
                        {currentQuestion.description}
                      </CardDescription>
                      {currentQuestion.optional && (
                        <span className="text-xs text-slate-500 mt-1">
                          (Optional)
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="pt-6 pb-8">
                      {/* Emoji display */}
                      <div className="text-center mb-8">
                        <span className="text-6xl">
                          {
                            currentQuestion.emojis[
                              data[
                                currentQuestion.key as keyof Omit<
                                  CheckInData,
                                  "private_notes"
                                >
                              ] - 1
                            ]
                          }
                        </span>
                        <p className="text-lg font-medium text-slate-900 mt-2">
                          {
                            currentQuestion.labels[
                              data[
                                currentQuestion.key as keyof Omit<
                                  CheckInData,
                                  "private_notes"
                                >
                              ] - 1
                            ]
                          }
                        </p>
                      </div>

                      {/* Slider */}
                      <div className="px-4">
                        <Slider
                          value={[
                            data[
                              currentQuestion.key as keyof Omit<
                                CheckInData,
                                "private_notes"
                              >
                            ],
                          ]}
                          onValueChange={([value]) =>
                            setData({
                              ...data,
                              [currentQuestion.key]: value,
                            })
                          }
                          min={1}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                          <span>{currentQuestion.labels[0]}</span>
                          <span>{currentQuestion.labels[4]}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ) : (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">
                      Anything else on your mind?
                    </CardTitle>
                    <CardDescription>
                      This is completely private and never shared with anyone
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <textarea
                      placeholder="Write anything that's weighing on you... (optional)"
                      value={data.private_notes}
                      onChange={(e) =>
                        setData({
                          ...data,
                          private_notes: e.target.value,
                        })
                      }
                      className="w-full min-h-[120px] resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                    <div className="mt-4 p-3 bg-slate-100 rounded-lg flex items-start gap-3">
                      <Shield className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600">
                        <strong>100% Private:</strong> These notes are encrypted
                        and only visible to you.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {!isNotesStep ? (
              <Button
                size="lg"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 bg-teal-700 hover:bg-teal-600"
              >
                {isLastQuestion ? "Almost done" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-teal-700 hover:bg-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Check-in
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get icons based on question key
function getIconForQuestion(key: string) {
  const iconMap: Record<string, React.ComponentType> = {
    mood: Heart,
    stress: Brain,
    energy: Zap,
    workload_pressure: Briefcase,
    work_satisfaction: Briefcase,
    belonging: Users,
    sleep_quality: Moon,
  };

  return iconMap[key] || Heart;
}
