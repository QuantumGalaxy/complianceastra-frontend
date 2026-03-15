"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { assessmentsApi, reportsApi, type ScopeResult } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const { user, token, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<{
    scope_result: ScopeResult;
    anonymous_id?: string;
    is_owned?: boolean;
    report_id?: number;
    report_status?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [viewingReport, setViewingReport] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [autoClaimAttempted, setAutoClaimAttempted] = useState(false);

  useEffect(() => {
    assessmentsApi
      .get(id, token ?? undefined)
      .then((r) =>
        setData({
          scope_result: r.scope_result!,
          anonymous_id: r.anonymous_id,
          is_owned: r.is_owned,
          report_id: r.report_id,
          report_status: r.report_status,
        })
      )
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  // Auto-claim anonymous assessment when user lands on results page (e.g. after login from Sign Up flow)
  useEffect(() => {
    if (!user || !data?.anonymous_id || data?.is_owned || claiming || autoClaimAttempted) return;
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
    if (!authToken) return;
    const anonymousId = data.anonymous_id;
    setAutoClaimAttempted(true);
    const doClaim = async () => {
      setClaiming(true);
      setPurchaseError(null);
      try {
        await assessmentsApi.claim(id, authToken, anonymousId);
        const r = await assessmentsApi.get(id, authToken);
        setData((d) => (d ? { ...d, is_owned: true, anonymous_id: undefined, report_id: r.report_id, report_status: r.report_status } : null));
      } catch (e) {
        const isAuthError = e instanceof Error && (e.message?.includes("401") || e.message?.toLowerCase().includes("authenticated"));
        setPurchaseError(isAuthError ? "Session expired. Please log in again, then try claiming." : "Failed to claim assessment");
      } finally {
        setClaiming(false);
      }
    };
    doClaim();
  }, [user, data?.anonymous_id, data?.is_owned, id, token, claiming, autoClaimAttempted]);

  const handleClaim = async () => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
    const anonymousId = data?.anonymous_id;
    if (!authToken || !anonymousId) return;
    setClaiming(true);
    setPurchaseError(null);
    try {
      await assessmentsApi.claim(id, authToken, anonymousId);
      const r = await assessmentsApi.get(id, authToken);
      setData((d) =>
        d ? { ...d, is_owned: true, anonymous_id: undefined, report_id: r.report_id, report_status: r.report_status } : null
      );
    } catch (e) {
      const isAuthError = e instanceof Error && (e.message?.includes("401") || e.message?.toLowerCase().includes("authenticated"));
      setPurchaseError(isAuthError ? "Session expired. Please log in again, then try claiming." : "Failed to claim assessment");
    } finally {
      setClaiming(false);
    }
  };

  const handlePurchase = async () => {
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
    if (!authToken) return;
    setPurchasing(true);
    setPurchaseError(null);
    try {
      const { checkout_url } = await reportsApi.checkout(id, authToken);
      window.location.href = checkout_url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
      setPurchaseError(msg.includes("not configured") ? "Payment system not configured. Add STRIPE_DEV_BYPASS=true to backend .env for development, or configure Stripe for production." : msg);
      setPurchasing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Loading results...</p>
      </div>
    );
  }

  if (!data?.scope_result) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Results not found.</p>
        <Link href="/assessments/new">
          <Button className="mt-4">Start New Assessment</Button>
        </Link>
      </div>
    );
  }

  const scope = data.scope_result;

  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Your Scope Results</h1>
          <p className="mt-2 text-slate-600">
            Plain-English guidance based on your answers. This is not a compliance certification.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
            <Badge
              variant={scope.scope_level === "reduced" ? "default" : "secondary"}
            >
              Scope: {scope.scope_level}
            </Badge>
            {scope.likely_saq && (
              <Badge variant="outline" className="border-emerald-600 text-emerald-700">
                Likely SAQ Path: {["A", "A-EP", "B", "P2PE", "D"].includes(scope.likely_saq) ? `SAQ ${scope.likely_saq}` : scope.likely_saq}
              </Badge>
            )}
            {!scope.likely_saq && scope.suggested_saq && (
              <Badge variant="outline">Suggested: {scope.suggested_saq}</Badge>
            )}
            {scope.confidence && (
              <Badge variant="outline">Confidence: {scope.confidence}</Badge>
            )}
            {scope.confidence_score != null && !scope.confidence && (
              <span className="text-sm text-slate-500">
                Confidence: {scope.confidence_score}%
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-8 text-sm text-amber-900" role="note">
          <strong>Disclaimer:</strong> This tool provides guidance and readiness insights only. Final
          compliance validation depends on your acquiring bank, payment processor, or qualified
          security assessor where applicable.
        </div>

        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>{scope.summary}</CardDescription>
            {scope.explanation && scope.explanation.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-slate-600 space-y-1 text-sm">
                {scope.explanation.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-emerald-800">In Scope</CardTitle>
              <CardContent className="pt-0">
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {scope.in_scope.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Out of Scope</CardTitle>
              <CardContent className="pt-0">
                {scope.out_of_scope.length > 0 ? (
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {scope.out_of_scope.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm">—</p>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        {scope.risk_areas.length > 0 && (
          <Card className="border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-800">Risk Areas</CardTitle>
              <CardContent className="pt-0">
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {scope.risk_areas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </CardHeader>
          </Card>
        )}

        {scope.scope_insights && scope.scope_insights.length > 0 && (
          <Card className="border-slate-200 mb-8">
            <CardHeader>
              <CardTitle>Scope Insights</CardTitle>
              <CardContent className="pt-0">
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {scope.scope_insights.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </CardHeader>
          </Card>
        )}

        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardContent className="pt-0">
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {scope.recommendations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </CardHeader>
        </Card>

        {scope.next_steps && scope.next_steps.length > 0 && (
          <Card className="border-emerald-100 mb-8">
            <CardHeader>
              <CardTitle className="text-slate-900">Recommended Next Steps</CardTitle>
              <CardContent className="pt-0">
                <ol className="list-decimal list-inside text-slate-700 space-y-1">
                  {scope.next_steps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              </CardContent>
            </CardHeader>
          </Card>
        )}

        {scope.information_gaps && scope.information_gaps.length > 0 && (
          <Card className="border-amber-100 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-800">Information Gaps</CardTitle>
              <CardDescription>
                The following items were answered &quot;Not sure&quot; or left blank. Clarifying these may improve the accuracy of your likely SAQ path.
              </CardDescription>
              <CardContent className="pt-0">
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {scope.information_gaps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </CardHeader>
          </Card>
        )}

        {purchaseError && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {purchaseError}
            {purchaseError.includes("log in again") && (
              <>
                {" "}
                <Link
                  href={`/login?returnTo=${encodeURIComponent(`/assessments/${id}/results`)}`}
                  className="underline font-medium"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <Link href="/assessments/new">
            <Button variant="outline">Start New Assessment</Button>
          </Link>
          {!user && (
            <Link
              href={`/register?returnTo=${encodeURIComponent(
                `/assessments/${id}/results${data?.anonymous_id ? `?token=${data.anonymous_id}` : ""}`
              )}`}
            >
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Sign Up to Save & Get Full Report
              </Button>
            </Link>
          )}
          {user && data?.anonymous_id && !data?.is_owned && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? "Claiming…" : "Claim Assessment & Purchase Report"}
            </Button>
          )}
          {user && data?.is_owned && data?.report_id && data?.report_status === "generated" && (
            <>
              <Button
                variant="outline"
                disabled={viewingReport}
                onClick={async () => {
                  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
                  if (!authToken || !data?.report_id) return;
                  setViewingReport(true);
                  try {
                    await reportsApi.viewInBrowser(data.report_id, authToken);
                  } finally {
                    setViewingReport(false);
                  }
                }}
              >
                {viewingReport ? "Opening…" : "View Full Report"}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={downloadingReport}
                onClick={async () => {
                  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("complianceastra_token") : null);
                  if (!authToken || !data?.report_id) return;
                  setDownloadingReport(true);
                  try {
                    await reportsApi.download(data.report_id, authToken);
                  } finally {
                    setDownloadingReport(false);
                  }
                }}
              >
                {downloadingReport ? "Downloading…" : "Download PDF"}
              </Button>
            </>
          )}
          {user && data?.is_owned && !data?.report_id && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? "Redirecting…" : "Purchase Full Report ($99)"}
            </Button>
          )}
          {user && data?.is_owned && data?.report_id && data?.report_status !== "generated" && (
            <p className="text-sm text-slate-500 self-center">
              Report is being generated. Refresh in a moment.
            </p>
          )}
          {user && !data?.is_owned && !data?.anonymous_id && (
            <p className="text-sm text-slate-500 self-center">
              This assessment belongs to another account.
            </p>
          )}
          <Link href="/contact">
            <Button variant="ghost">Schedule Consultation</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
