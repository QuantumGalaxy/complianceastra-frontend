"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CompletePasswordForm } from "@/components/auth/CompletePasswordForm";

function SetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  if (!token) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-slate-700 mb-4">This link is invalid or incomplete.</p>
        <Link href="/auth/forgot-password" className="text-emerald-600 font-medium hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <CompletePasswordForm
      token={token}
      title="Create your password"
      description="Choose a password to secure your account and access your reports."
    />
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}>
      <SetPasswordInner />
    </Suspense>
  );
}
