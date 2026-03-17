"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";
import {
  CHECKLISTS,
  ChecklistAnswer,
  ChecklistDefinition,
  ChecklistItem,
  SaqType,
} from "./checklist-data";

type ChecklistState = Record<string, { answer: ChecklistAnswer; notes: string }>;

const PREVIEW_ITEMS_COUNT = 3;
const ANSWER_LABELS: { value: Exclude<ChecklistAnswer, null>; label: string }[] = [
  { value: "in_place", label: "In Place" },
  { value: "not_applicable", label: "Not Applicable" },
  { value: "action_needed", label: "Action Needed" },
];

function getPreviewItems(def: ChecklistDefinition): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  for (const section of def.sections) {
    for (const item of section.items) {
      items.push(item);
      if (items.length >= PREVIEW_ITEMS_COUNT) return items;
    }
  }
  return items;
}

type ChecklistPreviewProps = {
  saq: SaqType;
  state: ChecklistState;
  onChange: (next: ChecklistState) => void;
};

export function ChecklistPreview({ saq, state, onChange }: ChecklistPreviewProps) {
  const def = useMemo(() => CHECKLISTS[saq], [saq]);
  const previewItems = useMemo(() => getPreviewItems(def), [def]);

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

  const completed = previewItems.filter(
    (item) => state[item.id]?.answer && state[item.id].answer !== null,
  ).length;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div
          className="h-2 rounded-full bg-slate-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={previewItems.length}
        >
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${(completed / previewItems.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-slate-600">
          Preview: <span className="font-semibold text-slate-900">{completed} of {previewItems.length} items shown</span>
          {" "}
          <span className="text-slate-500">· Unlock for full checklist</span>
        </p>
      </div>

      <div className="space-y-6">
        {def.sections.map((section) => {
          const visibleItems = section.items.filter((i) =>
            previewItems.some((p) => p.id === i.id),
          );
          const allLocked = visibleItems.length === 0;
          if (allLocked) {
            return (
              <Card key={section.id} className="border-slate-200 overflow-hidden">
                <div className="flex items-center gap-3 p-4 bg-slate-50/80">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                    <Lock className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-600">
                      {section.title}
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unlock full checklist to view and complete
                    </p>
                  </div>
                </div>
              </Card>
            );
          }
          return (
            <Card key={section.id} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">{section.title}</CardTitle>
                {section.description && (
                  <p className="mt-1 text-sm text-slate-600">{section.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => {
                  const isPreview = previewItems.some((p) => p.id === item.id);
                  if (!isPreview) return null;
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
                      <p className="text-[11px] font-medium text-slate-500">{item.pciRef}</p>
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
                {section.items.some((i) => !previewItems.some((p) => p.id === i.id)) && (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-4">
                    <Lock className="h-5 w-5 text-slate-400" aria-hidden />
                    <p className="text-sm text-slate-600">
                      More items in this section available after unlocking
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
