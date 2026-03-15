const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, fullName?: string) =>
    api<{ access_token: string; user: { id: number; email: string; full_name: string | null } }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: fullName }),
      }
    ),
  login: (email: string, password: string) =>
    api<{ access_token: string; user: { id: number; email: string; full_name: string | null } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    ),
  me: (token: string) =>
    api<{ id: number; email: string; full_name: string | null }>("/api/auth/me", {
      token,
    }),
};

export const assessmentsApi = {
  create: (environmentType: string, token?: string) =>
    api<{ id: number; environment_type: string }>("/api/assessments", {
      method: "POST",
      body: JSON.stringify({ environment_type: environmentType }),
      token,
    }),
  getQuestions: (id: number) =>
    api<{ questions: Array<{
      id: number;
      question_key: string;
      question_text: string;
      question_type: string;
      category: string;
      help_text: string | null;
      options?: Array<{ value: string; label: string }>;
    }> }>(`/api/assessments/${id}/questions`),
  submitAnswer: (assessmentId: number, questionId: number, answerValue: string) =>
    api<{ ok: boolean }>(`/api/assessments/${assessmentId}/answer`, {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, answer_value: answerValue }),
    }),
  complete: (assessmentId: number) =>
    api<{ scope_result: ScopeResult }>(`/api/assessments/${assessmentId}/complete`, {
      method: "POST",
    }),
  get: (id: number, token?: string) =>
    api<{
      id: number;
      environment_type: string;
      status: string;
      scope_result: ScopeResult | null;
      anonymous_id?: string;
      is_owned?: boolean;
      report_id?: number;
      report_status?: string;
    }>(`/api/assessments/${id}`, { token }),
  claim: (assessmentId: number, token: string, anonymousId: string) =>
    api<{ ok: boolean; assessment_id: number }>("/api/assessments/claim", {
      method: "POST",
      body: JSON.stringify({ assessment_id: assessmentId, token: anonymousId }),
      token,
    }),
};

export interface ScopeResult {
  summary: string;
  in_scope: string[];
  out_of_scope: string[];
  risk_areas: string[];
  recommendations: string[];
  scope_level: string;
  /** Phase 6: Environment classification (e.g. redirect_only_checkout) */
  environment_classification?: string;
  /** Phase 6: Confidence 0-100 */
  confidence_score?: number;
  /** Phase 6: Scope insights */
  scope_insights?: string[];
  /** Phase 6: Suggested SAQ/ROC */
  suggested_saq?: string;
  /** Phase 6: Next steps */
  next_steps?: string[];
  /** POS SAQ: Likely SAQ path (B, P2PE, D, Needs Review) */
  likely_saq?: string;
  /** POS SAQ: Confidence level (high, medium, low) */
  confidence?: string;
  /** POS SAQ: Explanation bullets */
  explanation?: string[];
  /** POS SAQ: Information gaps from Not sure answers */
  information_gaps?: string[];
}

/** Phase 8: Reports and checkout */
export const reportsApi = {
  checkout: (assessmentId: number, token: string) =>
    api<{ checkout_url: string; session_id: string }>("/api/reports/checkout", {
      method: "POST",
      body: JSON.stringify({ assessment_id: assessmentId }),
      token,
    }),
  /** Trigger PDF download in browser (user) */
  download: async (reportId: number, token: string, filename = "compliance-readiness-report.pdf") => {
    const res = await fetch(`${API_BASE}/api/reports/${reportId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
  /** Open PDF in new tab (user) */
  viewInBrowser: async (reportId: number, token: string) => {
    const res = await fetch(`${API_BASE}/api/reports/${reportId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("View failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },
};

/** Phase 9: Admin API */
export const adminApi = {
  assessments: (token: string, params?: { scope_level?: string; environment_type?: string }) => {
    const search = new URLSearchParams();
    if (params?.scope_level) search.set("scope_level", params.scope_level);
    if (params?.environment_type) search.set("environment_type", params.environment_type);
    const q = search.toString();
    return api<{ assessments: Array<{
      id: number;
      user_email: string | null;
      environment_type: string;
      scope_level: string | null;
      status: string;
      created_at: string;
      notes_count: number;
    }> }>(`/api/admin/assessments${q ? `?${q}` : ""}`, { token });
  },
  assessmentDetail: (id: number, token: string) =>
    api<{
      id: number;
      user_email: string | null;
      environment_type: string;
      status: string;
      scope_result: Record<string, unknown> | null;
      created_at: string;
      notes: Array<{ id: number; note: string; created_at: string }>;
    }>(`/api/admin/assessments/${id}`, { token }),
  addNote: (assessmentId: number, note: string, token: string) =>
    api<{ id: number; note: string; created_at: string }>(`/api/admin/assessments/${assessmentId}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
      token,
    }),
  users: (token: string) =>
    api<{ users: Array<{ id: number; email: string; full_name: string | null; created_at: string; reports_count: number }> }>(
      "/api/admin/users",
      { token }
    ),
  organizations: (token: string) =>
    api<{ organizations: Array<{ id: number; name: string; slug: string; is_active: boolean; created_at: string }> }>(
      "/api/admin/organizations",
      { token }
    ),
  reports: (token: string) =>
    api<{ reports: Array<{
      id: number;
      user_email: string | null;
      assessment_id: number;
      status: string;
      created_at: string;
    }> }>("/api/admin/reports", { token }),
  downloadReport: async (reportId: number, token: string) => {
    const res = await fetch(`${API_BASE}/api/admin/reports/${reportId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compliance-readiness-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  },
  leads: (token: string) =>
    api<{ leads: Array<{ id: number; email: string; name: string | null; environment_type: string | null; status: string; created_at: string }> }>(
      "/api/admin/leads",
      { token }
    ),
  audit: (token: string, limit?: number) =>
    api<{ events: Array<{
      id: number;
      entity_type: string;
      entity_id: number;
      action: string;
      actor_user_id: number | null;
      payload: Record<string, unknown> | null;
      created_at: string;
    }> }>(`/api/admin/audit${limit ? `?limit=${limit}` : ""}`, { token }),
};
