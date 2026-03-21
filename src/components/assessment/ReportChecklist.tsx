"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight } from "lucide-react";
import type {
  ChecklistDefinition,
  ChecklistItem,
  ChecklistState,
  ChecklistAnswer,
} from "./checklist-data";

type ReportChecklistProps = {
  checklistDef: ChecklistDefinition;
  state: ChecklistState;
  onChange: (next: ChecklistState) => void;
  totalItems?: number;
  completed?: number;
  progressPercent?: number;
};

const ANSWER_OPTIONS: {
  value: ChecklistAnswer;
  label: string;
  className: string;
}[] = [
  { value: "in_place", label: "In Place", className: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200" },
  { value: "in_place_ccw", label: "In Place with CCW", className: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200" },
  { value: "not_applicable", label: "Not Applicable", className: "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200" },
  { value: "not_tested", label: "Not Tested", className: "bg-violet-100 text-violet-900 border-violet-300 hover:bg-violet-200" },
  { value: "not_in_place", label: "Not in Place", className: "bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200" },
  { value: "action_needed", label: "Action Needed", className: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200" },
];

export function ReportChecklist({
  checklistDef,
  state,
  onChange,
  totalItems = 0,
  completed = 0,
  progressPercent = 0,
}: ReportChecklistProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(checklistDef.sections.slice(0, 2).map((s) => s.id)),
  );
  const sectionCount = checklistDef.sections.length;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAnswer = (itemId: string, answer: ChecklistAnswer) => {
    const entry = state[itemId];
    onChange({
      ...state,
      [itemId]: {
        answer,
        notes: entry?.notes ?? "",
        ccw_explanation: answer === "in_place_ccw" ? entry?.ccw_explanation ?? "" : undefined,
      },
    });
  };

  const handleNotes = (itemId: string, notes: string) => {
    const entry = state[itemId];
    onChange({
      ...state,
      [itemId]: {
        answer: entry?.answer ?? null,
        notes,
        ccw_explanation: entry?.ccw_explanation,
      },
    });
  };

  const handleCcwChange = (itemId: string, ccw_explanation: string) => {
    const entry = state[itemId];
    onChange({
      ...state,
      [itemId]: {
        answer: entry?.answer ?? null,
        notes: entry?.notes ?? "",
        ccw_explanation: ccw_explanation || undefined,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Workspace header — local progress only (no duplicate status chips) */}
      <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">
            {sectionCount} workstream{sectionCount !== 1 ? "s" : ""}
          </span>
          <span className="mx-2 text-slate-300" aria-hidden>
            •
          </span>
          <span>
            {completed} of {totalItems} item{totalItems !== 1 ? "s" : ""} complete
          </span>
          {totalItems > 0 && (
            <span className="text-slate-500"> ({progressPercent}%)</span>
          )}
        </p>
        <p className="mt-1 text-xs text-slate-400">Last updated: Just now</p>
      </div>

      {checklistDef.sections.map((section) => {
        const isOpen = openSections.has(section.id);
        return (
          <Card key={section.id} className="border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/80 transition-colors border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
                )}
                <div className="text-left">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-0.5">
                    Workstream
                  </span>
                  <CardTitle className="text-base text-slate-900 m-0">
                    {section.title}
                  </CardTitle>
                </div>
              </div>
              <span className="text-sm text-slate-500">
                {section.items.length} item{section.items.length !== 1 ? "s" : ""}
              </span>
            </button>
            {isOpen && (
              <CardContent className="pt-4 pb-4 space-y-4 bg-slate-50/40">
                {section.description && (
                  <p className="text-sm text-slate-600 px-1 -mt-2">{section.description}</p>
                )}
                {section.items.map((item) => (
                  <ReportChecklistItem
                    key={item.id}
                    item={item}
                    current={state[item.id]}
                    onAnswer={(answer) => handleAnswer(item.id, answer)}
                    onNotesChange={(notes) => handleNotes(item.id, notes)}
                    onCcwChange={(ccw) => handleCcwChange(item.id, ccw)}
                  />
                ))}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function ReportChecklistItem({
  item,
  current,
  onAnswer,
  onNotesChange,
  onCcwChange,
}: {
  item: ChecklistItem;
  current: import("./checklist-data").ChecklistStateEntry | undefined;
  onAnswer: (answer: ChecklistAnswer) => void;
  onNotesChange: (notes: string) => void;
  onCcwChange: (ccw_explanation: string) => void;
}) {
  const isCcwSelected = current?.answer === "in_place_ccw";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-slate-900">{item.label}</p>
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
          {item.pciRef}
        </span>
      </div>
      {item.helpText && (
        <p className="text-xs text-slate-600">{item.helpText}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {ANSWER_OPTIONS.filter((o) => o.value !== null).map((opt) => {
          const selected = current?.answer === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              size="xs"
              variant="outline"
              className={`${selected ? opt.className : "border-slate-200 bg-white"} transition-colors`}
              onClick={() => onAnswer(opt.value)}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
      {isCcwSelected && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Compensating control description
          </label>
          <Textarea
            value={current?.ccw_explanation ?? ""}
            onChange={(e) => onCcwChange(e.target.value)}
            className="min-h-[60px] text-xs bg-white"
            placeholder="Describe how your alternative control meets the requirement..."
          />
        </div>
      )}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Evidence / notes (optional)</label>
        <Textarea
          value={current?.notes ?? ""}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[60px] text-xs bg-white"
          placeholder="Where is this control documented or implemented?"
        />
      </div>
    </div>
  );
}
