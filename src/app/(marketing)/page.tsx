import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  LockKeyhole,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata = {
  title: "PCI DSS Scope Tool",
  description:
    "ComplianceAstra helps businesses quickly determine PCI DSS scope and identify the correct SAQ. Free guided assessment in minutes.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ComplianceAstra",
  url: "https://complianceastra.com",
  logo: "https://complianceastra.com/logo.png",
};

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-sky-50/95 via-emerald-50/60 to-white"
        />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
        />

        <div className="relative container py-6 md:py-8 pb-10 md:pb-12">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="space-y-2.5">
                <h1
                  className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-[1.1]"
                >
                  PCI DSS Scope Tool
                </h1>
                <p className="text-lg leading-snug text-slate-700 sm:text-xl">
                  ComplianceAstra helps businesses understand and navigate PCI DSS and regulatory
                  compliance — with plain-English results that reduce PCI confusion and help you
                  get moving faster.
                </p>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <Link href="/assessments/new">
                      <Button
                        size="lg"
                        className="h-11 bg-emerald-600 hover:bg-emerald-700 text-base font-semibold px-6 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-500/20"
                        aria-label="Start free assessment"
                      >
                        Start Free Assessment →
                      </Button>
                    </Link>
                    <Link href="/solutions">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-11 text-base font-medium px-6 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                        aria-label="Explore solutions"
                      >
                        Explore Solutions
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-slate-600">Takes less than 5 minutes.</p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="mx-auto w-full max-w-lg lg:pt-0">
                <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm overflow-hidden">
                  <div className="px-4 py-1.5 border-b border-slate-200 bg-gradient-to-r from-emerald-50/80 to-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <LayoutDashboard className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            Scope, then act
                          </p>
                          <p className="text-xs text-slate-600 truncate">Plain-English SAQ guidance</p>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        v4.0.1
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                          <LockKeyhole className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            1) Answer short scope questions
                          </p>
                          <p className="text-xs text-slate-600 leading-snug">
                            Minimum branching — business-friendly prompts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <ShieldCheck className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            2) Get a likely SAQ + scope summary
                          </p>
                          <p className="text-xs text-slate-600 leading-snug">
                            Transparent “why this matched” explanations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                          <FileCheck className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            3) Track compliance in your workspace
                          </p>
                          <p className="text-xs text-slate-600 leading-snug">
                            Evidence notes, action statuses, and PDF export.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 text-xs text-slate-600">
                      <span>Calm, premium compliance UX</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-slate-400" aria-hidden />
                        Built for teams
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trust / Value strip — clearly separated below hero */}
      <section className="relative pt-4 pb-8 md:pb-10">
        <div className="container">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 backdrop-blur px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="grid gap-3 md:grid-cols-3 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">Reduce PCI scope by up to 80%</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">Find likely SAQ boundaries quickly.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-sky-600 shadow-sm">
                  <FileCheck className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">Plain English results</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">No auditor-heavy dumps.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-amber-600 shadow-sm">
                  <Users className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">Used by fintech & ecommerce teams</p>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">Built for real-world payment flows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-12 md:py-16" aria-labelledby="features-heading">
        <div className="container">
          <div className="text-center mb-10">
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-slate-900">
              Start where your payments happen
            </h2>
            <p className="mt-4 text-slate-700 max-w-2xl mx-auto">
              Pick the environment you run today — we’ll adapt the guidance to your scope.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <Link href="/solutions/ecommerce" className="group">
                <Card className="h-full rounded-2xl border-slate-200 bg-white/70 backdrop-blur shadow-sm transition-transform transform hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <ShieldCheck className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle className="text-slate-900">Ecommerce</CardTitle>
                    </div>
                    <CardDescription>
                      Checkout, hosting, and third-party integrations — understand what’s in scope.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between gap-6">
                    <div className="text-sm text-slate-600">
                      Designed for hosted, redirected, and embedded payment flows.
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      Explore in plain English <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>

            <Reveal>
              <Link href="/solutions/pos" className="group">
                <Card className="h-full rounded-2xl border-slate-200 bg-white/70 backdrop-blur shadow-sm transition-transform transform hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                        <Zap className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle className="text-slate-900">POS & Retail</CardTitle>
                    </div>
                    <CardDescription>
                      Segmentation, terminal management, multi-location requirements — plain English.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between gap-6">
                    <div className="text-sm text-slate-600">
                      Clarify what’s connected, isolated, and in scope for your environment.
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      Explore in plain English <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>

            <Reveal>
              <Link href="/solutions/payment-platform" className="group">
                <Card className="h-full rounded-2xl border-slate-200 bg-white/70 backdrop-blur shadow-sm transition-transform transform hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <FileCheck className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle className="text-slate-900">Payment Platforms</CardTitle>
                    </div>
                    <CardDescription>
                      APIs, multi-tenant systems, and card data exposure — scope your SAQ or ROC with confidence.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between gap-6">
                    <div className="text-sm text-slate-600">
                      Reduce ambiguity across complex integrations and workflows.
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      Explore in plain English <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="container text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to map your PCI scope?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Avoid weeks of PCI confusion. Start your free assessment in minutes — then continue in your compliance workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/assessments/new">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-8 shadow-lg shadow-emerald-500/20"
                aria-label="Start free assessment"
              >
                Start Free Assessment →
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="bg-white/0 text-white border-white/30 hover:bg-white/10 px-8">
                Read PCI Guidance
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
