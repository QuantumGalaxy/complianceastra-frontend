"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assessmentsApi, reportsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  buildScopeResultForSync,
  mapPaymentChannelToEnvironmentType,
} from "@/lib/buildScopeResultForSync";
import { ProgressHeader } from "@/components/assessment/ProgressHeader";
import { ResultSummary } from "@/components/assessment/ResultSummary";
import { PaywallSection } from "@/components/assessment/PaywallSection";
import { PaymentModal } from "@/components/assessment/PaymentModal";
import { ComplianceReportScreen } from "@/components/assessment/ComplianceReportScreen";
import { CHECKLISTS, type ChecklistState } from "@/components/assessment/checklist-data";
import { JsonQuestionnaire } from "@/components/assessment/JsonQuestionnaire";
import { QuestionnaireSummary } from "@/components/assessment/QuestionnaireSummary";
import { SaqScopeWizard } from "@/components/assessment/SaqScopeWizard";
import {
  loadQuestionnaire,
  questionnaireToChecklistDefinition,
} from "@/lib/load-questionnaire";
import type { PaymentChannel, WizardStateV2 } from "@/lib/saq-decision-config";
import {
  applyAnswer,
  resolveSaqDecision,
  stateForReopeningEligibilityWizard,
  type SaqDecisionResult,
} from "@/lib/saq-decision-engine";

type WizardStep = "scope" | "eligibility" | "questionnaire" | "checklist" | "report";

const STORAGE_KEY_PREFIX = "complianceastra_saq_wizard_v2_";
const FLOW_STEP_KEY_PREFIX = "complianceastra_saq_flow_";
const UNLOCKED_KEY_PREFIX = "complianceastra_unlocked_";
const PAY_EMAIL_KEY_PREFIX = "complianceastra_pay_email_";

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
  const router = useRouter();
  const { loginWithToken } = useAuth();

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem(PAY_EMAIL_KEY_PREFIX + idParam);
      if (s) setUserEmail(s);
    } catch {
      // ignore
    }
  }, [idParam]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PAY_EMAIL_KEY_PREFIX + idParam, userEmail);
    } catch {
      // ignore
    }
  }, [idParam, userEmail]);

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

  const handleConfirmPayment = useCallback(async () => {
    if (!result || !decisionResult || !wizardState.saq) {
      setCheckoutError("Complete the assessment first.");
      return;
    }
    const trimmed = userEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setCheckoutError("Enter a valid email address.");
      return;
    }
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const scope_result = buildScopeResultForSync({
        saq: wizardState.saq,
        decision: decisionResult,
        paymentChannel: wizardState.payment_channel,
      });
      const environment_type = mapPaymentChannelToEnvironmentType(wizardState.payment_channel);
      const { assessment_id } = await assessmentsApi.saqSync({
        client_session_id: idParam,
        guest_email: trimmed,
        environment_type,
        scope_result,
      });
      const co = await reportsApi.checkoutGuest({
        assessment_id,
        client_session_id: idParam,
        email: trimmed,
      });
      if (co.access_token) {
        await loginWithToken(co.access_token);
        setPaymentModalOpen(false);
        setUnlocked(true);
        saveUnlocked(idParam, true);
        router.push("/dashboard?report=success");
        return;
      }
      window.location.href = co.checkout_url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
      setCheckoutError(msg);
    } finally {
      setCheckoutLoading(false);
    }
  }, [
    result,
    decisionResult,
    wizardState.saq,
    wizardState.payment_channel,
    userEmail,
    idParam,
    loginWithToken,
    router,
  ]);

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
    setStep("questionnaire");
  };

  const reopenEligibilityWizard = useCallback(() => {
    setWizardPast([]);
    setWizardState(stateForReopeningEligibilityWizard(wizardState));
    setDecisionResult(null);
    setStep("scope");
  }, [wizardState]);

  /** From SAQ result screen — no questionnaire progress to lose yet */
  const handleEditEligibilityFromSummary = useCallback(() => {
    reopenEligibilityWizard();
  }, [reopenEligibilityWizard]);

  /** From JSON questionnaire — browser “back” would leave this session; explicit path to eligibility */
  const handleBackToEligibilityFromQuestionnaire = useCallback(() => {
    const answered = Object.keys(checklistState).some((id) => checklistState[id]?.answer != null);
    if (
      answered &&
      typeof window !== "undefined" &&
      !window.confirm(
        "You’ll return to PCI eligibility questions. Your current questionnaire answers will be cleared so they stay in sync if your SAQ type changes. Continue?",
      )
    ) {
      return;
    }
    setChecklistState({});
    reopenEligibilityWizard();
  }, [checklistState, reopenEligibilityWizard]);

  return (
    <div className="py-16">
      <div className={`container ${step === "report" ? "max-w-4xl" : "max-w-3xl"}`}>
        {step !== "report" && (
          <ProgressHeader
            currentStep={currentStep}
            showQuestionnaire={!!result?.saq}
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
              onEditEligibility={handleEditEligibilityFromSummary}
            />
          </div>
        )}

        {step === "questionnaire" && result && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {loadQuestionnaire(result.saq).framework}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Answer each requirement and upload evidence or notes if needed. Your responses will
                be saved for reporting.
              </p>
            </div>
            <JsonQuestionnaire
              questionnaire={loadQuestionnaire(result.saq)}
              state={checklistState}
              onChange={setChecklistState}
              onComplete={() => setStep("checklist")}
              onBackToEligibility={handleBackToEligibilityFromQuestionnaire}
            />
          </div>
        )}

        {step === "checklist" && result && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {loadQuestionnaire(result.saq).framework}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                You&apos;ve completed the questionnaire. Unlock to get your full compliance report,
                readiness summary, and remediation recommendations.
              </p>
            </div>
            <QuestionnaireSummary
              questionnaire={loadQuestionnaire(result.saq)}
              state={checklistState}
            />
            <PaywallSection
              email={userEmail}
              onEmailChange={setUserEmail}
              onUnlockClick={() => setPaymentModalOpen(true)}
              returnTo={`/assessments/${idParam}`}
            />
            <PaymentModal
              open={paymentModalOpen}
              onOpenChange={setPaymentModalOpen}
              onConfirmPayment={handleConfirmPayment}
              isProcessing={checkoutLoading}
              errorMessage={checkoutError}
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
            checklistDef={questionnaireToChecklistDefinition(loadQuestionnaire(result.saq), result.saq)}
          />
        )}
      </div>
    </div>
  );
}
