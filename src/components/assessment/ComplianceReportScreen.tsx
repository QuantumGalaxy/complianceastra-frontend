"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChecklistView } from "./ChecklistView";
import { CHECKLISTS } from "./checklist-data";
import {
  SAQ_LABELS,
  SAQ_RISK_LEVEL,
  TOP_ACTIONS_BY_SAQ,
} from "./report-data";
import { generateComplianceReportPdf } from "@/lib/generateComplianceReportPdf";
import type { SaqType } from "./checklist-data";

type ReportResult = {
  saq: SaqType;
  title: string;
  why: string[];
  summary: string;
  estimateLabel: string;
};

type ChecklistState = Record<
  string,
  { answer: "in_place" | "not_applicable" | "action_needed" | null; notes: string }
>;

type ComplianceReportScreenProps = {
  result: ReportResult;
  checklistState: ChecklistState;
  onChecklistChange: (next: ChecklistState) => void;
  onDownloadPdf?: () => void;
};

function getInScopeOutOfScope(saq: SaqType): {
  inScope: string[];
  outOfScope: string[];
  assumptions: string[];
} {
  const base = {
    inScope: [] as string[],
    outOfScope: [] as string[],
    assumptions: [] as string[],
  };
  switch (saq) {
    case "A":
      base.inScope = ["Third-party hosted payment pages", "Ecommerce platform and hosting"];
      base.outOfScope = ["Cardholder data storage", "Card data processing on your systems"];
      base.assumptions = ["All payment pages delivered by PCI-compliant provider", "No electronic storage of card data"];
      break;
    case "A-EP":
      base.inScope = ["Ecommerce web server", "Payment page delivery", "Scripts affecting payment page"];
      base.outOfScope = ["Card data storage (if posted directly to processor)"];
      base.assumptions = ["Merchant controls some payment page content", "No sensitive auth data stored"];
      break;
    case "B":
      base.inScope = ["Imprint machines or standalone dial-out terminals", "Paper records"];
      base.outOfScope = ["Electronic card data", "Networked systems processing card data"];
      base.assumptions = ["No electronic storage, processing, or transmission"];
      break;
    case "B-IP":
      base.inScope = ["Standalone IP-connected PTS-approved devices", "Network segment for terminals"];
      base.outOfScope = ["Other merchant systems", "Electronic card data storage"];
      base.assumptions = ["Devices not dependent on other systems", "No card data on connected systems"];
      break;
    case "C-VT":
      base.inScope = ["Single workstation", "Web-based virtual terminal"];
      base.outOfScope = ["Card readers", "Batch or store-and-forward", "Electronic storage"];
      base.assumptions = ["One transaction at a time", "Isolated device"];
      break;
    case "C":
      base.inScope = ["Payment application or IP-connected terminals", "Network segment"];
      base.outOfScope = ["Electronic card data storage (if none)"];
      base.assumptions = ["No electronic storage of card data", "Isolated environment"];
      break;
    case "D_MERCHANT":
      base.inScope = ["All systems that store, process, or transmit cardholder data", "Connected systems"];
      base.outOfScope = ["Systems fully isolated per PCI segmentation"];
      base.assumptions = ["Full PCI DSS applies to in-scope systems"];
      break;
    case "D_SERVICE_PROVIDER":
      base.inScope = ["Services that store, process, or transmit cardholder data", "Customer environments you support"];
      base.outOfScope = ["Out-of-scope services per documented boundaries"];
      base.assumptions = ["SAQ D for Service Providers or full ROC applies"];
      break;
    default:
      base.inScope = ["Systems handling cardholder data"];
      base.outOfScope = ["Segmented or out-of-scope systems"];
      base.assumptions = ["Scope to be confirmed with acquirer or QSA"];
  }
  return base;
}

export function ComplianceReportScreen({
  result,
  checklistState,
  onChecklistChange,
  onDownloadPdf,
}: ComplianceReportScreenProps) {
  const def = useMemo(() => CHECKLISTS[result.saq], [result.saq]);
  const totalItems = useMemo(
    () => def.sections.reduce((acc, s) => acc + s.items.length, 0),
    [def],
  );
  const completed = useMemo(
    () =>
      Object.values(checklistState).filter(
        (v) => v.answer && v.answer !== null,
      ).length,
    [checklistState],
  );
  const progressPercent = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  const scopeInfo = useMemo(() => getInScopeOutOfScope(result.saq), [result.saq]);
  const riskLevel = SAQ_RISK_LEVEL[result.saq];
  const topActions = TOP_ACTIONS_BY_SAQ[result.saq] ?? [];

  const handleDownloadPdf = useCallback(() => {
    generateComplianceReportPdf({
      result,
      scopeInfo,
      riskLevel,
      topActions,
      checklistDef: def,
      checklistState,
      completed,
      totalItems,
    });
    onDownloadPdf?.();
  }, [
    result,
    scopeInfo,
    riskLevel,
    topActions,
    def,
    checklistState,
    completed,
    totalItems,
    onDownloadPdf,
  ]);

  return (
    <div className="space-y-8">
      {/* Success banner */}
      <div
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900"
        role="status"
      >
        <p className="font-semibold">
          ✅ Payment successful. Your full compliance plan is now unlocked.
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          Based on your answers, here is your complete compliance plan. Use this report to track progress and prepare for your acquirer or QSA.
        </p>
      </div>

      {/* Title */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Your PCI DSS Compliance Report
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Based on your answers, here is your complete compliance plan.
        </p>
      </header>

      {/* Section 1: SAQ Summary */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">SAQ Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="text-base px-4 py-1.5 rounded-full bg-emerald-600 text-white">
              {SAQ_LABELS[result.saq]}
            </Badge>
            <Badge
              variant="outline"
              className={
                riskLevel === "High"
                  ? "border-amber-400 text-amber-800"
                  : riskLevel === "Medium"
                  ? "border-slate-400 text-slate-700"
                  : "border-emerald-400 text-emerald-800"
              }
            >
              Risk level: {riskLevel}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Why this applies</p>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
              {result.why.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Scope Summary */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Scope Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">In scope</p>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
              {scopeInfo.inScope.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Out of scope</p>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
              {scopeInfo.outOfScope.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Key assumptions</p>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
              {scopeInfo.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Checklist Overview */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Checklist Overview</CardTitle>
          <p className="text-sm text-slate-600">
            {totalItems}+ requirements across the categories below. Track progress as you complete each item.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-semibold text-slate-900">
                {completed} of {totalItems} complete ({progressPercent}%)
              </span>
            </div>
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
          </div>
          <div className="flex flex-wrap gap-2">
            {def.sections.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {s.title}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Top 5 Actions */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader>
          <CardTitle className="text-emerald-900">
            Top 5 actions to get compliant
          </CardTitle>
          <p className="text-sm text-slate-700">
            Prioritize these to build a strong foundation.
          </p>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-slate-800 font-medium">
            {topActions.map((action, i) => (
              <li key={i} className="pl-2">
                {action}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Section 5: Interactive Checklist */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Full compliance checklist</CardTitle>
          <p className="text-sm text-slate-600">
            Mark each item as In Place, Not Applicable, or Action Needed. Add notes for evidence.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <ChecklistView
            saq={result.saq}
            state={checklistState}
            onChange={onChecklistChange}
          />
        </CardContent>
      </Card>

      {/* Section 6: Export */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            onClick={handleDownloadPdf}
          >
            Download Compliance Report (PDF)
          </Button>
          <p className="mt-2 text-xs text-slate-500">
            Export this report for your records or to share with your acquirer or QSA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
