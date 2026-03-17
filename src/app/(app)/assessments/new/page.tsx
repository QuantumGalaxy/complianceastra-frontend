"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assessmentsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const ENVIRONMENTS = [
  {
    id: "ecommerce",
    title: "Ecommerce",
    description: "Online checkout, payment gateways, hosted carts",
    icon: "🛒",
  },
  {
    id: "pos",
    title: "POS & Retail",
    description: "Physical terminals, integrated POS, multi-location",
    icon: "💳",
  },
  {
    id: "payment_platform",
    title: "Payment Platform",
    description: "APIs, fintech, embedded payments",
    icon: "⚡",
  },
];

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetEnv = searchParams.get("env");
  const { token, isLoading: authLoading } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (envId: string) => {
    setLoadingId(envId);
    setError(null);
    try {
      const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
      const { id } = await assessmentsApi.create(envId, authToken ?? undefined);
      router.push(`/assessments/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start assessment");
    } finally {
      setLoadingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Start Your Free Assessment</h1>
          <p className="mt-4 text-slate-600">
            Choose your environment type. We&apos;ll ask transaction-flow questions first, then
            adapt to your setup.
          </p>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}
        <div className="grid gap-4">
          {ENVIRONMENTS.map((env) => (
            <Card
              key={env.id}
              className={`cursor-pointer transition-colors border-2 hover:border-emerald-300 ${
                presetEnv === env.id ? "border-emerald-400" : "border-slate-200"
              }`}
              onClick={() => !loadingId && handleSelect(env.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <span className="text-3xl" aria-hidden>
                  {env.icon}
                </span>
                <div>
                  <CardTitle className="text-slate-900">{env.title}</CardTitle>
                  <CardDescription>{env.description}</CardDescription>
                </div>
                <Button
                  className="ml-auto"
                  size="sm"
                  disabled={!!loadingId}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(env.id);
                  }}
                >
                  {loadingId === env.id ? "Starting..." : "Start"}
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-600">Loading...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}
