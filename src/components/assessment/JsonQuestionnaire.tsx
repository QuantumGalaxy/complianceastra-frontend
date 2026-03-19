"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import type { Questionnaire, QuestionnaireItem, QuestionnaireSection, QuestionnaireAnswersMap } from "@/lib/questionnaire-types";
import { OPTION_TO_VALUE } from "@/lib/questionnaire-types";

type JsonQuestionnaireProps = {
  questionnaire: Questionnaire;
  state: QuestionnaireAnswersMap;
  onChange: (next: QuestionnaireAnswersMap) => void;
  onComplete: () => void;
};

/** Flatten sections into ordered items with section context */
function flattenItems(questionnaire: Questionnaire): { item: QuestionnaireItem; section: QuestionnaireSection }[] {
  const sections = [...questionnaire.sections].sort((a, b) => a.section_order - b.section_order);
  const result: { item: QuestionnaireItem; section: QuestionnaireSection }[] = [];
  for (const section of sections) {
    const items = [...section.items].sort((a, b) => a.display_order - b.display_order);
    for (const item of items) {
      result.push({ item, section });
    }
  }
  return result;
}

function optionToValue(opt: string): "in_place" | "not_applicable" | "action_needed" | null {
  const v = OPTION_TO_VALUE[opt];
  return v ?? null;
}

export function JsonQuestionnaire({ questionnaire, state, onChange, onComplete }: JsonQuestionnaireProps) {
  const flat = useMemo(() => flattenItems(questionnaire), [questionnaire]);
  const total = flat.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = flat[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const currentState = current ? state[current.item.id] : undefined;
  const currentAnswer = currentState?.answer ?? null;
  const currentNotes = currentState?.notes ?? "";

  const handleAnswerChange = (value: "in_place" | "not_applicable" | "action_needed") => {
    if (!current) return;
    onChange({
      ...state,
      [current.item.id]: { answer: value, notes: currentNotes },
    });
  };

  const handleNotesChange = (notes: string) => {
    if (!current) return;
    onChange({
      ...state,
      [current.item.id]: { answer: currentAnswer, notes },
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

  if (!current) {
    return null;
  }

  const options = current.item.options.map((opt) => ({
    value: optionToValue(opt) ?? opt.toLowerCase().replace(/\s+/g, "_"),
    label: opt,
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
                  onClick={() => handleAnswerChange(opt.value as "in_place" | "not_applicable" | "action_needed")}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                    selected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{opt.label}</span>
                    {selected && (
                      <span className="text-xs font-semibold text-emerald-700">Selected</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

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

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirst}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          onClick={handleNext}
        >
          {isLast ? "Complete assessment" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
