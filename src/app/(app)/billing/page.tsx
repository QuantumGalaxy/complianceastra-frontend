"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function BillingPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }
    // Placeholder: no billing API yet
    setSubscription({ plan: "Free", status: "active" });
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="text-slate-600 mt-1">Manage your subscription and payment methods</p>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              {subscription?.plan || "Free"} — {subscription?.status || "active"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Free scope assessments are included. Upgrade to unlock paid readiness reports with
              detailed action plans and PDF downloads.
            </p>
            <Link href="/pricing">
              <Button variant="outline">View Pricing</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200 mt-8">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage how you pay for reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Payment methods are configured at checkout when purchasing a readiness report.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
