"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";

type Assessment = {
  id: number;
  user_email: string | null;
  environment_type: string;
  scope_level: string | null;
  status: string;
  created_at: string;
  notes_count: number;
};

type AssessmentDetail = {
  id: number;
  user_email: string | null;
  environment_type: string;
  status: string;
  scope_result: Record<string, unknown> | null;
  created_at: string;
  notes: Array<{ id: number; note: string; created_at: string }>;
};

export default function AdminPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scopeLevel, setScopeLevel] = useState<string>("all");
  const [envType, setEnvType] = useState<string>("all");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentDetail, setAssessmentDetail] = useState<AssessmentDetail | null>(null);
  const [users, setUsers] = useState<
    Array<{ id: number; email: string; full_name: string | null; created_at: string; reports_count: number }>
  >([]);
  const [organizations, setOrganizations] = useState<
    Array<{ id: number; name: string; slug: string; is_active: boolean; created_at: string }>
  >([]);
  const [reports, setReports] = useState<
    Array<{ id: number; user_email: string | null; assessment_id: number; status: string; created_at: string }>
  >([]);
  const [leads, setLeads] = useState<
    Array<{ id: number; email: string; name: string | null; environment_type: string | null; status: string; created_at: string }>
  >([]);
  const [auditEvents, setAuditEvents] = useState<
    Array<{ id: number; entity_type: string; entity_id: number; action: string; created_at: string }>
  >([]);
  const [addNoteAssessmentId, setAddNoteAssessmentId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  const loadAssessments = () => {
    if (!token) return;
    adminApi
      .assessments(token, {
        scope_level: scopeLevel === "all" ? undefined : scopeLevel,
        environment_type: envType === "all" ? undefined : envType,
      })
      .then((d) => setAssessments(d.assessments))
      .catch(() => setError("Failed to load assessments"));
  };

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }
    if (token) {
      loadAssessments();
      adminApi.users(token).then((d) => setUsers(d.users)).catch(() => setError("Failed"));
      adminApi.organizations(token).then((d) => setOrganizations(d.organizations)).catch(() => setError("Failed"));
      adminApi.reports(token).then((d) => setReports(d.reports)).catch(() => setError("Failed"));
      adminApi.leads(token).then((d) => setLeads(d.leads)).catch(() => setError("Failed"));
      adminApi.audit(token, 50).then((d) => setAuditEvents(d.events)).catch(() => setError("Failed"));
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) loadAssessments();
  }, [scopeLevel, envType, token]);

  const viewAssessment = (id: number) => {
    if (!token) return;
    adminApi.assessmentDetail(id, token).then(setAssessmentDetail).catch(() => setError("Failed"));
  };

  const handleAddNote = async () => {
    if (!token || !addNoteAssessmentId || !noteText.trim()) return;
    setSubmittingNote(true);
    try {
      await adminApi.addNote(addNoteAssessmentId, noteText.trim(), token);
      setNoteText("");
      setAddNoteAssessmentId(null);
      if (assessmentDetail?.id === addNoteAssessmentId) {
        adminApi.assessmentDetail(addNoteAssessmentId, token).then(setAssessmentDetail);
      }
      loadAssessments();
    } catch {
      setError("Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  const downloadReport = (reportId: number) => {
    if (!token) return;
    adminApi.downloadReport(reportId, token).catch(() => setError("Download failed"));
  };

  if (isLoading) return <div className="py-16 text-center">Loading...</div>;
  if (error) return <div className="py-16 text-center text-red-600">{error}</div>;

  return (
    <div className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="reports">Paid Customers</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <Label className="text-xs text-slate-500">Scope Level</Label>
                <Select value={scopeLevel} onValueChange={setScopeLevel}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="reduced">Reduced</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Environment</Label>
                <Select value={envType} onValueChange={setEnvType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ecommerce">Ecommerce</SelectItem>
                    <SelectItem value="pos">POS</SelectItem>
                    <SelectItem value="payment_platform">Payment Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Assessments</CardTitle>
                  <CardDescription>Filter by risk level (scope) and environment</CardDescription>
                </CardHeader>
                <CardContent>
                  {assessments.length === 0 ? (
                    <p className="text-slate-500 text-sm">No assessments.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {assessments.map((a) => (
                        <li
                          key={a.id}
                          className="flex justify-between items-center p-2 rounded border border-slate-100 hover:bg-slate-50"
                        >
                          <div>
                            <span className="font-medium">#{a.id}</span>
                            <span className="text-slate-500 ml-2">{a.user_email || "Anonymous"}</span>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {a.environment_type}
                              </Badge>
                              {a.scope_level && (
                                <Badge variant={a.scope_level === "expanded" ? "destructive" : "secondary"}>
                                  {a.scope_level}
                                </Badge>
                              )}
                              {a.notes_count > 0 && (
                                <span className="text-xs text-slate-500">{a.notes_count} notes</span>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => viewAssessment(a.id)}>
                            View
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Assessment Detail</CardTitle>
                  <CardDescription>
                    {assessmentDetail ? `#${assessmentDetail.id}` : "Select an assessment"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentDetail ? (
                    <>
                      <div className="text-sm">
                        <p>
                          <strong>User:</strong> {assessmentDetail.user_email || "Anonymous"}
                        </p>
                        <p>
                          <strong>Environment:</strong> {assessmentDetail.environment_type}
                        </p>
                        <p>
                          <strong>Status:</strong> {assessmentDetail.status}
                        </p>
                        {assessmentDetail.scope_result && (
                          <p>
                            <strong>Scope:</strong>{" "}
                            {(assessmentDetail.scope_result as { scope_level?: string }).scope_level || "—"}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Consultant Notes</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAddNoteAssessmentId(assessmentDetail.id);
                              setNoteText("");
                            }}
                          >
                            Add Note
                          </Button>
                        </div>
                        {addNoteAssessmentId === assessmentDetail.id ? (
                          <div className="space-y-2 mb-4">
                            <Textarea
                              placeholder="Internal note..."
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleAddNote} disabled={submittingNote}>
                                {submittingNote ? "Saving…" : "Save"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setAddNoteAssessmentId(null);
                                  setNoteText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                        {assessmentDetail.notes.length > 0 ? (
                          <ul className="space-y-2 text-sm">
                            {assessmentDetail.notes.map((n) => (
                              <li key={n.id} className="p-2 rounded bg-slate-50 border border-slate-100">
                                {n.note}
                                <p className="text-xs text-slate-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-sm">No notes yet.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm">Click View on an assessment.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Registered users with report count</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-slate-500 text-sm">No users.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {users.map((u) => (
                      <li key={u.id} className="flex justify-between">
                        <span>{u.email}</span>
                        <span className="text-slate-500">
                          {new Date(u.created_at).toLocaleDateString()} · {u.reports_count} reports
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>All organizations</CardDescription>
              </CardHeader>
              <CardContent>
                {organizations.length === 0 ? (
                  <p className="text-slate-500 text-sm">No organizations.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {organizations.map((o) => (
                      <li key={o.id} className="flex justify-between">
                        <span>{o.name}</span>
                        <span className="text-slate-500">{o.slug}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Paid Customers</CardTitle>
                <CardDescription>Reports purchased via Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-slate-500 text-sm">No reports yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {reports.map((r) => (
                      <li key={r.id} className="flex justify-between items-center">
                        <div>
                          <span>{r.user_email}</span>
                          <span className="text-slate-500 ml-2">Report #{r.id} · {r.status}</span>
                        </div>
                        {r.status === "generated" && (
                          <Button size="sm" variant="outline" onClick={() => downloadReport(r.id)}>
                            Download
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Consulting Leads</CardTitle>
                <CardDescription>Leads from assessment and contact forms</CardDescription>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <p className="text-slate-500 text-sm">No leads yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {leads.map((l) => (
                      <li key={l.id} className="flex justify-between">
                        <span>{l.email}</span>
                        <span className="text-slate-500">{l.environment_type || "—"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Recent admin and system actions</CardDescription>
              </CardHeader>
              <CardContent>
                {auditEvents.length === 0 ? (
                  <p className="text-slate-500 text-sm">No audit events yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm font-mono">
                    {auditEvents.map((e) => (
                      <li key={e.id} className="flex justify-between text-xs">
                        <span>
                          {e.action} {e.entity_type}:{e.entity_id}
                        </span>
                        <span className="text-slate-500">{new Date(e.created_at).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
