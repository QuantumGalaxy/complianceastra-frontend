/**
 * SAQ metadata and legacy checklist shell types.
 * All real questions load from PRD JSON (`*_prd_ready.json`) via `loadQuestionnaire` — no static items here.
 */

export type SaqType =
  | "A"
  | "A-EP"
  | "B"
  | "B-IP"
  | "C-VT"
  | "C"
  | "D_MERCHANT"
  | "D_SERVICE_PROVIDER";

export type ChecklistAnswer =
  | "in_place"
  | "in_place_ccw"
  | "not_applicable"
  | "not_tested"
  | "not_in_place"
  | "action_needed"
  | null;

export type ChecklistStateEntry = {
  answer: ChecklistAnswer;
  notes: string;
  ccw_explanation?: string;
};

export type ChecklistState = Record<string, ChecklistStateEntry>;

export type ChecklistItem = {
  id: string;
  label: string;
  pciRef: string;
  type: "scope_question" | "eligibility_confirmation" | "compliance_checkpoint" | "action_item";
  helpText?: string;
};

export type ChecklistSection = {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
};

export type ChecklistDefinition = {
  saq: SaqType;
  title: string;
  estimateLabel: string;
  sections: ChecklistSection[];
};

function prdShell(
  saq: SaqType,
  title: string,
  estimateLabel: string,
): ChecklistDefinition {
  return {
    saq,
    title,
    estimateLabel,
    sections: [],
  };
}

/** Fallback when a flow is not using JSON (should not occur for standard assessments). */
export const CHECKLISTS: Record<SaqType, ChecklistDefinition> = {
  A: prdShell("A", "PCI DSS v4.0.1 SAQ A", "PRD questionnaire (JSON)"),
  "A-EP": prdShell("A-EP", "PCI DSS v4.0.1 SAQ A-EP", "PRD questionnaire (JSON)"),
  B: prdShell("B", "PCI DSS v4.0.1 SAQ B", "PRD questionnaire (JSON)"),
  "B-IP": prdShell("B-IP", "PCI DSS v4.0.1 SAQ B-IP", "PRD questionnaire (JSON)"),
  C: prdShell("C", "PCI DSS v4.0.1 SAQ C", "PRD questionnaire (JSON)"),
  "C-VT": prdShell("C-VT", "PCI DSS v4.0.1 SAQ C-VT", "PRD questionnaire (JSON)"),
  D_MERCHANT: prdShell("D_MERCHANT", "PCI DSS v4.0.1 SAQ D for Merchants", "PRD questionnaire (JSON)"),
  D_SERVICE_PROVIDER: prdShell(
    "D_SERVICE_PROVIDER",
    "PCI DSS v4.0.1 SAQ D for Service Providers",
    "PRD questionnaire (JSON)",
  ),
};
