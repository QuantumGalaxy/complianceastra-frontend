"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import type {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireSection,
  QuestionnaireAnswersMap,
  QuestionnaireAnswerValue,
} from "@/lib/questionnaire-types";
import { CCW_HELPER_TEXT, OPTION_TO_VALUE } from "@/lib/questionnaire-types";

/** Merchant-facing response options (main view). Order matches product spec. */
const MERCHANT_RESPONSE_LABELS = ["In Place", "Action Needed", "Not Applicable"] as const;

function buildMerchantResponseOptions(itemOptions: string[]): { value: QuestionnaireAnswerValue; label: string }[] {
  const normalized = new Set(itemOptions.map((o) => o.trim()));
  const rows: { value: QuestionnaireAnswerValue; label: string }[] = [];
  for (const label of MERCHANT_RESPONSE_LABELS) {
    if (!normalized.has(label)) continue;
    const value = OPTION_TO_VALUE[label];
    if (value) rows.push({ value, label });
  }
  if (rows.length > 0) return rows;
  return itemOptions.map((opt) => ({
    value:
      OPTION_TO_VALUE[opt.trim()] ??
      (opt.toLowerCase().replace(/\s+/g, "_") as QuestionnaireAnswerValue),
    label: opt,
  }));
}

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

  const handleAnswerChange = (value: QuestionnaireAnswerValue) => {
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

  const merchantOptions = buildMerchantResponseOptions(current.item.options);

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
        <CardHeader className="space-y-3">
          {/* PCI DSS requirement ID — primary reference (per PRD) */}
          {current.item.show_requirement_id !== false && (
            <div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wide text-slate-800">
                {current.item.maps_to_requirements && current.item.maps_to_requirements.length > 0
                  ? `Req. ${current.item.maps_to_requirements.join(", ")}`
                  : `PCI DSS ${current.item.id}`}
              </span>
            </div>
          )}
          <CardTitle className="text-left text-lg font-semibold leading-snug text-slate-900">
            {current.item.question}
          </CardTitle>
          {current.item.help_text && (
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span className="leading-relaxed">{current.item.help_text}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Response</p>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label={current.item.question}>
              {merchantOptions.map((opt) => {
                const selected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswerChange(opt.value)}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {isCcwSelected && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-xs text-slate-500">{CCW_HELPER_TEXT}</p>
              <label className="text-sm font-medium text-slate-700">
                Compensating control description <span className="text-rose-500">*</span>
              </label>
              <Textarea
                value={currentCcw}
                onChange={(e) => handleCcwChange(e.target.value)}
                className={`min-h-[80px] text-sm ${ccwRequiredButEmpty ? "border-rose-300" : ""}`}
                placeholder="Explain how your alternative control meets the requirement..."
              />
              {ccwRequiredButEmpty && (
                <p className="text-xs text-rose-600">Please describe your compensating control before continuing.</p>
              )}
            </div>
          )}

          {current.item.allow_note !== false && (
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Notes / Evidence upload</label>
              <p className="text-xs text-slate-500">Optional — saved with your assessment and export.</p>
              <Textarea
                value={currentNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[88px] text-sm"
                placeholder="Links, file names, ticket IDs, or other evidence…"
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
