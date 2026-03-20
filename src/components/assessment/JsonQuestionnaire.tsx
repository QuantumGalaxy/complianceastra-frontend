"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import type { Questionnaire, QuestionnaireItem, QuestionnaireSection, QuestionnaireAnswersMap } from "@/lib/questionnaire-types";
import { OPTION_TO_VALUE, CCW_HELPER_TEXT } from "@/lib/questionnaire-types";

type JsonQuestionnaireProps = {
  questionnaire: Questionnaire;
  state: QuestionnaireAnswersMap;
  onChange: (next: QuestionnaireAnswersMap) => void;
  onComplete: () => void;
  /** Return to PCI eligibility wizard (same assessment session; avoids browser back to /assessments/new). */
  onBackToEligibility?: () => void;
};

/** Flatten sections into ordered items with section context */
function flattenItems(questionnaire: Questionnaire): { item: QuestionnaireItem; section: QuestionnaireSection }[] {
  const sections = [...questionnaire.sections].sort((a, b) => a.section_order - b.section_order);
  const result: { item: QuestionnaireItem; section: QuestionnaireSection }[] = [];
  for (const section of sections) {
    const items = [...section.items].sort(
      (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
    );
    for (const item of items) {
      result.push({ item, section });
    }
  }
  return result;
}

type AnswerValue = "in_place" | "in_place_ccw" | "not_applicable" | "action_needed";

function optionToValue(opt: string): AnswerValue | null {
  const v = OPTION_TO_VALUE[opt];
  return v ?? null;
}


export function JsonQuestionnaire({
  questionnaire,
  state,
  onChange,
  onComplete,
  onBackToEligibility,
}: JsonQuestionnaireProps) {
  const flat = useMemo(() => flattenItems(questionnaire), [questionnaire]);
  const total = flat.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = flat[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const currentState = current ? state[current.item.id] : undefined;
  const currentAnswer = currentState?.answer ?? null;
  const currentNotes = currentState?.notes ?? "";
  const currentCcw = currentState?.ccw_explanation ?? "";

  const handleAnswerChange = (value: AnswerValue) => {
    if (!current) return;
    onChange({
      ...state,
      [current.item.id]: {
        answer: value,
        notes: currentNotes,
        ccw_explanation: value === "in_place_ccw" ? currentCcw : undefined,
      },
    });
  };

  const handleNotesChange = (notes: string) => {
    if (!current) return;
    onChange({
      ...state,
      [current.item.id]: {
        answer: currentAnswer,
        notes,
        ccw_explanation: currentAnswer === "in_place_ccw" ? currentCcw : undefined,
      },
    });
  };

  const handleCcwChange = (ccw_explanation: string) => {
    if (!current) return;
    onChange({
      ...state,
      [current.item.id]: {
        answer: currentAnswer,
        notes: currentNotes,
        ccw_explanation: ccw_explanation || undefined,
      },
    });
  };

  const handleBack = () => {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const answeredCount = Object.values(state).filter((s) => s.answer != null).length;
  const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0;

  const isCcwSelected = currentAnswer === "in_place_ccw";
  const ccwRequiredButEmpty = isCcwSelected && !currentCcw.trim();
  const hasAnswer = currentAnswer != null;
  const canProceed = hasAnswer && !ccwRequiredButEmpty;

  if (!current) {
    return null;
  }

  const options = current.item.options.map((opt) => ({
    value: optionToValue(opt) ?? (opt.toLowerCase().replace(/\s+/g, "_") as AnswerValue),
    label: opt,
    isAdvanced: opt === "In Place with CCW",
  }));

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div
          className="h-2 rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-slate-600">
          Question <span className="font-semibold text-slate-900">{currentIndex + 1} of {total}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-slate-500">{current.section.section_title}</span>
        </p>
      </div>

      {/* Question card */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-start gap-3">
            {current.item.show_requirement_id !== false && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                PCI Ref: {current.item.id}
              </span>
            )}
            <div className="flex-1">
              <CardTitle className="text-slate-900">{current.item.question}</CardTitle>
            </div>
          </div>
          {current.item.help_text && (
            <div className="mt-3 inline-flex items-start gap-2 text-xs text-slate-500">
              <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" aria-hidden />
              <span>{current.item.help_text}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2" role="radiogroup" aria-label={current.item.question}>
            {options.map((opt) => {
              const selected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswerChange(opt.value as AnswerValue)}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                    selected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{opt.label}</span>
                    <span className="flex items-center gap-2">
                      {opt.isAdvanced && (
                        <span
                          className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                          title={CCW_HELPER_TEXT}
                        >
                          Advanced
                        </span>
                      )}
                      {selected && (
                        <span className="text-xs font-semibold text-emerald-700">Selected</span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {isCcwSelected && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">{CCW_HELPER_TEXT}</p>
              <label className="text-xs font-medium text-slate-600">
                Describe your compensating control <span className="text-rose-500">*</span>
              </label>
              <Textarea
                value={currentCcw}
                onChange={(e) => handleCcwChange(e.target.value)}
                className={`min-h-[80px] text-sm ${ccwRequiredButEmpty ? "border-rose-300" : ""}`}
                placeholder="Explain how your alternative control meets the requirement..."
                required
              />
              {ccwRequiredButEmpty && (
                <p className="text-xs text-rose-600">
                  Please describe your compensating control before continuing.
                </p>
              )}
            </div>
          )}

          {current.item.allow_note && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-xs font-medium text-slate-600">
                Evidence / notes (optional)
              </label>
              <Textarea
                value={currentNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[80px] text-sm"
                placeholder="Where is this control documented or implemented?"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation — Back = previous requirement; “Eligibility” returns to PCI wizard in this session */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isFirst}
            aria-disabled={isFirst}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {onBackToEligibility && (
            <Button
              type="button"
              variant="ghost"
              className="h-auto px-2 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={onBackToEligibility}
            >
              Back to eligibility questions
            </Button>
          )}
        </div>
        <Button
          type="button"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 sm:shrink-0"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {isLast ? "Complete assessment" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
