"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function AuthCompleteInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const reportFlag = searchParams.get("report");
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session. Return to your assessment or open the link from your email.");
      return;
    }
    if (done.current) return;
    done.current = true;

    authApi
      .postCheckout(sessionId)
      .then(async (res) => {
        if (res.needs_password_setup && res.setup_token) {
          router.replace(`/auth/set-password?token=${encodeURIComponent(res.setup_token)}`);
          return;
        }
        if (res.access_token) {
          await loginWithToken(res.access_token);
          const q = reportFlag === "success" ? "?report=success" : "";
          router.replace(`/dashboard${q}`);
          return;
        }
        setError("Could not complete sign-in. Try the link in your email or contact support.");
      })
      .catch((e: Error) => {
        done.current = false;
        setError(e.message || "Checkout completion failed.");
      });
  }, [sessionId, reportFlag, router, loginWithToken]);

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-700 mb-4 max-w-md">{error}</p>
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-slate-600">Completing your purchase…</p>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-slate-600">Loading…</div>
      }
    >
      <AuthCompleteInner />
    </Suspense>
  );
}
