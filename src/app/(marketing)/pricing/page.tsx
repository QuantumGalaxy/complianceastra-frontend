import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Pricing | ComplianceAstra",
  description:
    "Start free. Upgrade when you need deeper insights. Free scope assessment and paid readiness reports.",
};

const FAQ_ITEMS = [
  {
    q: "Do I need to pay before starting?",
    a: "No. Start the free assessment first. You only pay when you want to unlock the full readiness report with prioritized actions and PDF export.",
  },
  {
    q: "When do I get the report?",
    a: "Immediately after payment. Your full compliance report, action plan, and downloadable PDF are available right away.",
  },
  {
    q: "Is this auditor-approved?",
    a: "ComplianceAstra provides guidance and readiness insights. Final compliance validation depends on your acquiring bank, payment processor, or qualified security assessor (QSA) where applicable.",
  },
  {
    q: "Can I export results?",
    a: "Yes. Paid plans include a downloadable PDF report you can share with your team or advisors.",
  },
  {
    q: "Is this a subscription?",
    a: "No. The readiness report is a one-time $99 payment. No recurring charges.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative">
      {/* Soft background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-emerald-50/30"
      />

      <div className="relative container py-12 md:py-16">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800 mb-4">
            Simple, transparent pricing
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
            Start free. Upgrade when you need deeper compliance insights.
          </p>
          <p className="mt-2 text-sm text-slate-600 flex items-center justify-center gap-2">
            <Users className="h-4 w-4 text-slate-400" aria-hidden />
            Used by fintech & ecommerce teams
          </p>
        </header>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Free plan */}
          <Card className="rounded-2xl border-slate-200 bg-white/80 backdrop-blur shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-900 text-xl">Free Scope Assessment</CardTitle>
              <CardDescription className="mt-1">
                Understand your PCI scope in plain English.
              </CardDescription>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
              </div>
              <span className="inline-block mt-2 text-xs font-medium text-slate-500">
                No signup required
              </span>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {[
                  "Environment-specific questions",
                  "Transaction-flow-first",
                  "Plain-English scope summary",
                  "Risk areas highlighted",
                  "Sign up to save progress",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/assessments/new">
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                >
                  Start Free Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Paid plan — highlighted */}
          <Card className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 shadow-lg shadow-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Recommended
              </span>
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-slate-900 text-xl">Paid Readiness Report</CardTitle>
              <CardDescription className="mt-1">
                Get a full PCI readiness report with prioritized actions.
              </CardDescription>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$99</span>
              </div>
              <span className="inline-block mt-2 text-xs font-medium text-slate-600">
                One-time payment
              </span>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  "Full scope definition",
                  "Control-by-control readiness",
                  "Prioritized remediation plan",
                  "Downloadable PDF report",
                  "Consultant-style explanation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/assessments/new">
                <Button
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-500/25"
                  aria-label="Unlock full report"
                >
                  Get My Readiness Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Trust strip */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
              Trusted by fintech & ecommerce teams
            </span>
            <span className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" aria-hidden />
              Reduce PCI scope by up to 80%
            </span>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-16 md:mt-24 max-w-2xl mx-auto" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed pl-0">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-slate-700 font-medium">
            Not sure where to start?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Schedule a free compliance consultation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
