import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CHECKLISTS,
  ChecklistAnswer,
  ChecklistDefinition,
  ChecklistItem,
  SaqType,
} from "./checklist-data";

type ChecklistState = Record<string, { answer: ChecklistAnswer; notes: string }>;

type ChecklistViewProps = {
  saq: SaqType;
  state: ChecklistState;
  onChange: (next: ChecklistState) => void;
};

const ANSWER_LABELS: { value: Exclude<ChecklistAnswer, null>; label: string }[] = [
  { value: "in_place", label: "In Place" },
  { value: "not_applicable", label: "Not Applicable" },
  { value: "action_needed", label: "Action Needed" },
];

function getProgress(def: ChecklistDefinition, state: ChecklistState) {
  const allItems: ChecklistItem[] = def.sections.flatMap((s) => s.items);
  const total = allItems.length;
  const completed = allItems.filter(
    (item) => state[item.id] && state[item.id].answer && state[item.id].answer !== null,
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}

export function ChecklistView({ saq, state, onChange }: ChecklistViewProps) {
  const def = useMemo(() => CHECKLISTS[saq], [saq]);
  const { total, completed, percent } = useMemo(
    () => getProgress(def, state),
    [def, state],
  );

  const handleAnswerChange = (id: string, answer: ChecklistAnswer) => {
    onChange({
      ...state,
      [id]: { answer, notes: state[id]?.notes ?? "" },
    });
  };

  const handleNotesChange = (id: string, notes: string) => {
    onChange({
      ...state,
      [id]: { answer: state[id]?.answer ?? null, notes },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div
          className="h-2 rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-slate-600">
          Checklist progress:{" "}
          <span className="font-semibold text-slate-900">
            {completed} of {total} items complete ({percent}%)
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {def.sections.map((section) => (
          <Card key={section.id} className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">{section.title}</CardTitle>
              {section.description && (
                <p className="mt-1 text-sm text-slate-600">{section.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => {
                const current = state[item.id];
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        {item.helpText && (
                          <p className="mt-1 text-xs text-slate-600">{item.helpText}</p>
                        )}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {item.type === "scope_question"
                          ? "Scope question"
                          : item.type === "eligibility_confirmation"
                          ? "Eligibility confirmation"
                          : item.type === "compliance_checkpoint"
                          ? "Compliance checkpoint"
                          : "Action item"}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500">
                      {item.pciRef}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ANSWER_LABELS.map((answer) => {
                        const selected = current?.answer === answer.value;
                        return (
                          <Button
                            key={answer.value}
                            type="button"
                            size="xs"
                            variant={selected ? "default" : "outline"}
                            className={
                              selected
                                ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                                : "border-slate-300"
                            }
                            onClick={() => handleAnswerChange(item.id, answer.value)}
                          >
                            {answer.label}
                          </Button>
                        );
                      })}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">
                        Evidence / notes (optional)
                      </label>
                      <Textarea
                        value={current?.notes ?? ""}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        className="min-h-[60px] text-xs"
                        placeholder="Where is this control documented or implemented?"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

