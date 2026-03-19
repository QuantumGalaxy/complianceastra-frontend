"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import type { Questionnaire } from "@/lib/questionnaire-types";

import type { ChecklistState } from "./checklist-data";

type QuestionnaireSummaryProps = {
  questionnaire: Questionnaire;
  state: ChecklistState;
};

function countItems(questionnaire: Questionnaire): number {
  return questionnaire.sections.reduce(
    (sum, s) => sum + s.items.length,
    0,
  );
}

export function QuestionnaireSummary({ questionnaire, state }: QuestionnaireSummaryProps) {
  const total = useMemo(() => countItems(questionnaire), [questionnaire]);

  const { completed, inPlace, inPlaceCcw, notApplicable, actionNeeded } = useMemo(() => {
    let completed = 0;
    let inPlace = 0;
    let inPlaceCcw = 0;
    let notApplicable = 0;
    let actionNeeded = 0;
    Object.values(state).forEach((v) => {
      if (v.answer) {
        completed++;
        if (v.answer === "in_place") inPlace++;
        else if (v.answer === "in_place_ccw") inPlaceCcw++;
        else if (v.answer === "not_applicable") notApplicable++;
        else if (v.answer === "action_needed") actionNeeded++;
      }
    });
    return { completed, inPlace, inPlaceCcw, notApplicable, actionNeeded };
  }, [state]);

  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
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
          <span className="font-semibold text-slate-900">{completed} of {total}</span> requirements
          completed
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              In Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-900">{inPlace + inPlaceCcw}</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Controls implemented{inPlaceCcw > 0 ? ` (${inPlaceCcw} with CCW)` : ""}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Action Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-900">{actionNeeded}</p>
            <p className="text-xs text-amber-700 mt-0.5">Remediation required</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MinusCircle className="h-4 w-4" />
              Not Applicable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{notApplicable}</p>
            <p className="text-xs text-slate-600 mt-0.5">Out of scope</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Assessment complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Your responses are ready for the compliance report. Unlock below to view your full
            readiness summary, export to PDF, and get remediation recommendations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
