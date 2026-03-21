/**
 * PCI SAQ questionnaires — single source of truth: `*_prd_ready.json` files in `src/data/`.
 */

import type { Questionnaire, QuestionnaireItem, QuestionnaireSection } from "./questionnaire-types";
import type { ChecklistDefinition, SaqType } from "@/components/assessment/checklist-data";

import saqAPrdReady from "@/data/saq_a_prd_ready.json";
import saqAEpPrdReady from "@/data/saq_a_ep_prd_ready.json";
import saqBPrdReady from "@/data/saq_b_prd_ready.json";
import saqBIpPrdReady from "@/data/saq_b_ip_prd_ready.json";
import saqCPrdReady from "@/data/saq_c_prd_ready.json";
import saqCVtPrdReady from "@/data/saq_c_vt_prd_ready.json";
import saqDMerchantPrdReady from "@/data/saq_d_merchant_prd_ready.json";
import saqDServiceProviderPrdReady from "@/data/saq_d_service_provider_prd_ready.json";

/** Every merchant SAQ type is backed by a PRD JSON file. */
export type SaqQuestionnaireType = SaqType;

const PRD_FILE_BY_SAQ: Record<SaqQuestionnaireType, { data: unknown; filename: string }> = {
  A: { data: saqAPrdReady, filename: "saq_a_prd_ready.json" },
  "A-EP": { data: saqAEpPrdReady, filename: "saq_a_ep_prd_ready.json" },
  B: { data: saqBPrdReady, filename: "saq_b_prd_ready.json" },
  "B-IP": { data: saqBIpPrdReady, filename: "saq_b_ip_prd_ready.json" },
  C: { data: saqCPrdReady, filename: "saq_c_prd_ready.json" },
  "C-VT": { data: saqCVtPrdReady, filename: "saq_c_vt_prd_ready.json" },
  D_MERCHANT: { data: saqDMerchantPrdReady, filename: "saq_d_merchant_prd_ready.json" },
  D_SERVICE_PROVIDER: { data: saqDServiceProviderPrdReady, filename: "saq_d_service_provider_prd_ready.json" },
};

/** Raw section shape from PRD JSON (matches exported files). */
type PrdSectionJson = {
  section_id: string;
  section_order: number;
  section_title: string;
  category?: string;
  items: Record<string, unknown>[];
};

type PrdFileJson = {
  framework?: string;
  source?: string;
  sections: PrdSectionJson[];
};

function normalizeRisk(v: unknown): QuestionnaireItem["risk_level"] {
  if (v === "low" || v === "medium" || v === "high") return v;
  return undefined;
}

function normalizePrdItem(raw: Record<string, unknown>, sectionId: string): QuestionnaireItem {
  const options = Array.isArray(raw.options)
    ? (raw.options as unknown[]).map((o) => String(o))
    : ["In Place", "Not Applicable", "Action Needed"];

  const expected = Array.isArray(raw.expected_testing_raw)
    ? (raw.expected_testing_raw as unknown[]).map((x) => String(x).trim()).filter(Boolean)
    : undefined;

  return {
    id: String(raw.id ?? "").trim(),
    section_id: sectionId,
    requirement_raw: String(raw.requirement_raw ?? ""),
    question: String(raw.question ?? "").trim(),
    help_text: raw.help_text != null ? String(raw.help_text) : undefined,
    expected_testing_raw: expected?.length ? expected : undefined,
    options,
    display_order: typeof raw.display_order === "number" ? raw.display_order : undefined,
    category: raw.category != null ? String(raw.category) : undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as unknown[]).map((t) => String(t)) : undefined,
    risk_level: normalizeRisk(raw.risk_level),
    ui_hint: raw.ui_hint != null ? String(raw.ui_hint) : undefined,
    response_type: raw.response_type != null ? String(raw.response_type) : undefined,
    evidence_examples: Array.isArray(raw.evidence_examples)
      ? (raw.evidence_examples as unknown[]).map((e) => String(e))
      : undefined,
    show_requirement_id: raw.show_requirement_id !== false,
    allow_note: raw.allow_note !== false,
  };
}

/**
 * Validates PRD JSON at load time. Fails fast with a clear message if structure is wrong.
 */
export function validatePrdQuestionnaireFile(raw: unknown, fileLabel: string): asserts raw is PrdFileJson {
  if (!raw || typeof raw !== "object") {
    throw new Error(`[${fileLabel}] Invalid questionnaire file: expected an object.`);
  }
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.sections) || o.sections.length === 0) {
    throw new Error(`[${fileLabel}] Invalid questionnaire file: "sections" must be a non-empty array.`);
  }
  let itemCount = 0;
  for (let si = 0; si < o.sections.length; si++) {
    const sec = o.sections[si];
    if (!sec || typeof sec !== "object") {
      throw new Error(`[${fileLabel}] Invalid section at index ${si}.`);
    }
    const s = sec as Record<string, unknown>;
    if (!Array.isArray(s.items)) {
      throw new Error(`[${fileLabel}] Section "${String(s.section_title)}" has no items array.`);
    }
    for (let ii = 0; ii < s.items.length; ii++) {
      const it = s.items[ii];
      if (!it || typeof it !== "object") {
        throw new Error(`[${fileLabel}] Invalid item at section ${si}, index ${ii}.`);
      }
      const item = it as Record<string, unknown>;
      const id = typeof item.id === "string" ? item.id.trim() : "";
      if (!id) {
        throw new Error(`[${fileLabel}] Item at section ${si}, index ${ii} is missing a valid "id".`);
      }
      const q = typeof item.question === "string" ? item.question.trim() : "";
      if (!q) {
        throw new Error(`[${fileLabel}] Item "${id}" is missing a valid "question".`);
      }
      itemCount++;
    }
  }
  if (itemCount === 0) {
    throw new Error(`[${fileLabel}] No questionnaire items found under sections.`);
  }
}

function parsePrdQuestionnaire(raw: PrdFileJson, filename: string): Questionnaire {
  const sections: QuestionnaireSection[] = [...raw.sections]
    .sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0))
    .map((sec) => {
      const section_id = String(sec.section_id ?? "").trim() || `sec-${sec.section_order}`;
      const items = [...sec.items]
        .map((row) => normalizePrdItem(row as Record<string, unknown>, section_id))
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));

      return {
        section_id,
        section_order: sec.section_order,
        section_title: sec.section_title,
        category: sec.category,
        items,
      };
    });

  return {
    framework: raw.framework ?? "PCI DSS SAQ",
    source: `${filename} (PRD)`,
    sections,
  };
}

function loadPrdForSaq(saq: SaqQuestionnaireType): Questionnaire {
  const { data, filename } = PRD_FILE_BY_SAQ[saq];
  validatePrdQuestionnaireFile(data, filename);
  return parsePrdQuestionnaire(data as PrdFileJson, filename);
}

const QUESTIONNAIRE_MAP: Record<SaqQuestionnaireType, () => Questionnaire> = {
  A: () => loadPrdForSaq("A"),
  "A-EP": () => loadPrdForSaq("A-EP"),
  B: () => loadPrdForSaq("B"),
  "B-IP": () => loadPrdForSaq("B-IP"),
  C: () => loadPrdForSaq("C"),
  "C-VT": () => loadPrdForSaq("C-VT"),
  D_MERCHANT: () => loadPrdForSaq("D_MERCHANT"),
  D_SERVICE_PROVIDER: () => loadPrdForSaq("D_SERVICE_PROVIDER"),
};

export function loadQuestionnaire(saq: SaqQuestionnaireType): Questionnaire {
  const loader = QUESTIONNAIRE_MAP[saq];
  if (!loader) {
    throw new Error(`No PRD questionnaire configured for SAQ type: ${saq}`);
  }
  return loader();
}

/** True when this SAQ type uses a PRD JSON checklist (all merchant SAQs in this app). */
export function hasJsonQuestionnaire(saq: string): saq is SaqQuestionnaireType {
  return saq in QUESTIONNAIRE_MAP;
}

/** Convert questionnaire JSON to ChecklistDefinition for report/reporting compatibility */
export function questionnaireToChecklistDefinition(
  questionnaire: Questionnaire,
  saq: SaqType,
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
          pciRef: `PCI DSS ${item.id}`,
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
  questionnaireType: string,
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
