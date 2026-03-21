/**
 * Load questionnaire JSON by SAQ type.
 * Structured for future expansion: SAQ C, D, etc. can plug in their own JSON files.
 */

import type { Questionnaire, QuestionnaireItem, QuestionnaireSection } from "./questionnaire-types";
import type { ChecklistDefinition, SaqType } from "@/components/assessment/checklist-data";
import saqBJson from "@/data/saq_b_production_ready.json";
import saqACorrectedJson from "@/data/saq_a_production_ready_corrected.json";
import saqDMerchantFriendlyPrdJson from "@/data/saq_d_merchant_friendly_prd.json";

export type SaqQuestionnaireType = "A" | "B" | "D_MERCHANT";

/** Flat row format from saq_a_production_ready_corrected.json */
type SaqACorrectedRow = {
  section_title: string;
  section_order: number;
  group_title?: string;
  group_order?: number;
  id: string;
  requirement_raw: string;
  question: string;
  help_text?: string;
  options: string[];
  requires_ccw_explanation?: boolean;
  display_order?: number;
  show_requirement_id?: boolean;
  allow_note?: boolean;
  category?: string;
  risk_level?: string;
  ui_hint?: string;
  response_type?: string;
  evidence_examples?: string[];
  tags?: string[];
};

/** Expected requirement IDs from corrected SAQ A (PCI DSS v4.0.1 SAQ A) */
export const EXPECTED_SAQ_A_REQUIREMENT_IDS = [
  "2.2.2",
  "3.1.1",
  "3.2.1",
  "6.3.1",
  "6.3.3",
  "8.2.1",
  "8.2.2",
  "8.2.5",
  "8.3.1",
  "8.3.5",
  "8.3.6",
  "8.3.7",
  "8.3.9",
  "9.4.1",
  "9.4.1.1",
  "9.4.2",
  "9.4.3",
  "9.4.4",
  "9.4.6",
  "11.3.2",
  "11.3.2.1",
  "12.8.1",
  "12.8.2",
  "12.8.3",
  "12.8.4",
  "12.8.5",
  "12.10.1",
] as const;

const FORBIDDEN_LEGACY_SAQ_A_IDS = new Set(["6.4.3", "6.4.3.1", "6.4.3.2"]);

function slugSectionId(sectionOrder: number, sectionTitle: string): string {
  const slug = sectionTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${sectionOrder}-${slug || "section"}`;
}

/** Normalize flat corrected SAQ A JSON into Questionnaire schema */
function normalizeSaqACorrected(raw: SaqACorrectedRow[]): Questionnaire {
  const rows = [...raw].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
  );

  const groupKey = (r: SaqACorrectedRow) => `${r.section_order}::${r.section_title}`;
  const groupOrder: string[] = [];
  for (const r of rows) {
    const k = groupKey(r);
    if (!groupOrder.includes(k)) groupOrder.push(k);
  }

  const sections: QuestionnaireSection[] = groupOrder.map((key) => {
    const first = rows.find((r) => groupKey(r) === key)!;
    const sectionItems = rows
      .filter((r) => groupKey(r) === key)
      .map((item) => ({
        id: item.id,
        requirement_raw: item.requirement_raw,
        question: item.question,
        help_text: item.help_text,
        options: item.options,
        display_order: item.display_order,
        show_requirement_id: item.show_requirement_id ?? true,
        allow_note: item.allow_note ?? true,
        category: item.category,
        risk_level: item.risk_level as QuestionnaireItem["risk_level"],
        ui_hint: item.ui_hint,
        response_type: item.response_type,
        evidence_examples: item.evidence_examples,
        tags: item.tags,
      })) as QuestionnaireItem[];

    return {
      section_id: slugSectionId(first.section_order, first.section_title),
      section_order: first.section_order,
      section_title: first.section_title,
      category: first.category,
      items: sectionItems,
    };
  });

  return {
    framework: "PCI DSS v4.0.1 SAQ A",
    source: "Corrected SAQ A questionnaire (production)",
    sections,
  };
}

/**
 * Validates corrected SAQ A loaded data before use.
 * Throws if required IDs are missing or legacy incorrect IDs appear.
 */
export function validateSaqAQuestionnaire(questionnaire: Questionnaire): void {
  const ids = new Set<string>();
  for (const sec of questionnaire.sections) {
    for (const item of sec.items) {
      ids.add(item.id);
      if (FORBIDDEN_LEGACY_SAQ_A_IDS.has(item.id)) {
        throw new Error(
          `SAQ A validation failed: legacy item "${item.id}" must not appear in corrected questionnaire.`,
        );
      }
    }
  }

  const missing: string[] = [];
  for (const expected of EXPECTED_SAQ_A_REQUIREMENT_IDS) {
    if (!ids.has(expected)) missing.push(expected);
  }
  if (missing.length > 0) {
    throw new Error(
      `SAQ A validation failed: missing requirement ID(s): ${missing.join(", ")}. Expected ${EXPECTED_SAQ_A_REQUIREMENT_IDS.length} items.`,
    );
  }

  const expectedSet = new Set<string>(EXPECTED_SAQ_A_REQUIREMENT_IDS);
  const unexpected = [...ids].filter((id) => !expectedSet.has(id));
  if (unexpected.length > 0) {
    throw new Error(`SAQ A validation failed: unexpected requirement ID(s): ${unexpected.join(", ")}`);
  }

  let itemCount = 0;
  for (const sec of questionnaire.sections) {
    itemCount += sec.items.length;
  }
  if (itemCount !== EXPECTED_SAQ_A_REQUIREMENT_IDS.length) {
    throw new Error(
      `SAQ A validation failed: expected ${EXPECTED_SAQ_A_REQUIREMENT_IDS.length} items, found ${itemCount} (check for duplicates).`,
    );
  }
}

function loadSaqA(): Questionnaire {
  const rows = saqACorrectedJson as SaqACorrectedRow[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("SAQ A: corrected JSON must be a non-empty array.");
  }
  const questionnaire = normalizeSaqACorrected(rows);
  validateSaqAQuestionnaire(questionnaire);
  return questionnaire;
}

/** Source shape for `saq_d_merchant_friendly_prd.json` */
type SaqDMerchantPrdSection = {
  id: string;
  requirement: string;
  title: string;
  merchant_friendly_summary: string;
  questions: string[];
};

type SaqDMerchantPrdFile = {
  document: { name: string; notes?: string[] };
  saq_type: string;
  sections: SaqDMerchantPrdSection[];
};

const SAQ_D_MERCHANT_RESPONSE_OPTIONS: string[] = [
  "In Place",
  "In Place with CCW",
  "Not Applicable",
  "Not Tested",
  "Not in Place",
];

/**
 * Normalizes SAQ D merchant-friendly PRD JSON into the shared Questionnaire schema.
 * Section order follows the JSON array (Requirements 1–12).
 */
export function normalizeSaqDMerchantFriendly(raw: SaqDMerchantPrdFile): Questionnaire {
  if (!raw?.sections?.length) {
    throw new Error("SAQ D merchant-friendly: JSON must contain sections.");
  }
  const sections: QuestionnaireSection[] = raw.sections.map((sec, idx) => {
    const section_order = idx + 1;
    const items: QuestionnaireItem[] = sec.questions.map((q, i) => ({
      id: `${sec.id}_q${i}`,
      section_id: sec.id,
      requirement_raw: sec.requirement,
      question: q,
      help_text: i === 0 ? sec.merchant_friendly_summary : undefined,
      options: [...SAQ_D_MERCHANT_RESPONSE_OPTIONS],
      display_order: i + 1,
      show_requirement_id: true,
      allow_note: true,
    }));
    return {
      section_id: sec.id,
      section_order,
      section_title: sec.title,
      section_summary: sec.merchant_friendly_summary,
      items,
    };
  });

  return {
    framework: raw.document?.name ?? "PCI DSS SAQ D for Merchants",
    source: "saq_d_merchant_friendly_prd.json (merchant-friendly PRD)",
    sections,
  };
}

function loadSaqDMerchant(): Questionnaire {
  const raw = saqDMerchantFriendlyPrdJson as SaqDMerchantPrdFile;
  return normalizeSaqDMerchantFriendly(raw);
}

const QUESTIONNAIRE_MAP: Record<SaqQuestionnaireType, () => Questionnaire> = {
  A: loadSaqA,
  B: () => saqBJson as Questionnaire,
  D_MERCHANT: loadSaqDMerchant,
};

export function loadQuestionnaire(saq: SaqQuestionnaireType): Questionnaire {
  const loader = QUESTIONNAIRE_MAP[saq];
  if (!loader) {
    throw new Error(`No questionnaire configured for SAQ type: ${saq}`);
  }
  return loader();
}

/** Check if an SAQ type has a JSON-driven questionnaire */
export function hasJsonQuestionnaire(saq: string): saq is SaqQuestionnaireType {
  return saq in QUESTIONNAIRE_MAP;
}

/** Convert questionnaire JSON to ChecklistDefinition for report/reporting compatibility */
export function questionnaireToChecklistDefinition(
  questionnaire: Questionnaire,
  saq: SaqType
): ChecklistDefinition {
  const sections = questionnaire.sections
    .sort((a, b) => a.section_order - b.section_order)
    .map((sec) => ({
      id: sec.section_id,
      title: sec.section_title,
      description: sec.section_summary,
      items: sec.items
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
        .map((item) => ({
          id: item.id,
          label: item.question,
          pciRef:
            saq === "D_MERCHANT" && item.requirement_raw
              ? `${item.requirement_raw} · ${item.id}`
              : `PCI Ref: ${item.id}`,
          type: "compliance_checkpoint" as const,
          helpText: item.help_text,
        })),
    }));

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

  return {
    saq,
    title: questionnaire.framework,
    estimateLabel: `Approx. ${totalItems} requirements`,
    sections,
  };
}

/** Build structured response payload for submission/export (JSON-driven questionnaires) */
export type QuestionnaireResponsePayload = {
  questionnaire_type: string;
  responses: {
    section_id: string;
    requirement_id: string;
    section_title: string;
    requirement_raw: string;
    question: string;
    selected_response: string;
    note: string;
    ccw_explanation?: string;
  }[];
};

export function buildQuestionnairePayload(
  questionnaire: Questionnaire,
  checklistState: Record<string, { answer: string | null; notes: string; ccw_explanation?: string }>,
  questionnaireType: string
): QuestionnaireResponsePayload {
  const responses: QuestionnaireResponsePayload["responses"] = [];
  for (const section of questionnaire.sections) {
    const items = [...section.items].sort(
      (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
    );
    for (const item of items) {
      const state = checklistState[item.id];
      if (!state?.answer) continue;
      responses.push({
        section_id: section.section_id,
        requirement_id: item.id,
        section_title: section.section_title,
        requirement_raw: item.requirement_raw,
        question: item.question,
        selected_response: state.answer,
        note: state.notes ?? "",
        ccw_explanation: state.ccw_explanation,
      });
    }
  }
  return { questionnaire_type: questionnaireType, responses };
}
