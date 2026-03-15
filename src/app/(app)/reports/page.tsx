"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { reportsApi } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Report = {
  id: number;
  assessment_id: number;
  status: string;
  created_at: string;
};

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }
    if (token) {
      fetch(`${API_BASE}/api/users/me/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setReports(d.reports || []))
        .catch(() => {});
    }
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
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600">Your paid readiness reports and scope summaries</p>
          </div>
          <Link href="/assessments/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">New Assessment</Button>
          </Link>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Readiness Reports</CardTitle>
            <CardDescription>
              Detailed action plans, control-by-control readiness, and prioritized remediation steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No reports yet.</p>
                <p className="text-sm text-slate-600 mb-6">
                  Complete an assessment and purchase a readiness report to unlock detailed guidance.
                </p>
                <Link href="/assessments/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Start Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {reports.map((r) => (
                  <li key={r.id} className="py-4 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <Link
                        href={`/assessments/${r.assessment_id}/results`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        Report #{r.id} — Assessment #{r.assessment_id}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(r.created_at).toLocaleDateString()} · {r.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/assessments/${r.assessment_id}/results`}>
                        <Button variant="outline" size="sm">View Results</Button>
                      </Link>
                      {r.status === "generated" && token && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={downloadingId === r.id}
                          onClick={async () => {
                            setDownloadingId(r.id);
                            try {
                              await reportsApi.download(r.id, token);
                            } finally {
                              setDownloadingId(null);
                            }
                          }}
                        >
                          {downloadingId === r.id ? "Downloading…" : "Download PDF"}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
