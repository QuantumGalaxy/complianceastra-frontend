"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { QUESTIONS_BY_ID, type WizardStateV2 } from "@/lib/saq-decision-config";
import { getNextQuestionId } from "@/lib/saq-decision-engine";
import { ChevronLeft } from "lucide-react";

function approximateTotalSteps(channel: WizardStateV2["payment_channel"]): number {
  switch (channel) {
    case "service_provider":
      return 2;
    case "card_present":
      return 3;
    case "moto":
      return 4;
    case "ecommerce":
      return 3;
    default:
      return 1;
  }
}

function currentStepNumber(state: WizardStateV2): number {
  let n = 0;
  if (state.payment_channel) n++;
  if (state.service_provider_handles_chd_for_others != null) n++;
  if (state.card_present_stores_chd != null) n++;
  if (state.card_present_how != null) n++;
  if (state.moto_stores_chd != null) n++;
  if (state.moto_fully_outsourced != null) n++;
  if (state.moto_how_process != null) n++;
  if (state.ecommerce_fully_outsourced != null) n++;
  if (state.ecommerce_payment_page != null) n++;
  return Math.max(1, n);
}

function currentValueForQuestion(
  state: WizardStateV2,
  questionId: string
): string | null {
  switch (questionId) {
    case "payment_channel":
      return state.payment_channel;
    case "service_provider_handles_chd_for_others":
      return state.service_provider_handles_chd_for_others ?? null;
    case "card_present_stores_chd":
      return state.card_present_stores_chd ?? null;
    case "card_present_how":
      return state.card_present_how ?? null;
    case "moto_stores_chd":
      return state.moto_stores_chd ?? null;
    case "moto_fully_outsourced":
      return state.moto_fully_outsourced ?? null;
    case "moto_how_process":
      return state.moto_how_process ?? null;
    case "ecommerce_fully_outsourced":
      return state.ecommerce_fully_outsourced ?? null;
    case "ecommerce_payment_page":
      return state.ecommerce_payment_page ?? null;
    default:
      return null;
  }
}

type SaqScopeWizardProps = {
  state: WizardStateV2;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
  canGoBack: boolean;
};

export function SaqScopeWizard({ state, onAnswer, onBack, canGoBack }: SaqScopeWizardProps) {
  const questionId = getNextQuestionId(state);
  const question = questionId ? QUESTIONS_BY_ID[questionId] : null;

  const progressLabel = useMemo(() => {
    const ch = state.payment_channel;
    const total = approximateTotalSteps(ch);
    const cur = currentStepNumber(state);
    if (!questionId) return null;
    return `Step ${cur} of about ${total}`;
  }, [state, questionId]);

  if (!question || !questionId) {
    return (
      <p className="text-sm text-slate-600">
        Loading next step… If this persists, refresh and try again.
      </p>
    );
  }

  const options = question.options.map((o) => ({
    value: o.value,
    label: o.label,
    description: o.description,
  }));

  return (
    <div className="space-y-6">
      {progressLabel && (
        <p className="text-xs font-medium text-slate-500" aria-live="polite">
          {progressLabel}
        </p>
      )}

      <QuestionCard
        badge={question.badge}
        title={question.title}
        description={question.description}
        helpText={question.helpText}
        options={options}
        value={currentValueForQuestion(state, questionId)}
        onChange={(value) => onAnswer(questionId, value)}
      />

      <div className="flex justify-start pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onBack}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Button>
      </div>
    </div>
  );
}
