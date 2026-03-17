"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

type PaywallSectionProps = {
  onUnlockClick: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  isLoading?: boolean;
};

const BENEFITS = [
  "Full SAQ checklist (100+ requirements)",
  "Step-by-step guidance",
  "Track progress (In Place / Action Needed)",
  "Add notes and evidence",
  "Export PDF for audit",
];

export function PaywallSection({
  onUnlockClick,
  email,
  onEmailChange,
  isLoading = false,
}: PaywallSectionProps) {
  return (
    <section
      className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/60 p-6 md:p-10 shadow-sm"
      aria-labelledby="paywall-heading"
    >
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h2
            id="paywall-heading"
            className="text-2xl font-bold text-slate-900 md:text-3xl"
          >
            Unlock your full PCI compliance plan
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            Avoid weeks of PCI confusion. Based on PCI DSS v4.0.1 — get a clear,
            actionable checklist tailored to your SAQ.
          </p>
        </div>

        <ul className="space-y-3">
          {BENEFITS.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-3 w-3" aria-hidden />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 md:grid-cols-3 text-center">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-700">FREE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>SAQ result</p>
              <p>Basic explanation</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-300 bg-emerald-50/50 ring-2 ring-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-emerald-900">$49</CardTitle>
              <p className="text-xs font-medium text-emerald-700">Recommended</p>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-700">
              <p>Full checklist</p>
              <p>Progress tracking</p>
              <p>Export PDF</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-700">$99</CardTitle>
              <p className="text-xs text-slate-500">Advanced</p>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>Everything above</p>
              <p>Future updates</p>
              <p>Priority support</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <Label htmlFor="paywall-email" className="text-slate-700">
            Enter your email to save your assessment
          </Label>
          <Input
            id="paywall-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="max-w-md"
          />

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-8 text-base font-semibold"
              onClick={onUnlockClick}
              disabled={isLoading}
            >
              {isLoading ? "Opening…" : "Unlock Full Checklist – $49"}
            </Button>
            <p className="text-sm text-slate-500">
              One-time payment. No subscription.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
