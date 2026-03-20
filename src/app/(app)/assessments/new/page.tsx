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
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
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

      <div className="relative container mx-auto flex max-w-3xl flex-1 flex-col px-4 py-8 md:py-10">
        <header className="mb-6 shrink-0 text-center md:mb-8">
          <span className="mb-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Free Assessment
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Start your free assessment
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-snug text-slate-700 sm:text-lg">
            Choose your environment type. We&apos;ll ask transaction-flow questions first, then
            adapt to your setup.
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-1.5 text-sm text-slate-600 sm:flex-row sm:gap-3">
            <span>Takes about 5 minutes</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-medium text-slate-700">Step 1 of 3</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Plain-English guidance. No auditor-heavy jargon.
          </p>
        </header>

        {error && (
          <div
            className="mb-4 shrink-0 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Cards: larger tap targets + generous row gap; flex-1 centers block in remaining viewport */}
        <div className="flex min-h-0 flex-1 flex-col justify-center py-2 md:py-4">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:gap-y-12">
            {ENVIRONMENTS.map((env) => {
              const Icon = env.icon;
              const isPreset = presetEnv === env.id;
              return (
                <Card
                  key={env.id}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    isPreset
                      ? "border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-500/10"
                      : "border-slate-200 bg-white/80 backdrop-blur hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  }`}
                  onClick={() => handleSelect(env.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 px-5 py-5 sm:px-6 sm:py-6">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${env.iconBg} ${env.iconColor}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold leading-snug text-slate-900">
                        {env.title}
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {env.description}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-center gap-0.5 self-stretch sm:flex-row sm:items-center sm:gap-2">
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
        </div>

        <p className="mt-8 shrink-0 pb-4 text-center text-sm text-slate-500 md:mt-10 md:pb-6">
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
