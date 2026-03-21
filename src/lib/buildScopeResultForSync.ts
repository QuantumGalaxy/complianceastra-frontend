/**
 * Build scope_result JSON for backend PDF + assessment sync (matches ScopeResult / report_service).
 */
import type { SaqType } from "@/components/assessment/checklist-data";
import type { SaqDecisionResult } from "@/lib/saq-decision-engine";
import type { PaymentChannel } from "@/lib/saq-decision-config";
import type { ScopeResult } from "@/lib/api";

function getInScopeOutOfScope(saq: SaqType): { inScope: string[]; outOfScope: string[]; assumptions: string[] } {
  const base = {
    inScope: [] as string[],
    outOfScope: [] as string[],
    assumptions: [] as string[],
  };
  switch (saq) {
    case "A":
      base.inScope = ["Third-party hosted payment pages", "Ecommerce platform and hosting"];
      base.outOfScope = ["Cardholder data storage", "Card data processing on your systems"];
      base.assumptions = [
        "All payment pages delivered by PCI-compliant provider",
        "No electronic storage of card data",
      ];
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
      base.inScope = [
        "Services that store, process, or transmit cardholder data",
        "Customer environments you support",
      ];
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

export function mapPaymentChannelToEnvironmentType(pc: PaymentChannel | null): string {
  switch (pc) {
    case "ecommerce":
      return "ecommerce";
    case "card_present":
      return "pos";
    case "moto":
      return "moto";
    case "service_provider":
      return "payment_platform";
    default:
      return "ecommerce";
  }
}

export function buildScopeResultForSync(params: {
  saq: SaqType;
  decision: SaqDecisionResult;
  paymentChannel: PaymentChannel | null;
}): ScopeResult {
  const { inScope, outOfScope } = getInScopeOutOfScope(params.saq);
  const why = params.decision.why ?? [];
  const summary = params.decision.summary ?? "";

  return {
    summary,
    in_scope: inScope,
    out_of_scope: outOfScope,
    risk_areas: [],
    recommendations: why.slice(0, 8),
    scope_level: "standard",
    suggested_saq: params.saq,
    likely_saq: params.saq,
    confidence: params.decision.riskLevel?.toLowerCase() ?? "medium",
    explanation: why,
    scope_insights: [summary],
    next_steps: why.slice(0, 5),
    environment_classification: mapPaymentChannelToEnvironmentType(params.paymentChannel),
    confidence_score: 80,
  };
}
