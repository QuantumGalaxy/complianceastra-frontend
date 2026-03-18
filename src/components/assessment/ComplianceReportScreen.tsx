"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportChecklist } from "./ReportChecklist";
import { CHECKLISTS } from "./checklist-data";
import {
  SAQ_LABELS,
  SAQ_RISK_LEVEL,
  ACTION_CARDS_BY_SAQ,
} from "./report-data";
import { generateComplianceReportPdf } from "@/lib/generateComplianceReportPdf";
import { Download, ListChecks, CheckCircle2 } from "lucide-react";
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
  const actionCards = ACTION_CARDS_BY_SAQ[result.saq] ?? [];

  const handleDownloadPdf = useCallback(() => {
    generateComplianceReportPdf({
      result,
      scopeInfo,
      riskLevel,
      topActions: actionCards.map((a) => a.title),
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
    actionCards,
    def,
    checklistState,
    completed,
    totalItems,
    onDownloadPdf,
  ]);

  const scrollToChecklist = () => {
    document.getElementById("checklist-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-12">
      {/* Hero success section */}
      <section
        className="relative rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100/60 px-6 py-10 md:px-10 md:py-12 shadow-lg"
        aria-labelledby="report-hero-title"
      >
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <CheckCircle2 className="h-8 w-8" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 id="report-hero-title" className="text-3xl font-bold text-slate-900 md:text-4xl">
              Your PCI Compliance Plan is Ready
            </h1>
            <p className="text-slate-700 text-lg">
              You now have a complete, audit-ready compliance roadmap based on your system setup.
            </p>
            <p className="text-sm text-slate-600 pt-1">
              Aligned with PCI DSS v4.0 requirements and structured for audit preparation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-8"
              onClick={handleDownloadPdf}
            >
              <Download className="h-5 w-5 mr-2" aria-hidden />
              Download Report (PDF)
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-50 px-8"
              onClick={scrollToChecklist}
            >
              <ListChecks className="h-5 w-5 mr-2" aria-hidden />
              Start Completing Checklist
            </Button>
          </div>
        </div>
      </section>

      {/* 1. SAQ Summary */}
      <Card className="border-slate-200 shadow-sm">
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

      {/* 2. Scope Summary */}
      <Card className="border-slate-200 shadow-sm">
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

      {/* 3. Action Plan (premium cards) */}
      <section aria-labelledby="action-plan-title">
        <h2 id="action-plan-title" className="text-xl font-bold text-slate-900 mb-4">
          Action Plan
        </h2>
        <p className="text-slate-600 text-sm mb-6 max-w-2xl">
          Prioritize these to build a strong foundation and reduce risk.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {actionCards.map((card, i) => (
            <Card
              key={i}
              className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base text-slate-900 leading-snug">
                    {card.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      card.priority === "High"
                        ? "border-amber-400 text-amber-800 text-xs shrink-0"
                        : "border-slate-300 text-slate-600 text-xs shrink-0"
                    }
                  >
                    {card.priority === "High" ? "High" : "Medium"} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-slate-600">{card.description}</p>
                <p className="text-xs text-slate-500 border-l-2 border-emerald-200 pl-3">
                  <span className="font-medium text-slate-600">Why it matters:</span>{" "}
                  {card.whyItMatters}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Checklist Overview (summary card) */}
      <Card className="border-emerald-200 bg-emerald-50/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Checklist Overview</CardTitle>
          <p className="text-sm text-slate-600">
            {totalItems}+ requirements across the categories below. Track progress as you complete each item.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-white border border-slate-200 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Total requirements</span>
              <span className="text-lg font-bold text-slate-900">{totalItems}+</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-semibold text-slate-900">
                {completed} of {totalItems} complete ({progressPercent}%)
              </span>
            </div>
            <div
              className="h-3 rounded-full bg-slate-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-emerald-600 transition-all rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {def.sections.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Full Compliance Checklist (collapsible) */}
      <section id="checklist-section" aria-labelledby="full-checklist-title">
        <h2 id="full-checklist-title" className="text-xl font-bold text-slate-900 mb-2">
          Full Compliance Checklist
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Mark each item as In Place, Action Needed, or Not Applicable. Add notes for evidence.
        </p>
        <ReportChecklist
          checklistDef={def}
          state={checklistState}
          onChange={onChecklistChange}
        />
      </section>

      {/* 6. Export / PDF section */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/30">
        <CardContent className="py-8 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Download your report
              </h2>
              <p className="text-sm text-slate-600 max-w-md">
                Use this report for your QSA or acquirer submission.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shrink-0 w-full sm:w-auto"
              onClick={handleDownloadPdf}
            >
              <Download className="h-5 w-5 mr-2" aria-hidden />
              Download Audit-Ready Compliance Report (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
