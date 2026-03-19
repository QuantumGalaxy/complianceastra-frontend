"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "@/components/assessment/ProgressHeader";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { ResultSummary } from "@/components/assessment/ResultSummary";
import { ChecklistPreview } from "@/components/assessment/ChecklistPreview";
import { PaywallSection } from "@/components/assessment/PaywallSection";
import { PaymentModal } from "@/components/assessment/PaymentModal";
import { ComplianceReportScreen } from "@/components/assessment/ComplianceReportScreen";
import { CHECKLISTS, SaqType } from "@/components/assessment/checklist-data";

type Channel = "ecommerce" | "moto" | "card_present" | "service_provider" | null;
type WizardStep = "scope" | "eligibility" | "checklist" | "report";

type EcommerceAnswers = {
  onlyEcommerce?: string;
  touchesCardData?: string;
  fullyOutsourced?: string;
  paymentMethod?:
    | "hosted"
    | "redirect"
    | "iframe"
    | "direct_post"
    | "merchant_js"
    | "other";
  onlyProcessorContent?: string;
  scriptSecurityConfirmed?: string;
};

type MotoAnswers = {
  acceptsMoto?: string;
  electronicCardData?: string;
  virtualTerminal?: string;
  isolatedDevice?: string;
  noReadersOrStorage?: string;
  paperOnly?: string;
};

type CardPresentAnswers = {
  electronicStorage?: string;
  deviceType?: "imprint" | "dial" | "pts_ip" | "pos_internet" | "p2pe" | "other";
  connectedToOtherSystems?: string;
  singleLocationLan?: string;
  paperOnly?: string;
};

type WizardState = {
  channel: Channel;
  ecommerce: EcommerceAnswers;
  moto: MotoAnswers;
  cardPresent: CardPresentAnswers;
  saq: SaqType | null;
};

const STORAGE_KEY_PREFIX = "complianceastra_saq_wizard_";
const UNLOCKED_KEY_PREFIX = "complianceastra_unlocked_";

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

function loadState(id: string): WizardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as WizardState;
  } catch {
    return null;
  }
}

function saveState(id: string, state: WizardState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function determineSaq(state: WizardState): { saq: SaqType; why: string[]; summary: string } {
  const channel = state.channel;

  if (channel === "service_provider") {
    return {
      saq: "D_SERVICE_PROVIDER",
      why: [
        "You identified your organization as a service provider.",
        "Service providers use SAQ D for Service Providers rather than the merchant SAQs.",
      ],
      summary:
        "As a service provider, you are expected to complete SAQ D for Service Providers or undergo a full PCI DSS assessment. The full PCI DSS control set applies to the systems and services you provide to merchants.",
    };
  }

  if (channel === "ecommerce") {
    const a = state.ecommerce;
    const complex =
      a.touchesCardData === "yes" ||
      a.fullyOutsourced === "no" ||
      a.paymentMethod === "other" ||
      a.onlyProcessorContent === "no" ||
      a.scriptSecurityConfirmed === "no";

    if (complex) {
      return {
        saq: "D_MERCHANT",
        why: [
          "Your ecommerce setup appears to involve merchant systems that can see or influence card data.",
          "Some answers suggest custom code, merchant-controlled payment scripts, or unclear outsourcing.",
        ],
        summary:
          "Because your ecommerce environment likely brings merchant systems into scope, SAQ D for Merchants is the safest default. You may later refine scope with your acquirer or QSA if you simplify the architecture.",
      };
    }

    if (
      a.paymentMethod === "hosted" ||
      a.paymentMethod === "redirect" ||
      a.paymentMethod === "iframe"
    ) {
      return {
        saq: "A",
        why: [
          "Your ecommerce transactions appear fully outsourced to a PCI-compliant provider.",
          "You indicated that payment pages are hosted or redirected and that content is delivered directly from the provider.",
        ],
        summary:
          "You likely fit SAQ A, which applies to merchants that fully outsource cardholder data functions to PCI-compliant third parties with no electronic storage, processing, or transmission on their own systems.",
      };
    }

    if (a.paymentMethod === "direct_post" || a.paymentMethod === "merchant_js") {
      return {
        saq: "A-EP",
        why: [
          "Your ecommerce site uses merchant-controlled payment pages or scripts that can impact card data security.",
          "Even if card data posts directly to a processor, your web server and scripts can affect the payment page.",
        ],
        summary:
          "You likely fit SAQ A-EP, which applies to ecommerce sites where merchant web servers or scripts can influence the security of the payment page even when card data is sent directly to a processor.",
      };
    }
  }

  if (channel === "moto") {
    const a = state.moto;
    const fullyOutsourced =
      a.acceptsMoto === "yes" &&
      a.electronicCardData === "no" &&
      a.virtualTerminal === "no" &&
      a.paperOnly === "yes";

    if (fullyOutsourced) {
      return {
        saq: "A",
        why: [
          "You accept card-not-present orders but do not store, process, or transmit card data electronically.",
          "Any retained card data is on paper only.",
        ],
        summary:
          "You likely fit SAQ A in a card-not-present scenario where cardholder data is fully outsourced or captured only on paper without electronic storage or processing.",
      };
    }

    const vtIsolated =
      a.virtualTerminal === "yes" &&
      a.isolatedDevice === "yes" &&
      a.noReadersOrStorage === "yes" &&
      a.electronicCardData === "no";

    if (vtIsolated) {
      return {
        saq: "C-VT",
        why: [
          "Staff key card details directly into a web-based virtual terminal.",
          "The workstation appears isolated and does not store cardholder data.",
        ],
        summary:
          "You likely fit SAQ C-VT, which applies to merchants using a virtual terminal on a single, isolated workstation with no electronic card-data storage.",
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "Your mail/telephone order flow includes electronic systems that may store, process, or transmit card data beyond a simple isolated virtual terminal.",
      ],
      summary:
        "Because your card-not-present environment does not clearly meet the stricter SAQ A or C-VT conditions, SAQ D for Merchants is the safest classification. A QSA or acquirer may later refine this once more detail is known.",
    };
  }

  if (channel === "card_present") {
    const a = state.cardPresent;

    if (a.deviceType === "imprint" || a.deviceType === "dial") {
      return {
        saq: "B",
        why: [
          "You use imprint machines or standalone dial-out terminals.",
          "Card data does not pass through other merchant systems.",
        ],
        summary:
          "You likely fit SAQ B, which applies to merchants using only imprint machines or standalone dial-out terminals with no electronic card-data storage.",
      };
    }

    if (a.deviceType === "pts_ip" && a.connectedToOtherSystems === "no") {
      return {
        saq: "B-IP",
        why: [
          "You use standalone IP-connected PTS-approved terminals.",
          "Devices are not dependent on or directly connected to other merchant systems.",
        ],
        summary:
          "You likely fit SAQ B-IP, which applies to merchants using standalone, IP-connected, PTS-approved POI devices with no other systems in scope.",
      };
    }

    if (
      a.deviceType === "pos_internet" &&
      a.electronicStorage === "no" &&
      a.connectedToOtherSystems === "no" &&
      a.singleLocationLan === "yes"
    ) {
      return {
        saq: "C",
        why: [
          "You use an IP-connected POS/payment application that does not store card data electronically.",
          "The environment appears limited to a small, defined network segment.",
        ],
        summary:
          "You likely fit SAQ C, which applies to merchants with payment applications or terminals connected to the Internet but without electronic card-data storage.",
      };
    }

    if (a.deviceType === "p2pe") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Validated P2PE solutions often have their own eligibility criteria and SAQs.",
          "This wizard treats P2PE as a complex case that should be confirmed with your acquirer or QSA.",
        ],
        summary:
          "You appear to be using a P2PE or similar solution. Many acquirers treat these under specific guidance. SAQ D is shown here as a conservative default; confirm with your provider which SAQ applies.",
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "Your card-present environment involves POS, networked systems, or storage patterns that do not clearly meet SAQ B, B-IP, or C definitions.",
      ],
      summary:
        "Because your POS environment is more complex or interconnected, SAQ D for Merchants is the safest default classification.",
    };
  }

  return {
    saq: "D_MERCHANT",
    why: ["Channel not selected. Defaulting to conservative SAQ D classification."],
    summary:
      "Without clear information about your environment, SAQ D for Merchants is the safest starting point. Completing the scope wizard will refine this recommendation.",
  };
}

export default function AssessmentPage() {
  const params = useParams();
  const idParam = String(params.id);

  const [step, setStep] = useState<WizardStep>("scope");
  const [state, setState] = useState<WizardState>(() => {
    const loaded = loadState(idParam);
    return (
      loaded ?? {
        channel: null,
        ecommerce: {},
        moto: {},
        cardPresent: {},
        saq: null,
      }
    );
  });
  const [checklistState, setChecklistState] = useState<Record<
    string,
    { answer: "in_place" | "not_applicable" | "action_needed" | null; notes: string }
  >>({});
  const [unlocked, setUnlocked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const wasUnlocked = loadUnlocked(idParam);
    setUnlocked(wasUnlocked);
    if (wasUnlocked) setStep("report");
  }, [idParam]);

  /** Pre-select payment channel from /assessments/new choice (instant start, no API wait). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = loadState(idParam);
    if (saved?.channel) return;
    const env = sessionStorage.getItem("complianceastra_start_env");
    if (!env) return;
    sessionStorage.removeItem("complianceastra_start_env");
    const map: Record<string, Channel> = {
      ecommerce: "ecommerce",
      pos: "card_present",
      payment_platform: "service_provider",
    };
    const ch = map[env];
    if (!ch) return;
    setState((prev) => (prev.channel ? prev : { ...prev, channel: ch }));
  }, [idParam]);

  useEffect(() => {
    saveState(idParam, state);
  }, [idParam, state]);

  const handlePaymentSuccess = () => {
    setUnlocked(true);
    saveUnlocked(idParam, true);
    setStep("report");
  };

  const result = useMemo(() => {
    if (!state.saq) return null;
    const { saq, why, summary } = determineSaq(state);
    const checklistDef = CHECKLISTS[saq];
    return {
      saq,
      why,
      summary,
      estimateLabel: checklistDef.estimateLabel,
      title: checklistDef.title,
    };
  }, [state]);

  const canContinueFromScope = () => {
    if (!state.channel) return false;
    if (state.channel === "ecommerce") {
      const a = state.ecommerce;
      return !!(a.onlyEcommerce && a.touchesCardData && a.fullyOutsourced && a.paymentMethod);
    }
    if (state.channel === "moto") {
      const a = state.moto;
      return !!(a.acceptsMoto && a.electronicCardData && a.virtualTerminal && a.paperOnly);
    }
    if (state.channel === "card_present") {
      const a = state.cardPresent;
      return !!(a.deviceType && a.electronicStorage);
    }
    if (state.channel === "service_provider") {
      return true;
    }
    return false;
  };

  const handleDetermineSaq = () => {
    const { saq } = determineSaq(state);
    setState((prev) => ({ ...prev, saq }));
    setStep("eligibility");
  };

  const currentStep: WizardStep =
    step === "report" ? "report" : step === "checklist" ? "checklist" : state.saq ? step : "scope";

  return (
    <div className="py-16">
      <div className={`container ${step === "report" ? "max-w-4xl" : "max-w-3xl"}`}>
        {step !== "report" && <ProgressHeader currentStep={currentStep} />}

        {step === "report" && result && (
          <nav className="mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">Your Report</span>
          </nav>
        )}

        {step === "scope" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">PCI SAQ scope wizard</h1>
              <p className="text-slate-600 text-sm">
                Answer a few short, business-friendly questions. We&apos;ll estimate your likely
                SAQ type and then walk you through a tailored compliance checklist.
              </p>
            </div>

            <QuestionCard
              badge="Step 1"
              title="How do you accept card payments today?"
              description="Choose the primary way customers pay you for this assessment."
              options={[
                { value: "ecommerce", label: "Ecommerce" },
                { value: "moto", label: "Mail / phone (MOTO)" },
                { value: "card_present", label: "Card-present / POS" },
                { value: "service_provider", label: "Service provider" },
              ]}
              value={state.channel}
              onChange={(value) =>
                setState((prev) => ({ ...prev, channel: value as Channel, saq: null }))
              }
            />

            {state.channel === "ecommerce" && (
              <div className="space-y-4">
                <QuestionCard
                  badge="Ecommerce"
                  title="Do you accept only ecommerce transactions for this scope?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No, we mix ecommerce with other flows" },
                  ]}
                  value={state.ecommerce.onlyEcommerce ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, onlyEcommerce: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Ecommerce"
                  title="Do your systems electronically store, process, or transmit card data?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No, everything is with the processor" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.ecommerce.touchesCardData ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, touchesCardData: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Ecommerce"
                  title="Is all account-data processing fully outsourced to a PCI-compliant provider?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No or not sure" },
                  ]}
                  value={state.ecommerce.fullyOutsourced ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, fullyOutsourced: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Ecommerce"
                  title="How do customers enter their card details?"
                  description="Pick the option that best describes your current payment page design."
                  helpText={
                    <>
                      <strong>Hosted / redirect / iframe</strong> usually means the provider owns the
                      payment page. <strong>Direct post</strong> or <strong>merchant JS</strong>{" "}
                      usually means your site can affect card data security.
                    </>
                  }
                  options={[
                    { value: "hosted", label: "Fully hosted payment page by provider" },
                    { value: "redirect", label: "Redirect to provider (e.g. hosted checkout)" },
                    { value: "iframe", label: "Embedded iframe from provider" },
                    { value: "direct_post", label: "Direct post from our payment page" },
                    { value: "merchant_js", label: "Merchant-loaded payment scripts / JavaScript" },
                    { value: "other", label: "Other or not sure" },
                  ]}
                  value={state.ecommerce.paymentMethod ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, paymentMethod: value as EcommerceAnswers["paymentMethod"] },
                    }))
                  }
                />
                <QuestionCard
                  badge="Ecommerce"
                  title="Are all payment page elements delivered directly from your provider?"
                  description="Think about HTML, JavaScript, and other scripts a customer&apos;s browser loads when entering card data."
                  options={[
                    { value: "yes", label: "Yes, only from the provider" },
                    { value: "no", label: "No, we inject or control scripts/styles" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.ecommerce.onlyProcessorContent ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, onlyProcessorContent: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Ecommerce"
                  title="Have you confirmed the payment page is protected from script attacks?"
                  description="For example, content security policy (CSP), subresource integrity (SRI), or script change monitoring."
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.ecommerce.scriptSecurityConfirmed ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      ecommerce: { ...prev.ecommerce, scriptSecurityConfirmed: value },
                    }))
                  }
                />
              </div>
            )}

            {state.channel === "moto" && (
              <div className="space-y-4">
                <QuestionCard
                  badge="MOTO"
                  title="Do you accept mail or telephone orders?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                  value={state.moto.acceptsMoto ?? null}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, moto: { ...prev.moto, acceptsMoto: value } }))
                  }
                />
                <QuestionCard
                  badge="MOTO"
                  title="Do you electronically store, process, or transmit card data?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.moto.electronicCardData ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      moto: { ...prev.moto, electronicCardData: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="MOTO"
                  title="Do staff key cards into a web-based virtual terminal one transaction at a time?"
                  options={[
                    { value: "yes", label: "Yes, we use a virtual terminal" },
                    { value: "no", label: "No" },
                  ]}
                  value={state.moto.virtualTerminal ?? null}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, moto: { ...prev.moto, virtualTerminal: value } }))
                  }
                />
                <QuestionCard
                  badge="MOTO"
                  title="Is that workstation isolated from other business systems where possible?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No or not sure" },
                  ]}
                  value={state.moto.isolatedDevice ?? null}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, moto: { ...prev.moto, isolatedDevice: value } }))
                  }
                />
                <QuestionCard
                  badge="MOTO"
                  title="Does the workstation avoid card readers, batch software, or electronic storage of card data?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No or not sure" },
                  ]}
                  value={state.moto.noReadersOrStorage ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      moto: { ...prev.moto, noReadersOrStorage: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="MOTO"
                  title="If you keep card data, is it on paper only?"
                  options={[
                    { value: "yes", label: "Yes, paper only" },
                    { value: "no", label: "No or not sure" },
                  ]}
                  value={state.moto.paperOnly ?? null}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, moto: { ...prev.moto, paperOnly: value } }))
                  }
                />
              </div>
            )}

            {state.channel === "card_present" && (
              <div className="space-y-4">
                <QuestionCard
                  badge="Card-present"
                  title="Do you electronically store any cardholder account data?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.cardPresent.electronicStorage ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      cardPresent: { ...prev.cardPresent, electronicStorage: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Card-present"
                  title="What device type do you primarily use?"
                  options={[
                    { value: "imprint", label: "Imprint machine only" },
                    { value: "dial", label: "Standalone dial-out terminal" },
                    {
                      value: "pts_ip",
                      label: "Standalone IP-connected PTS-approved POI device",
                    },
                    {
                      value: "pos_internet",
                      label: "POS/payment application connected to the Internet",
                    },
                    { value: "p2pe", label: "Validated P2PE solution" },
                    { value: "other", label: "Other or not sure" },
                  ]}
                  value={state.cardPresent.deviceType ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      cardPresent: { ...prev.cardPresent, deviceType: value as CardPresentAnswers["deviceType"] },
                    }))
                  }
                />
                <QuestionCard
                  badge="Card-present"
                  title="Are devices directly connected to other merchant systems?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                  value={state.cardPresent.connectedToOtherSystems ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      cardPresent: { ...prev.cardPresent, connectedToOtherSystems: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Card-present"
                  title="Is the card-present environment limited to a single location or small LAN?"
                  options={[
                    { value: "yes", label: "Yes, single site / LAN" },
                    { value: "no", label: "No, more complex" },
                  ]}
                  value={state.cardPresent.singleLocationLan ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      cardPresent: { ...prev.cardPresent, singleLocationLan: value },
                    }))
                  }
                />
                <QuestionCard
                  badge="Card-present"
                  title="If you retain card data, is it paper only?"
                  options={[
                    { value: "yes", label: "Yes, paper only" },
                    { value: "no", label: "No or not sure" },
                  ]}
                  value={state.cardPresent.paperOnly ?? null}
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      cardPresent: { ...prev.cardPresent, paperOnly: value },
                    }))
                  }
                />
              </div>
            )}

            {state.channel === "service_provider" && (
              <p className="text-sm text-slate-600">
                Because you provide services that impact other organizations&apos; cardholder data
                environment, you are treated as a{" "}
                <span className="font-semibold">service provider</span>. Service providers use SAQ
                D for Service Providers or undergo a full PCI DSS assessment.
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!canContinueFromScope()}
                onClick={handleDetermineSaq}
              >
                See likely SAQ type
              </Button>
            </div>
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
              onContinueChecklist={() => setStep("checklist")}
            />
          </div>
        )}

        {step === "checklist" && result && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {CHECKLISTS[result.saq].title}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Work through these{" "}
                <span className="font-semibold">plain-English compliance checkpoints</span>.
                Unlock to get your full compliance report and checklist.
              </p>
            </div>
            <ChecklistPreview
              saq={result.saq}
              state={checklistState}
              onChange={setChecklistState}
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
          />
        )}
      </div>
    </div>
  );
}

