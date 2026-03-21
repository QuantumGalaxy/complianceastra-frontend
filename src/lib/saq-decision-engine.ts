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
    if (
      state.card_present_stores_chd === "no" &&
      state.card_present_how == null
    ) {
      return "card_present_how";
    }
    return null;
  }

  if (state.payment_channel === "moto") {
    if (state.moto_stores_chd == null) return "moto_stores_chd";
    if (
      state.moto_stores_chd === "no" &&
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
 * Clears the last answered eligibility field for the current payment channel.
 * Does not clear payment_channel.
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
      return {
        ...s,
        card_present_stores_chd: undefined,
        card_present_how: undefined,
      };
    }
    return s;
  }

  if (ch === "moto") {
    if (s.moto_stores_chd === "no" && s.moto_how_process != null) {
      return { ...s, moto_how_process: undefined };
    }
    if (s.moto_stores_chd != null) {
      return {
        ...s,
        moto_stores_chd: undefined,
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
    a.service_provider_handles_chd_for_others ===
      b.service_provider_handles_chd_for_others &&
    a.card_present_stores_chd === b.card_present_stores_chd &&
    a.card_present_how === b.card_present_how &&
    a.moto_stores_chd === b.moto_stores_chd &&
    a.moto_how_process === b.moto_how_process &&
    a.ecommerce_payment_page === b.ecommerce_payment_page
  );
}

/**
 * Produces wizard state where at least one eligibility question is unanswered again.
 */
export function stateForReopeningEligibilityWizard(
  state: WizardStateV2
): WizardStateV2 {
  let s: WizardStateV2 = { ...state, saq: null };
  for (let i = 0; i < 12; i++) {
    if (getNextQuestionId(s) !== null || !s.payment_channel) break;
    const next = stripLastEligibilityAnswer(s);
    if (eligibilityFieldsEqual(next, s)) break;
    s = next;
  }
  return s;
}

export function resolveSaqDecision(
  state: WizardStateV2
): SaqDecisionResult | null {
  if (getNextQuestionId(state) !== null) return null;

  const ch = state.payment_channel;
  if (!ch) return null;

  // SERVICE PROVIDER
  if (ch === "service_provider") {
    if (state.service_provider_handles_chd_for_others === "yes") {
      return {
        saq: "D_SERVICE_PROVIDER",
        why: [
          "You confirmed you provide services that store, process, or transmit cardholder data for other businesses.",
          "This falls under SAQ D for Service Providers rather than a merchant SAQ.",
        ],
        summary:
          "Based on your answers, you should complete SAQ D for Service Providers (or follow your assessor/acquirer guidance for a full assessment).",
        riskLevel: riskForSaq("D_SERVICE_PROVIDER"),
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "You selected the service provider path but answered that you do not handle other businesses’ cardholder data.",
        "That usually means you should return and choose a merchant payment channel instead.",
      ],
      summary:
        "Your answers do not match the service provider path. Please go back and choose the correct merchant payment channel, or use SAQ D for Merchants as a conservative fallback.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  // CARD PRESENT
  if (ch === "card_present") {
    const stores = state.card_present_stores_chd;

    if (stores === "yes" || stores === "unsure") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Storing cardholder data, or being unsure whether it is stored, generally places you in full merchant PCI scope.",
          "SAQ B, B-IP, C, and C-VT assume you do not store cardholder data electronically after the transaction.",
        ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or a broader PCI assessment.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }

    const how = state.card_present_how;

    if (how === "imprint_dial") {
      return {
        saq: "B",
        why: [
          "You do not store cardholder data and use imprint or standalone dial-out terminals without internet-based processing.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B if you meet all SAQ B eligibility criteria.",
        riskLevel: riskForSaq("B"),
      };
    }

    if (how === "pts_ip") {
      return {
        saq: "B-IP",
        why: [
          "You do not store cardholder data and use standalone PTS-approved payment terminals connected via IP.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B-IP if you meet all SAQ B-IP eligibility criteria.",
        riskLevel: riskForSaq("B-IP"),
      };
    }

    if (how === "pos_internet") {
      return {
        saq: "C",
        why: [
          "You use an internet-connected POS system or payment application and indicated no stored cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C if your environment matches PCI’s SAQ C criteria.",
        riskLevel: riskForSaq("C"),
      };
    }

    if (how === "virtual_terminal") {
      return {
        saq: "C-VT",
        why: [
          "You use a browser-based virtual terminal and indicated no stored cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C-VT if you meet all SAQ C-VT eligibility criteria.",
        riskLevel: riskForSaq("C-VT"),
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "Your card-present processing method was not fully identified.",
      ],
      summary:
        "Please review your answers or use SAQ D for Merchants as a conservative fallback.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  // MOTO
  if (ch === "moto") {
    const stores = state.moto_stores_chd;

    if (stores === "yes" || stores === "unsure") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Storing cardholder data, or being unsure whether it is stored, in a MOTO environment usually requires full merchant PCI scope.",
        ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or a full PCI assessment.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }

    const proc = state.moto_how_process;

    if (proc === "outsourced") {
      return {
        saq: "A",
        why: [
          "Your MOTO payment functions are completely outsourced to a PCI DSS compliant provider and you do not retain cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A if you meet all SAQ A eligibility criteria.",
        riskLevel: riskForSaq("A"),
      };
    }

    if (proc === "imprint_dial") {
      return {
        saq: "B",
        why: [
          "You use imprint or dial-out methods for MOTO payments and do not retain cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B if you meet all SAQ B eligibility criteria.",
        riskLevel: riskForSaq("B"),
      };
    }

    if (proc === "pts_ip") {
      return {
        saq: "B-IP",
        why: [
          "You use standalone PTS-approved terminals with internet connectivity for MOTO payments and do not retain cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ B-IP if you meet all SAQ B-IP eligibility criteria.",
        riskLevel: riskForSaq("B-IP"),
      };
    }

    if (proc === "pos_application") {
      return {
        saq: "C",
        why: [
          "You use a POS system or payment application to process MOTO payments without storing cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C if your environment matches PCI’s SAQ C criteria.",
        riskLevel: riskForSaq("C"),
      };
    }

    if (proc === "virtual_terminal") {
      return {
        saq: "C-VT",
        why: [
          "You process MOTO payments through a browser-based virtual terminal and do not store cardholder data.",
        ],
        summary:
          "Based on your answers, you should complete SAQ C-VT if you meet all SAQ C-VT eligibility criteria.",
        riskLevel: riskForSaq("C-VT"),
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "Your MOTO flow is mixed, unclear, or outside the narrower SAQ A/B/B-IP/C/C-VT paths.",
      ],
      summary:
        "Based on your answers, you should plan for SAQ D for Merchants or confirm the correct SAQ with your acquirer.",
      riskLevel: riskForSaq("D_MERCHANT"),
    };
  }

  // ECOMMERCE
  if (ch === "ecommerce") {
    const page = state.ecommerce_payment_page;

    if (page === "redirect" || page === "iframe_embedded") {
      return {
        saq: "A",
        why: [
          "The payment page is handled entirely by a PCI DSS compliant third party using redirect or a provider-hosted iframe.",
          "Your systems do not directly receive or process cardholder data in this model.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A if you meet all SAQ A eligibility criteria.",
        riskLevel: riskForSaq("A"),
      };
    }

    if (page === "direct_post_js") {
      return {
        saq: "A-EP",
        why: [
          "Your website influences how payment data is sent, such as via Direct Post, JavaScript, or a similar merchant-controlled payment page flow.",
        ],
        summary:
          "Based on your answers, you should complete SAQ A-EP.",
        riskLevel: riskForSaq("A-EP"),
      };
    }

    if (page === "merch_servers_touch") {
      return {
        saq: "D_MERCHANT",
        why: [
          "Your servers receive, process, store, or otherwise touch cardholder data, which places you in full merchant PCI scope.",
        ],
        summary:
          "Based on your answers, you should plan for SAQ D for Merchants or a full assessment.",
        riskLevel: riskForSaq("D_MERCHANT"),
      };
    }

    return {
      saq: "D_MERCHANT",
      why: [
        "Your e-commerce payment-page setup was not fully identified.",
      ],
      summary:
        "Please review your answers or use SAQ D for Merchants as a conservative fallback.",
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

      // Reset all branch-specific answers
      next.service_provider_handles_chd_for_others = undefined;
      next.card_present_stores_chd = undefined;
      next.card_present_how = undefined;
      next.moto_stores_chd = undefined;
      next.moto_how_process = undefined;
      next.ecommerce_payment_page = undefined;
      break;

    case "service_provider_handles_chd_for_others":
      next.service_provider_handles_chd_for_others = value as "yes" | "no";
      break;

    case "card_present_stores_chd":
      next.card_present_stores_chd =
        value as WizardStateV2["card_present_stores_chd"];
      next.card_present_how = undefined;
      break;

    case "card_present_how":
      next.card_present_how = value as WizardStateV2["card_present_how"];
      break;

    case "moto_stores_chd":
      next.moto_stores_chd = value as WizardStateV2["moto_stores_chd"];
      next.moto_how_process = undefined;
      break;

    case "moto_how_process":
      next.moto_how_process = value as WizardStateV2["moto_how_process"];
      break;

    case "ecommerce_payment_page":
      next.ecommerce_payment_page =
        value as WizardStateV2["ecommerce_payment_page"];
      break;

    default:
      break;
  }

  return next;
}