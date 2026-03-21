/**
 * Resolves SAQ type from WizardStateV2 using official-style eligibility branches.
 */

import type { SaqType } from "@/components/assessment/checklist-data";
import type { WizardStateV2 } from "./saq-decision-config";

export type SaqDecisionResult = {
  saq: SaqType;
  why: string[];
  summary: string;
  riskLevel: "Low" | "Medium" | "High";
};

function riskForSaq(saq: SaqType): "Low" | "Medium" | "High" {
  switch (saq) {
    case "A":
    case "B":
    case "B-IP":
      return "Low";
    case "A-EP":
    case "C":
    case "C-VT":
      return "Medium";
    case "D_MERCHANT":
    case "D_SERVICE_PROVIDER":
    default:
      return "High";
  }
}

/**
 * Returns the next question id to show, or null if wizard should finalize (compute SAQ).
 */
export function getNextQuestionId(state: WizardStateV2): string | null {
  if (!state.payment_channel) return "payment_channel";

  if (state.payment_channel === "service_provider") {
    if (state.service_provider_handles_chd_for_others == null) {
      return "service_provider_handles_chd_for_others";
    }
    return null;
  }

  if (state.payment_channel === "card_present") {
    if (state.card_present_stores_chd == null) return "card_present_stores_chd";
    if (state.card_present_stores_chd === "no" && state.card_present_how == null) {
      return "card_present_how";
    }
    return null;
  }

  if (state.payment_channel === "moto") {
    if (state.moto_stores_chd == null) return "moto_stores_chd";
    if (state.moto_stores_chd === "no" && state.moto_fully_outsourced == null) {
      return "moto_fully_outsourced";
    }
    if (
      state.moto_stores_chd === "no" &&
      state.moto_fully_outsourced === "no" &&
      state.moto_how_process == null
    ) {
      return "moto_how_process";
    }
    return null;
  }

  if (state.payment_channel === "ecommerce") {
    if (state.ecommerce_payment_page == null) return "ecommerce_payment_page";
    return null;
  }

  return null;
}

/**
 * Clears the last answered eligibility field for the current payment channel (inverse of completing the tree).
 * Does not clear payment_channel. Used when the user wants to edit eligibility after seeing a result.
 */
export function stripLastEligibilityAnswer(state: WizardStateV2): WizardStateV2 {
  const s: WizardStateV2 = { ...state, saq: null };
  const ch = s.payment_channel;
  if (!ch) return s;

  if (ch === "service_provider") {
    if (s.service_provider_handles_chd_for_others != null) {
      return { ...s, service_provider_handles_chd_for_others: undefined };
    }
    return s;
  }

  if (ch === "card_present") {
    if (s.card_present_stores_chd === "no" && s.card_present_how != null) {
      return { ...s, card_present_how: undefined };
    }
    if (s.card_present_stores_chd != null) {
      return { ...s, card_present_stores_chd: undefined, card_present_how: undefined };
    }
    return s;
  }

  if (ch === "moto") {
    if (
      s.moto_stores_chd === "no" &&
      s.moto_fully_outsourced === "no" &&
      s.moto_how_process != null
    ) {
      return { ...s, moto_how_process: undefined };
    }
    if (s.moto_stores_chd === "no" && s.moto_fully_outsourced != null) {
      return { ...s, moto_fully_outsourced: undefined, moto_how_process: undefined };
    }
    if (s.moto_stores_chd != null) {
      return {
        ...s,
        moto_stores_chd: undefined,
        moto_fully_outsourced: undefined,
        moto_how_process: undefined,
      };
    }
    return s;
  }

  if (ch === "ecommerce") {
    if (s.ecommerce_payment_page != null) {
      return { ...s, ecommerce_payment_page: undefined };
    }
    return s;
  }

  return s;
}

function eligibilityFieldsEqual(a: WizardStateV2, b: WizardStateV2): boolean {
  return (
    a.service_provider_handles_chd_for_others === b.service_provider_handles_chd_for_others &&
    a.card_present_stores_chd === b.card_present_stores_chd &&
    a.card_present_how === b.card_present_how &&
    a.moto_stores_chd === b.moto_stores_chd &&
    a.moto_fully_outsourced === b.moto_fully_outsourced &&
    a.moto_how_process === b.moto_how_process &&
    a.ecommerce_payment_page === b.ecommerce_payment_page
  );
}

/**
 * Produces wizard state where at least one eligibility question is unanswered again, so SaqScopeWizard can run.
 * Keeps payment_channel (and preset from /assessments/new). Clears resolved SAQ until the user finishes again.
 */
export function stateForReopeningEligibilityWizard(state: WizardStateV2): WizardStateV2 {
  let s: WizardStateV2 = { ...state, saq: null };
  for (let i = 0; i < 12; i++) {
    if (getNextQuestionId(s) !== null || !s.payment_channel) break;
    const next = stripLastEligibilityAnswer(s);
    if (eligibilityFieldsEqual(next, s)) break;
    s = next;
  }
  return s;
}

export function resolveSaqDecision(state: WizardStateV2): SaqDecisionResult | null {
  if (getNextQuestionId(state) !== null) return null;

  const ch = state.payment_channel;
  if (!ch) return null;

  if (ch === "service_provider") {
    if (state.service_provider_handles_chd_for_others === "yes") {
      return {
        saq: "D_SERVICE_PROVIDER",
        why: [
          "You confirmed you are a service provider that handles cardholder data for other businesses.",
          "PCI DSS treats this as SAQ D for Service Providers (or a full assessment), not a merchant SAQ A–C.",
        ],
        summary:
          "Based on your answers, you should complete SAQ D for Service Providers (or follow your acquirer’s instructions for a full ROC).",
        riskLevel: riskForSaq("D_SERVICE_PROVIDER"),
      };
    }
    return {
      saq: "D_MERCHANT",
      why: [
        "You chose the service provider path but indicated you may not handle other businesses’ cardholder data in scope.",
        "If you are a merchant only, use the merchant path; otherwise confirm scope with your acquirer.",
      ],
        summary:
          "We’ve pointed you to SAQ D for Merchants as a conservative default. If you truly have no cardholder data environment, confirm with your acquirer.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  if (ch === "card_present") {
    const stores = state.card_present_stores_chd;
    if (stores === "yes" || stores === "unsure") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Storing cardholder data (or uncertainty about storage) typically brings full PCI DSS merchant scope.",
          "SAQ B, B-IP, and C assume no electronic storage of account data.",
        ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants (or equivalent full assessment). Confirm with your acquirer or QSA.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }
    const how = state.card_present_how;
    if (how === "imprint_dial") {
      return {
        saq: "B",
        why: [
          "You do not store cardholder data and use imprint or dial-out terminals without internet connectivity for card data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B (imprint / standalone dial-out), if all other SAQ B eligibility criteria from PCI apply.",
        riskLevel: riskForSaq("B"),
      };
    }
    if (how === "pts_ip") {
      return {
        saq: "B-IP",
        why: [
          "You use PTS-approved payment devices connected via IP and do not store cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B-IP (standalone IP-connected PTS devices), subject to PCI eligibility notes.",
        riskLevel: riskForSaq("B-IP"),
      };
    }
    if (how === "pos_internet") {
      return {
        saq: "C",
        why: [
          "You use an internet-connected POS or payment application and do not store cardholder data electronically.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C, if your environment matches PCI’s SAQ C description.",
        riskLevel: riskForSaq("C"),
      };
    }
    if (how === "virtual_terminal") {
      return {
        saq: "C-VT",
        why: [
          "You process via a browser-based virtual terminal and indicated no storage of cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C-VT (virtual terminal on an isolated workstation), if you meet all PCI eligibility criteria.",
        riskLevel: riskForSaq("C-VT"),
      };
    }
    return {
      saq: "D_MERCHANT",
      why: ["Card-present path incomplete or unrecognized — defaulting to full merchant scope."],
      summary: "Please review your answers or choose SAQ D for Merchants after consulting your acquirer.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  if (ch === "moto") {
    const ms = state.moto_stores_chd;
    if (ms === "yes" || ms === "unsure") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Storing cardholder data (or uncertainty) in a MOTO context usually requires full PCI DSS merchant scope.",
        ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or a full assessment. Confirm with your acquirer.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }
    if (state.moto_fully_outsourced === "yes") {
      return {
        saq: "A",
        why: [
          "You do not store cardholder data and payment functions are fully outsourced to a PCI-compliant provider.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A for fully outsourced card-not-present processing, if you meet all PCI SAQ A eligibility criteria.",
        riskLevel: riskForSaq("A"),
      };
    }
    const proc = state.moto_how_process;
    if (proc === "virtual_terminal") {
      return {
        saq: "C-VT",
        why: [
          "Payment is not fully outsourced; you use a web-based virtual terminal with no storage indicated.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C-VT if your workstation and process match PCI’s definition.",
        riskLevel: riskForSaq("C-VT"),
      };
    }
    if (proc === "pos_application") {
      return {
        saq: "C",
        why: ["You use a POS system or application to process MOTO payments without full outsourcing."],
        summary:
          "Based on your answers, you should complete SAQ C if your environment matches PCI’s SAQ C criteria.",
        riskLevel: riskForSaq("C"),
      };
    }
    return {
      saq: "D_MERCHANT",
      why: [
        "Mixed or unclear MOTO processing typically needs a broader assessment than SAQ A or C-VT alone.",
      ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or confirm the correct SAQ with your acquirer.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  if (ch === "ecommerce") {
    const page = state.ecommerce_payment_page;
    if (page === "redirect" || page === "iframe_embedded") {
      return {
        saq: "A",
        why: [
          "Payment is fully outsourced to a compliant provider and the customer pays via redirect or provider-hosted embedded form.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A, if you meet all PCI SAQ A eligibility criteria (no electronic storage/processing/transmission of account data on your systems).",
        riskLevel: riskForSaq("A"),
      };
    }
    if (page === "direct_post_js") {
      return {
        saq: "A-EP",
        why: [
          "Your website influences how payment data is sent (e.g. direct post or JavaScript on your pages), so the merchant environment affects payment page security.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A-EP (ecommerce with merchant-controlled payment page influence).",
        riskLevel: riskForSaq("A-EP"),
      };
    }
    if (page === "merch_servers_touch") {
      return {
        saq: "D_MERCHANT",
        why: ["Your servers process or touch card data — full merchant PCI DSS scope applies."],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or a full assessment.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }
    return {
      saq: "D_MERCHANT",
      why: ["E-commerce path incomplete — conservative default."],
      summary: "Please review your answers or use SAQ D for Merchants after consulting your acquirer.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  return null;
}

export function applyAnswer(
  state: WizardStateV2,
  questionId: string,
  value: string
): WizardStateV2 {
  const next: WizardStateV2 = { ...state };

  switch (questionId) {
    case "payment_channel":
      next.payment_channel = value as WizardStateV2["payment_channel"];
      next.saq = null;
      next.service_provider_handles_chd_for_others = undefined;
      next.card_present_stores_chd = undefined;
      next.card_present_how = undefined;
      next.moto_stores_chd = undefined;
      next.moto_fully_outsourced = undefined;
      next.moto_how_process = undefined;
      next.ecommerce_payment_page = undefined;
      break;
    case "service_provider_handles_chd_for_others":
      next.service_provider_handles_chd_for_others = value as "yes" | "no";
      break;
    case "card_present_stores_chd":
      next.card_present_stores_chd = value as WizardStateV2["card_present_stores_chd"];
      next.card_present_how = undefined;
      break;
    case "card_present_how":
      next.card_present_how = value as WizardStateV2["card_present_how"];
      break;
    case "moto_stores_chd":
      next.moto_stores_chd = value as WizardStateV2["moto_stores_chd"];
      next.moto_fully_outsourced = undefined;
      next.moto_how_process = undefined;
      break;
    case "moto_fully_outsourced":
      next.moto_fully_outsourced = value as "yes" | "no";
      next.moto_how_process = undefined;
      break;
    case "moto_how_process":
      next.moto_how_process = value as WizardStateV2["moto_how_process"];
      break;
    case "ecommerce_payment_page":
      next.ecommerce_payment_page = value as WizardStateV2["ecommerce_payment_page"];
      break;
    default:
      break;
  }

  return next;
}
