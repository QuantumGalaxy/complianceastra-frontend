/**
 * Questionnaire schema types for PCI SAQ JSON-driven assessments.
 * Reusable across SAQ A, B, C, and other questionnaire types.
 */

export type QuestionnaireItem = {
  id: string;
  requirement_raw: string;
  question: string;
  help_text?: string;
  options: string[];
  display_order: number;
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
  category?: string;
  items: QuestionnaireItem[];
};

export type Questionnaire = {
  framework: string;
  source?: string;
  sections: QuestionnaireSection[];
};

/** Normalized response value for storage and reporting */
export type QuestionnaireAnswerValue = "in_place" | "not_applicable" | "action_needed";

/** Stored answer for a single requirement */
export type QuestionnaireAnswer = {
  requirement_id: string;
  selected_response: QuestionnaireAnswerValue;
  optional_note: string;
  section_title: string;
  raw_requirement_text: string;
};

/** Map of requirement_id -> answer (for checklistState compatibility) */
export type QuestionnaireAnswersMap = Record<
  string,
  { answer: QuestionnaireAnswerValue | null; notes: string }
>;

/** Maps JSON option labels to normalized values */
export const OPTION_TO_VALUE: Record<string, QuestionnaireAnswerValue> = {
  "In Place": "in_place",
  "Not Applicable": "not_applicable",
  "Action Needed": "action_needed",
};
