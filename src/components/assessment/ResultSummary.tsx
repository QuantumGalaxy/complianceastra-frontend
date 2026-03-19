import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SaqType } from "./checklist-data";

type ResultSummaryProps = {
  saq: SaqType;
  title: string;
  whyMatched: string[];
  scopeSummary: string;
  estimateLabel: string;
  onContinueChecklist: () => void;
  /** Optional risk hint from decision engine */
  riskLevel?: "Low" | "Medium" | "High";
};

const SAQ_LABELS: Record<SaqType, string> = {
  A: "SAQ A",
  "A-EP": "SAQ A-EP",
  B: "SAQ B",
  "B-IP": "SAQ B-IP",
  "C-VT": "SAQ C-VT",
  C: "SAQ C",
  D_MERCHANT: "SAQ D (Merchant)",
  D_SERVICE_PROVIDER: "SAQ D (Service Provider)",
};

export function ResultSummary({
  saq,
  title,
  whyMatched,
  scopeSummary,
  estimateLabel,
  onContinueChecklist,
  riskLevel,
}: ResultSummaryProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Preliminary SAQ classification
        </p>
        <Badge className="text-base px-4 py-1.5 rounded-full bg-emerald-600 text-white">
          {SAQ_LABELS[saq]}
        </Badge>
        <p className="text-lg font-semibold text-slate-800 max-w-xl mx-auto">
          Based on your answers, you should complete:{" "}
          <span className="text-emerald-700">{SAQ_LABELS[saq]}</span>
        </p>
        {riskLevel && (
          <p className="text-xs text-slate-500">
            Estimated scope complexity:{" "}
            <span className="font-medium text-slate-700">{riskLevel}</span>
          </p>
        )}
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Based on PCI DSS v4.0.1. This is an initial classification aid and does not replace
          acquirer, processor, or payment-brand instructions.
        </p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Why this matched</CardTitle>
          <CardDescription>Key points from your answers.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
            {whyMatched.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardHeader>
            <CardTitle className="text-emerald-900">What this means</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-800">{scopeSummary}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Estimated checklist size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">{estimateLabel}</p>
            <p className="mt-3 text-xs text-slate-500">
              Your actual PCI requirements may vary. Always confirm final reporting obligations with
              your acquiring bank, payment processor, or qualified security assessor (QSA).
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 px-10"
          onClick={onContinueChecklist}
        >
          Continue to compliance checklist
        </Button>
      </div>
    </div>
  );
}

