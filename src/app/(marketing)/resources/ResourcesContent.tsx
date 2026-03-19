"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FEATURED = [
  {
    title: "What is PCI DSS in plain English?",
    description:
      "A no-jargon overview of the Payment Card Industry Data Security Standard—what it is, who it applies to, and why it matters.",
    href: "/pci-dss-requirements",
    icon: ShieldCheck,
    gradient: "from-emerald-500/10 to-sky-500/10",
  },
  {
    title: "How to reduce PCI scope by 80%",
    description:
      "Practical strategies to minimize your cardholder data environment and qualify for simpler compliance paths.",
    href: "/pci-scope-calculator",
    icon: Sparkles,
    gradient: "from-sky-500/10 to-emerald-500/10",
  },
];

const GUIDES = [
  {
    title: "PCI DSS Requirements Explained",
    description: "The 12 requirements in plain language—build secure networks, protect data, and more.",
    href: "/pci-dss-requirements",
    icon: FileText,
  },
  {
    title: "PCI SAQ Tool & Types",
    description: "Determine which Self-Assessment Questionnaire fits your environment.",
    href: "/pci-saq-tool",
    icon: ShieldCheck,
  },
  {
    title: "PCI Scope Calculator",
    description: "Understand what's in scope and how to reduce your compliance footprint.",
    href: "/pci-scope-calculator",
    icon: BookOpen,
  },
  {
    title: "Scoping by Environment",
    description: "Ecommerce, POS, and payment platform—plain-English guidance for each.",
    href: "/solutions",
    icon: BookOpen,
  },
];

const DOCUMENTATION = [
  {
    title: "Legal Disclaimer",
    description: "Important information about guidance vs. formal validation.",
    href: "/legal/disclaimer",
    icon: FileText,
  },
  {
    title: "PCI SAQ Questionnaire",
    description: "Deep dive into SAQ structure and validation requirements.",
    href: "/pci-saq-questionnaire",
    icon: FileText,
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to complete an SAQ?",
    a: "If you store, process, or transmit cardholder data, you likely need to validate compliance. Your acquiring bank or payment brand will specify which SAQ applies. Our free assessment helps you determine the likely SAQ type.",
  },
  {
    q: "What's the difference between SAQ A and SAQ D?",
    a: "SAQ A is for merchants who outsource all card handling (e.g., fully hosted checkout). SAQ D is the most comprehensive and applies when you have direct access to cardholder data or complex environments.",
  },
  {
    q: "How long does a scope assessment take?",
    a: "Our free assessment takes about 5 minutes. You answer transaction-flow questions, and we provide a likely SAQ and plain-English scope summary.",
  },
  {
    q: "Is ComplianceAstra a QSA?",
    a: "ComplianceAstra provides guidance and readiness tools. Final compliance validation depends on your acquirer, processor, or a Qualified Security Assessor (QSA) where required.",
  },
];

function ResourceCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href} className="group block">
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200 p-5 overflow-hidden">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-snug">{description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({
  title,
  description,
  href,
  icon: Icon,
  gradient,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={`rounded-2xl border-2 border-slate-200 bg-gradient-to-br ${gradient} p-6 md:p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-sm text-emerald-600">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-slate-600 leading-relaxed">{description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
          Read guide
          <ArrowRight className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ResourcesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <div className="relative container py-12 md:py-16">
          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800 mb-4">
            Resources
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Learn PCI DSS the simple way
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl">
            Guides, FAQs, and practical insights to help you understand compliance and reduce scope.
          </p>
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 rounded-lg border-slate-200 bg-white/80 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                aria-label="Search resources"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {/* Featured */}
        <section className="mb-16" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="sr-only">
            Featured resources
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURED.map((item) => (
              <FeaturedCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
                gradient={item.gradient}
              />
            ))}
          </div>
        </section>

        {/* Guides */}
        <section className="mb-16" aria-labelledby="guides-heading">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="guides-heading" className="text-2xl font-bold text-slate-900">
              Guides
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {GUIDES.map((item) => (
              <ResourceCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
        </section>

        {/* Documentation */}
        <section className="mb-16" aria-labelledby="docs-heading">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="docs-heading" className="text-2xl font-bold text-slate-900">
              Documentation
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOCUMENTATION.map((item) => (
              <ResourceCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16" aria-labelledby="faq-heading">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="faq-heading" className="text-2xl font-bold text-slate-900">
              FAQs
            </h2>
          </div>
          <div className="space-y-3 max-w-2xl">
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-200 bg-white/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-medium text-slate-900 hover:bg-slate-50/50 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-100 px-4 py-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50/50 p-8 md:p-10 text-center"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="text-2xl font-bold text-slate-900">
            Ready to assess your PCI scope?
          </h2>
          <p className="mt-2 text-slate-600">
            Get a free scope assessment in about 5 minutes.
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
        </section>
      </div>
    </div>
  );
}
