"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, MinusCircle, HelpCircle, XCircle } from "lucide-react";
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
  const {
    completed,
    inPlace,
    inPlaceCcw,
    notApplicable,
    notTested,
    notInPlace,
    actionNeeded,
  } = useMemo(() => {
    let completed = 0;
    let inPlace = 0;
    let inPlaceCcw = 0;
    let notApplicable = 0;
    let notTested = 0;
    let notInPlace = 0;
    let actionNeeded = 0;
    Object.values(state).forEach((v) => {
      if (v.answer) {
        completed++;
        if (v.answer === "in_place") inPlace++;
        else if (v.answer === "in_place_ccw") inPlaceCcw++;
        else if (v.answer === "not_applicable") notApplicable++;
        else if (v.answer === "not_tested") notTested++;
        else if (v.answer === "not_in_place") notInPlace++;
        else if (v.answer === "action_needed") actionNeeded++;
      }
    });
    return {
      completed,
      inPlace,
      inPlaceCcw,
      notApplicable,
      notTested,
      notInPlace,
      actionNeeded,
    };
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              In Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-900">{inPlace}</p>
            <p className="mt-0.5 text-xs text-emerald-700">Met as written</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200/80 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-emerald-900">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              In Place with CCW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-950">{inPlaceCcw}</p>
            <p className="mt-0.5 text-xs text-emerald-800">Compensating control</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MinusCircle className="h-4 w-4 shrink-0" />
              Not Applicable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{notApplicable}</p>
            <p className="mt-0.5 text-xs text-slate-600">Out of scope for you</p>
          </CardContent>
        </Card>
        <Card className="border-violet-200 bg-violet-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-violet-900">
              <HelpCircle className="h-4 w-4 shrink-0" />
              Not Tested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-violet-950">{notTested}</p>
            <p className="mt-0.5 text-xs text-violet-800">Not yet validated</p>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-rose-900">
              <XCircle className="h-4 w-4 shrink-0" />
              Not in Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-950">{notInPlace}</p>
            <p className="mt-0.5 text-xs text-rose-800">Gap to remediate</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Action Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-900">{actionNeeded}</p>
            <p className="mt-0.5 text-xs text-amber-700">Remediation required</p>
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
