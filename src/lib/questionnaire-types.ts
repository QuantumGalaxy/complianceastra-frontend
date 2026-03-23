/**
 * Questionnaire schema types for PCI SAQ JSON-driven assessments.
 * Reusable across SAQ A, B, C, and other questionnaire types.
 */

export type QuestionnaireItem = {
  id: string;
  /** Parent section id from source JSON (e.g. req_1) — for export/reporting */
  section_id?: string;
  /** PCI DSS requirement numbers (e.g. "1.2.1") — merchant-facing traceability */
  maps_to_requirements?: string[];
  requirement_raw: string;
  question: string;
  help_text?: string;
  /** PCI “expected testing” lines from PRD JSON (assessor-facing). */
  expected_testing_raw?: string[];
  options: string[];
  display_order?: number;
  category?: string;
  tags?: string[];
  risk_level?: "low" | "medium" | "high";
  ui_hint?: string;
  response_type?: string;
  evidence_examples?: string[];
  show_requirement_id?: boolean;
  allow_note?: boolean;
};

export type QuestionnaireSection = {
  section_id: string;
  section_order: number;
  section_title: string;
  /** Section-level merchant summary (e.g. SAQ D PRD) */
  section_summary?: string;
  category?: string;
  items: QuestionnaireItem[];
};

export type Questionnaire = {
  framework: string;
  source?: string;
  sections: QuestionnaireSection[];
};

/** Normalized response value for storage and reporting */
export type QuestionnaireAnswerValue =
  | "in_place"
  | "in_place_ccw"
  | "not_applicable"
  | "not_tested"
  | "not_in_place"
  /** Legacy SAQ A/B option — keep for existing assessments */
  | "action_needed";

/** Stored answer for a single requirement */
export type QuestionnaireAnswer = {
  requirement_id: string;
  selected_response: QuestionnaireAnswerValue;
  optional_note: string;
  section_title: string;
  raw_requirement_text: string;
  ccw_explanation?: string;
};

/** Map of requirement_id -> answer (for checklistState compatibility) */
export type QuestionnaireAnswersMap = Record<
  string,
  {
    answer: QuestionnaireAnswerValue | null;
    notes: string;
    ccw_explanation?: string;
  }
>;

/** Maps JSON option labels to normalized values */
export const OPTION_TO_VALUE: Record<string, QuestionnaireAnswerValue> = {
  "In Place": "in_place",
  "In Place with CCW": "in_place_ccw",
  "Not Applicable": "not_applicable",
  "Not Tested": "not_tested",
  "Not in Place": "not_in_place",
  "Action Needed": "action_needed",
};

/** CCW helper text for non-technical users */
export const CCW_HELPER_TEXT =
  "A Compensating Control Worksheet (CCW) documents an alternative way you meet a requirement when the standard control isn't feasible. Your acquirer or assessor must approve it.";
