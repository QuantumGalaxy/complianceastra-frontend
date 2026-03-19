"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Lock } from "lucide-react";

type PaywallSectionProps = {
  onUnlockClick: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  isLoading?: boolean;
  returnTo?: string;
};

const BENEFITS = [
  "Full SAQ checklist (100+ requirements)",
  "Progress tracking (In Place / Action Needed)",
  "Evidence notes and audit trail",
  "Export PDF for your acquirer or QSA",
  "Future updates included",
];

export function PaywallSection({
  onUnlockClick,
  email,
  onEmailChange,
  isLoading = false,
  returnTo,
}: PaywallSectionProps) {
  const loginHref = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";
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
            actionable checklist and report tailored to your SAQ.
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

        <div className="flex justify-center">
          <Card className="w-full max-w-md border-emerald-300 bg-emerald-50/50 ring-2 ring-emerald-500/30">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-emerald-900">$99</CardTitle>
              <p className="text-sm text-slate-700">One-time payment</p>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-700 text-center">
              <p>Full SAQ checklist</p>
              <p>Progress tracking & evidence notes</p>
              <p>Export PDF</p>
              <p>Future updates</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="space-y-2">
            <div className="h-px bg-slate-200" aria-hidden />
            <Label htmlFor="paywall-email" className="text-base font-semibold text-slate-900">
              Continue with your email
            </Label>
            <p className="text-sm text-slate-600">
              We&apos;ll create your account and save your progress automatically.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              id="paywall-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-11 max-w-md rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 px-6 text-base font-semibold shadow-md shadow-emerald-500/20"
              onClick={onUnlockClick}
              disabled={isLoading}
            >
              {isLoading ? (
                "Opening…"
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" aria-hidden />
                  Continue to payment – $99
                </>
              )}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              One-time payment. No subscription.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
