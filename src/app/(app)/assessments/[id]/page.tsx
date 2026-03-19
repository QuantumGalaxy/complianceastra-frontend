"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProgressHeader } from "@/components/assessment/ProgressHeader";
import { ResultSummary } from "@/components/assessment/ResultSummary";
import { ChecklistPreview } from "@/components/assessment/ChecklistPreview";
import { PaywallSection } from "@/components/assessment/PaywallSection";
import { PaymentModal } from "@/components/assessment/PaymentModal";
import { ComplianceReportScreen } from "@/components/assessment/ComplianceReportScreen";
import { CHECKLISTS, type ChecklistState } from "@/components/assessment/checklist-data";
import { JsonQuestionnaire } from "@/components/assessment/JsonQuestionnaire";
import { QuestionnaireSummary } from "@/components/assessment/QuestionnaireSummary";
import { SaqScopeWizard } from "@/components/assessment/SaqScopeWizard";
import {
  loadQuestionnaire,
  hasJsonQuestionnaire,
  questionnaireToChecklistDefinition,
} from "@/lib/load-questionnaire";
import type { PaymentChannel, WizardStateV2 } from "@/lib/saq-decision-config";
import { applyAnswer, resolveSaqDecision, type SaqDecisionResult } from "@/lib/saq-decision-engine";

type WizardStep = "scope" | "eligibility" | "questionnaire" | "checklist" | "report";

const STORAGE_KEY_PREFIX = "complianceastra_saq_wizard_v2_";
const FLOW_STEP_KEY_PREFIX = "complianceastra_saq_flow_";
const UNLOCKED_KEY_PREFIX = "complianceastra_unlocked_";

const EMPTY_WIZARD: WizardStateV2 = {
  payment_channel: null,
  saq: null,
};

function loadFlowStep(id: string): WizardStep {
  if (typeof window === "undefined") return "scope";
  try {
    const s = window.localStorage.getItem(FLOW_STEP_KEY_PREFIX + id);
    const valid: WizardStep[] = ["scope", "eligibility", "questionnaire", "checklist", "report"];
    if (s && valid.includes(s as WizardStep)) return s as WizardStep;
  } catch {
    // ignore
  }
  return "scope";
}

function saveFlowStep(id: string, flowStep: WizardStep) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FLOW_STEP_KEY_PREFIX + id, flowStep);
  } catch {
    // ignore
  }
}

function decisionFromWizard(w: WizardStateV2): SaqDecisionResult | null {
  if (!w.saq) return null;
  const r = resolveSaqDecision({ ...w, saq: null });
  if (!r || r.saq !== w.saq) return null;
  return r;
}

function loadUnlocked(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(UNLOCKED_KEY_PREFIX + id) === "true";
  } catch {
    return false;
  }
}

function saveUnlocked(id: string, unlocked: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (unlocked) {
      window.localStorage.setItem(UNLOCKED_KEY_PREFIX + id, "true");
    } else {
      window.localStorage.removeItem(UNLOCKED_KEY_PREFIX + id);
    }
  } catch {
    // ignore
  }
}

function isWizardStateV2(raw: unknown): raw is WizardStateV2 {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return "payment_channel" in o && "saq" in o;
}

function loadWizardState(id: string): WizardStateV2 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isWizardStateV2(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveWizardState(id: string, state: WizardStateV2) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function AssessmentPage() {
  const params = useParams();
  const idParam = String(params.id);

  const [step, setStep] = useState<WizardStep>(() => loadFlowStep(idParam));
  const [wizardState, setWizardState] = useState<WizardStateV2>(() => {
    return loadWizardState(idParam) ?? EMPTY_WIZARD;
  });
  const [wizardPast, setWizardPast] = useState<WizardStateV2[]>([]);
  const [decisionResult, setDecisionResult] = useState<SaqDecisionResult | null>(() => {
    const w = loadWizardState(idParam);
    return w ? decisionFromWizard(w) : null;
  });

  const [checklistState, setChecklistState] = useState<ChecklistState>({});
  const [unlocked, setUnlocked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const wasUnlocked = loadUnlocked(idParam);
    setUnlocked(wasUnlocked);
    if (wasUnlocked) setStep("report");
  }, [idParam]);

  /** Pre-select payment channel from /assessments/new */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = loadWizardState(idParam);
    if (saved?.payment_channel) return;
    const env = sessionStorage.getItem("complianceastra_start_env");
    if (!env) return;
    sessionStorage.removeItem("complianceastra_start_env");
    const map: Record<string, PaymentChannel> = {
      ecommerce: "ecommerce",
      pos: "card_present",
      payment_platform: "service_provider",
      moto: "moto",
    };
    const ch = map[env];
    if (!ch) return;
    setWizardState((prev) => (prev.payment_channel ? prev : { ...prev, payment_channel: ch }));
  }, [idParam]);

  useEffect(() => {
    saveWizardState(idParam, wizardState);
  }, [idParam, wizardState]);

  useEffect(() => {
    saveFlowStep(idParam, step);
  }, [idParam, step]);

  /** If saved flow step requires SAQ but wizard incomplete, reset to scope */
  useEffect(() => {
    if (
      (step === "eligibility" || step === "questionnaire" || step === "checklist") &&
      !wizardState.saq
    ) {
      setStep("scope");
    }
  }, [idParam, step, wizardState.saq]);

  const handlePaymentSuccess = () => {
    setUnlocked(true);
    saveUnlocked(idParam, true);
    setStep("report");
  };

  const result = useMemo(() => {
    if (!wizardState.saq || !decisionResult) return null;
    const checklistDef = CHECKLISTS[wizardState.saq];
    return {
      saq: wizardState.saq,
      why: decisionResult.why,
      summary: decisionResult.summary,
      estimateLabel: checklistDef.estimateLabel,
      title: checklistDef.title,
      riskLevel: decisionResult.riskLevel,
    };
  }, [wizardState.saq, decisionResult]);

  const handleWizardAnswer = useCallback(
    (questionId: string, value: string) => {
      setWizardPast((p) => [...p, wizardState]);
      const next = applyAnswer(wizardState, questionId, value);
      setWizardState(next);
      const resolved = resolveSaqDecision(next);
      if (resolved) {
        setWizardState({ ...next, saq: resolved.saq });
        setDecisionResult(resolved);
        setStep("eligibility");
      }
    },
    [wizardState],
  );

  const handleWizardBack = useCallback(() => {
    const prev = wizardPast[wizardPast.length - 1];
    if (prev === undefined) return;
    setWizardPast((p) => p.slice(0, -1));
    setWizardState(prev);
  }, [wizardPast]);

  const currentStep: WizardStep =
    step === "report"
      ? "report"
      : step === "checklist"
        ? "checklist"
        : step === "questionnaire"
          ? "questionnaire"
          : step === "eligibility"
            ? "eligibility"
            : "scope";

  const handleContinueFromEligibility = () => {
    if (result?.saq && hasJsonQuestionnaire(result.saq)) {
      setStep("questionnaire");
    } else {
      setStep("checklist");
    }
  };

  return (
    <div className="py-16">
      <div className={`container ${step === "report" ? "max-w-4xl" : "max-w-3xl"}`}>
        {step !== "report" && (
          <ProgressHeader
            currentStep={currentStep}
            showQuestionnaire={result?.saq ? hasJsonQuestionnaire(result.saq) : false}
          />
        )}

        {step === "report" && result && (
          <nav className="mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-slate-700">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">Your Report</span>
          </nav>
        )}

        {step === "scope" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">PCI SAQ eligibility</h1>
              <p className="text-slate-600 text-sm">
                One question at a time. We use PCI-style branching so each payment channel only sees
                the questions that apply. Then we&apos;ll show your likely SAQ type.
              </p>
            </div>

            <SaqScopeWizard
              state={wizardState}
              onAnswer={handleWizardAnswer}
              onBack={handleWizardBack}
              canGoBack={wizardPast.length > 0}
            />
          </div>
        )}

        {step === "eligibility" && result && (
          <div className="space-y-8">
            <ResultSummary
              saq={result.saq}
              title={result.title}
              whyMatched={result.why}
              scopeSummary={result.summary}
              estimateLabel={result.estimateLabel}
              riskLevel={result.riskLevel}
              onContinueChecklist={handleContinueFromEligibility}
            />
          </div>
        )}

        {step === "questionnaire" && result && hasJsonQuestionnaire(result.saq) && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {loadQuestionnaire(result.saq).framework}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Answer each requirement below. Use <strong>In Place</strong> when the control is
                implemented, <strong>Not Applicable</strong> when it does not apply to your
                environment, or <strong>Action Needed</strong> when work remains.
              </p>
            </div>
            <JsonQuestionnaire
              questionnaire={loadQuestionnaire(result.saq)}
              state={checklistState}
              onChange={setChecklistState}
              onComplete={() => setStep("checklist")}
            />
          </div>
        )}

        {step === "checklist" && result && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {hasJsonQuestionnaire(result.saq)
                  ? loadQuestionnaire(result.saq).framework
                  : CHECKLISTS[result.saq].title}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                {hasJsonQuestionnaire(result.saq) ? (
                  <>
                    You&apos;ve completed the questionnaire. Unlock to get your full compliance
                    report, readiness summary, and remediation recommendations.
                  </>
                ) : (
                  <>
                    Work through these{" "}
                    <span className="font-semibold">plain-English compliance checkpoints</span>.
                    Unlock to get your full compliance report and checklist.
                  </>
                )}
              </p>
            </div>
            {hasJsonQuestionnaire(result.saq) ? (
              <QuestionnaireSummary
                questionnaire={loadQuestionnaire(result.saq)}
                state={checklistState}
              />
            ) : (
              <ChecklistPreview
                saq={result.saq}
                state={checklistState}
                onChange={setChecklistState}
              />
            )}
            <PaywallSection
              email={userEmail}
              onEmailChange={setUserEmail}
              onUnlockClick={() => setPaymentModalOpen(true)}
              returnTo={`/assessments/${idParam}`}
            />
            <PaymentModal
              open={paymentModalOpen}
              onOpenChange={setPaymentModalOpen}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {step === "report" && result && (
          <ComplianceReportScreen
            result={{
              saq: result.saq,
              title: result.title,
              why: result.why,
              summary: result.summary,
              estimateLabel: result.estimateLabel,
            }}
            checklistState={checklistState}
            onChecklistChange={setChecklistState}
            checklistDef={
              hasJsonQuestionnaire(result.saq)
                ? questionnaireToChecklistDefinition(loadQuestionnaire(result.saq), result.saq)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
