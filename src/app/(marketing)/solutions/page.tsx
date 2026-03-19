import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileCheck, ShieldCheck, Users, Zap } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata = {
  title: "Solutions by Environment | ComplianceAstra",
  description:
    "Find the right PCI path for your environment. Ecommerce, POS, or payment platform—get tailored scoping guidance in minutes.",
};

const SOLUTIONS = [
  {
    id: "ecommerce",
    title: "Ecommerce",
    summary: "Online checkout, gateways, hosted carts.",
    scenario: "Is my checkout in scope? What about my hosting provider?",
    href: "/assessments/new?env=ecommerce",
    detailHref: "/solutions/ecommerce",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    id: "pos",
    title: "POS & Retail",
    summary: "Physical terminals, integrated POS, multi-location.",
    scenario: "How do I segment my network? Are all locations in scope?",
    href: "/assessments/new?env=pos",
    detailHref: "/solutions/pos",
    icon: Zap,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },
  {
    id: "payment_platform",
    title: "Payment Platform",
    summary: "APIs, multi-tenant systems, embedded payments.",
    scenario: "How do we scope card data across tenants?",
    href: "/assessments/new?env=payment_platform",
    detailHref: "/solutions/payment-platform",
    icon: FileCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
];

const BENEFITS = [
  {
    label: "Reduce PCI scope by up to 80%",
    icon: ShieldCheck,
  },
  {
    label: "Plain-English results",
    icon: FileCheck,
  },
  {
    label: "Built for modern payment teams",
    icon: Users,
  },
];

export default function SolutionsPage() {
  return (
    <div className="relative">
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
        <div className="relative container py-14 md:py-20">
          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800 mb-4">
            Solutions
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl max-w-3xl">
            Find the right PCI path for your environment
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl">
            Choose your payment environment and get tailored scoping guidance in minutes.
          </p>
          <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" aria-hidden />
            Built for ecommerce, retail, and fintech teams
          </p>
        </div>
      </section>

      {/* Solution cards */}
      <section className="relative container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {SOLUTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id}>
                <div className="group relative flex flex-col h-full rounded-2xl border-2 border-slate-200 bg-white/90 backdrop-blur shadow-lg shadow-slate-200/50 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200">
                  {/* Tinted top area */}
                  <div
                    className={`px-6 pt-6 pb-4 ${s.iconBg} border-b border-slate-100/80`}
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm ${s.iconColor}`}
                    >
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <h2 className="mt-4 text-xl font-bold text-slate-900">{s.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{s.summary}</p>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Typical question
                    </p>
                    <p className="mt-1 text-sm text-slate-700 italic">
                      &quot;{s.scenario}&quot;
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link href={s.href}>
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-500/20"
                        >
                          Start assessment
                        </Button>
                      </Link>
                      <Link
                        href={s.detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all"
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Benefits strip */}
      <section className="relative py-12 md:py-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
        />
        <div className="relative container">
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-6 md:grid-cols-3">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white/60 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="font-semibold text-slate-900">{b.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="relative py-12 md:py-16"
        aria-labelledby="solutions-cta-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-sky-50/40 to-white"
        />
        <div className="relative container">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 md:p-12 text-center shadow-lg shadow-emerald-500/5">
            <h2 id="solutions-cta-heading" className="text-2xl font-bold text-slate-900 md:text-3xl">
              Not sure which environment fits?
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Start a guided assessment and we&apos;ll help you find the right path.
            </p>
            <Link href="/assessments/new" className="mt-6 inline-block">
              <Button
                size="lg"
                className="h-12 bg-emerald-600 hover:bg-emerald-700 px-8 text-base font-semibold shadow-md shadow-emerald-500/25"
                aria-label="Start free assessment"
              >
                Start Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
