/**
 * Load questionnaire JSON by SAQ type.
 * Structured for future expansion: SAQ C, D, etc. can plug in their own JSON files.
 */

import type { Questionnaire, QuestionnaireItem, QuestionnaireSection } from "./questionnaire-types";
import type { ChecklistDefinition, SaqType } from "@/components/assessment/checklist-data";
import saqBJson from "@/data/saq_b_production_ready.json";
import saqAJson from "@/data/saq_a_production_ready.json";

export type SaqQuestionnaireType = "A" | "B"; // Future: "C" | "D" | ...

/** SAQ A uses array-of-sections format; normalize to Questionnaire schema */
type SaqARawSection = {
  section: string;
  section_order: number;
  items: {
    id: string;
    requirement_raw: string;
    question: string;
    help_text?: string;
    options: string[];
    requires_ccw_explanation?: boolean;
  }[];
};

function normalizeSaqA(raw: SaqARawSection[]): Questionnaire {
  const sections: QuestionnaireSection[] = raw.map((sec, secIdx) => ({
    section_id: String(secIdx + 1),
    section_order: sec.section_order,
    section_title: sec.section,
    items: sec.items.map((item, itemIdx) => ({
      id: item.id,
      requirement_raw: item.requirement_raw,
      question: item.question,
      help_text: item.help_text,
      options: item.options,
      display_order: itemIdx + 1,
      show_requirement_id: true,
      allow_note: true,
    })) as QuestionnaireItem[],
  }));

  return {
    framework: "PCI DSS v4.0.1 SAQ A",
    source: "Fully outsourced ecommerce / MOTO",
    sections,
  };
}

const QUESTIONNAIRE_MAP: Record<
  SaqQuestionnaireType,
  () => Questionnaire
> = {
  A: () => normalizeSaqA(saqAJson as SaqARawSection[]),
  B: () => saqBJson as Questionnaire,
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
      description: undefined,
      items: sec.items
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
        .map((item) => ({
          id: item.id,
          label: item.question,
          pciRef: `PCI Ref: ${item.id}`,
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

/** Build structured response payload for submission/export (SAQ A and SAQ B) */
export type QuestionnaireResponsePayload = {
  questionnaire_type: string;
  responses: {
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
