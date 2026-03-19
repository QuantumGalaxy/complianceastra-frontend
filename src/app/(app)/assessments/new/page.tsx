"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileCheck, Phone, ShieldCheck, Zap } from "lucide-react";

const ENVIRONMENTS = [
  {
    id: "ecommerce",
    title: "Ecommerce",
    description: "Online checkout, payment gateways, hosted carts — understand what's in scope.",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    id: "pos",
    title: "POS & Retail",
    description: "Physical terminals, integrated POS, multi-location — plain-English guidance.",
    icon: Zap,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },
  {
    id: "moto",
    title: "MOTO",
    description: "Mail and phone orders — find the right SAQ for card-not-present without a website checkout.",
    icon: Phone,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-700",
  },
  {
    id: "payment_platform",
    title: "Payment platform / Service provider",
    description: "APIs, fintech, or services that touch other businesses’ card data.",
    icon: FileCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
];

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetEnv = searchParams.get("env");
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (envId: string) => {
    setError(null);
    try {
      const sessionId = `w${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("complianceastra_start_env", envId);
      }
      router.push(`/assessments/${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Soft background matching homepage */}
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

      <div className="relative container max-w-2xl py-10 md:py-14">
        {/* Hero / Intro */}
        <header className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800 mb-4">
            Free Assessment
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-[1.15]">
            Start your free assessment
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-xl mx-auto leading-snug">
            Choose your environment type. We&apos;ll ask transaction-flow questions first, then
            adapt to your setup.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-600">
            <span>Takes about 5 minutes</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-medium text-slate-700">Step 1 of 3</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Plain-English guidance. No auditor-heavy jargon.
          </p>
        </header>

        {error && (
          <div
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Environment cards */}
        <div className="grid gap-4">
          {ENVIRONMENTS.map((env) => {
            const Icon = env.icon;
            const isPreset = presetEnv === env.id;
            return (
              <Card
                key={env.id}
                className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 overflow-hidden group ${
                  isPreset
                    ? "border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-500/10"
                    : "border-slate-200 bg-white/80 backdrop-blur hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
                }`}
                onClick={() => handleSelect(env.id)}
              >
                <CardHeader className="flex flex-row items-center gap-4 p-5 sm:p-6">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${env.iconBg} ${env.iconColor}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-slate-900 text-lg">{env.title}</CardTitle>
                    <CardDescription className="mt-0.5 text-slate-600">
                      {env.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                      Continue
                    </span>
                    <ArrowRight
                      className="h-5 w-5 text-emerald-600 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an assessment?{" "}
          <Link href="/dashboard" className="font-medium text-emerald-600 hover:text-emerald-700">
            View dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-slate-600">Loading...</div>
        </div>
      }
    >
      <NewAssessmentContent />
    </Suspense>
  );
}
