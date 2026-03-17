import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type Option = {
  value: string;
  label: string;
  description?: string;
};

type QuestionCardProps = {
  badge?: string;
  title: string;
  description?: string;
  helpText?: ReactNode;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
};

export function QuestionCard({ badge, title, description, helpText, options, value, onChange }: QuestionCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-start gap-3">
          {badge && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {badge}
            </span>
          )}
          <div>
            <CardTitle className="text-slate-900">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
        </div>
        {helpText && (
          <div className="mt-3 inline-flex items-start gap-2 text-xs text-slate-500">
            <Info className="h-4 w-4 text-slate-400 mt-0.5" aria-hidden />
            <span>{helpText}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2" role="radiogroup" aria-label={title}>
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{opt.label}</span>
                  {selected && (
                    <span className="text-xs font-semibold text-emerald-700">Selected</span>
                  )}
                </div>
                {opt.description && (
                  <p className="mt-1 text-xs text-slate-600">{opt.description}</p>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

