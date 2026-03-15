"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assessmentsApi } from "@/lib/api";

type Question = {
  id: number;
  question_key: string;
  question_text: string;
  question_type: string;
  category: string;
  help_text: string | null;
  options?: Array<{ value: string; label: string }>;
};

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    assessmentsApi
      .getQuestions(id)
      .then((r) => setQuestions(r.questions))
      .catch(() => setError("Failed to load questions"))
      .finally(() => setLoading(false));
  }, [id]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    setSubmitting(true);
    setError(null);
    try {
      await assessmentsApi.submitAnswer(id, currentQuestion.id, answers[currentQuestion.id]);
      if (currentIndex === questions.length - 1) {
        await assessmentsApi.complete(id);
        router.push(`/assessments/${id}/results`);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading assessment...</p>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/assessments/new")}>
          Start Over
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full bg-emerald-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">{currentQuestion.question_text}</CardTitle>
            {currentQuestion.help_text && (
              <CardDescription>{currentQuestion.help_text}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.question_type === "yes_no" && (
              <div className="flex gap-4">
                {["yes", "no"].map((v) => (
                  <Button
                    key={v}
                    variant={answers[currentQuestion.id] === v ? "default" : "outline"}
                    className={answers[currentQuestion.id] === v ? "bg-emerald-600" : ""}
                    onClick={() => handleAnswer(v)}
                  >
                    {v === "yes" ? "Yes" : "No"}
                  </Button>
                ))}
              </div>
            )}
            {currentQuestion.question_type === "single_choice" && currentQuestion.options && (
              <div className="space-y-2" role="radiogroup" aria-label={currentQuestion.question_text}>
                {currentQuestion.options.map((opt, i) => (
                  <label
                    key={`${currentQuestion.id}-${i}-${opt.label}`}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[currentQuestion.id] === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={opt.value}
                      checked={answers[currentQuestion.id] === opt.value}
                      onChange={() => handleAnswer(opt.value)}
                      className="sr-only"
                    />
                    <span className="text-slate-900">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] || submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? "Saving..." : currentIndex === questions.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
