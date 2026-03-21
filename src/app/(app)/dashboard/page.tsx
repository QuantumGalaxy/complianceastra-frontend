"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { authApi } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function DashboardContent() {
  const searchParams = useSearchParams();
  const reportSuccess = searchParams.get("report") === "success";
  const stripeSessionId = searchParams.get("session_id");
  const { user, token, isLoading, logout, loginWithToken } = useAuth();
  const router = useRouter();
  const [postCheckoutError, setPostCheckoutError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<
    Array<{ id: number; environment_type: string; status: string; created_at: string }>
  >([]);
  const [reports, setReports] = useState<
    Array<{ id: number; assessment_id: number; status: string; created_at: string }>
  >([]);

  const postCheckoutDone = useRef(false);

  useEffect(() => {
    if (!stripeSessionId || postCheckoutDone.current || isLoading) return;
    postCheckoutDone.current = true;
    authApi
      .postCheckout(stripeSessionId)
      .then(async (res) => {
        await loginWithToken(res.access_token);
        router.replace("/dashboard?report=success");
      })
      .catch((e: Error) => {
        postCheckoutDone.current = false;
        setPostCheckoutError(e.message || "Could not complete sign-in after payment.");
      });
  }, [stripeSessionId, isLoading, loginWithToken, router]);

  useEffect(() => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
    if (!isLoading && !authToken && !stripeSessionId) {
      router.push("/login");
      return;
    }
    if (authToken) {
      fetch(`${API_BASE}/api/users/me/assessments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((r) => r.json())
        .then((d) => setAssessments(d.assessments || []))
        .catch(() => {});
      fetch(`${API_BASE}/api/users/me/reports`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((r) => r.json())
        .then((d) => setReports(d.reports || []))
        .catch(() => {});
    }
  }, [token, isLoading, router, stripeSessionId]);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const envLabel = (e: string) =>
    e === "ecommerce" ? "Ecommerce" : e === "pos" ? "POS" : "Payment Platform";

  return (
    <div className="py-16">
      <div className="container">
        {postCheckoutError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
            {postCheckoutError}
          </div>
        )}
        {reportSuccess && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm">
            Payment successful! Your report is ready — download from the list below.
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome, {user.full_name || user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/assessments/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">New Assessment</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>Your saved scope assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length === 0 ? (
                <p className="text-slate-500 text-sm">No assessments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {assessments.slice(0, 5).map((a) => (
                    <li key={a.id} className="flex justify-between items-center">
                      <Link
                        href={`/assessments/${a.id}`}
                        className="text-emerald-600 hover:underline"
                      >
                        {envLabel(a.environment_type)} — {a.status}
                      </Link>
                      <span className="text-xs text-slate-500">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/assessments/new" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Start New Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Your paid readiness reports</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-slate-500 text-sm">No reports yet.</p>
              ) : (
                <ul className="space-y-2">
                  {reports.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex justify-between items-center">
                      <Link href="/reports" className="text-emerald-600 hover:underline">
                        Report #{r.id} — Assessment #{r.assessment_id}
                      </Link>
                      <span className="text-xs text-slate-500">{r.status}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/reports" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  View All Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-600">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
