/**
 * Load questionnaire JSON by SAQ type.
 * Structured for future expansion: SAQ A, C, etc. can plug in their own JSON files.
 */

import type { Questionnaire } from "./questionnaire-types";
import type { ChecklistDefinition, SaqType } from "@/components/assessment/checklist-data";
import saqBJson from "@/data/saq_b_production_ready.json";

export type SaqQuestionnaireType = "B"; // Future: "A" | "C" | "D" | ...

const QUESTIONNAIRE_MAP: Record<SaqQuestionnaireType, () => Questionnaire> = {
  B: () => saqBJson as Questionnaire,
  // Future: A: () => require("@/data/saq_a_production_ready.json"),
  // Future: C: () => require("@/data/saq_c_production_ready.json"),
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
        .sort((a, b) => a.display_order - b.display_order)
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
