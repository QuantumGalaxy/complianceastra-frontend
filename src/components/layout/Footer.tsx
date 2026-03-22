"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LEGAL_DISCLAIMER =
  "This tool provides guidance and readiness insights only. Final compliance validation depends on your acquiring bank, payment processor, or qualified security assessor where applicable.";

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <footer className="border-t border-slate-200/60 bg-slate-50/40">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              © {new Date().getFullYear()} Dama AI LLC. All rights reserved.
            </span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-700">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-700">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/60">
      <div className="container py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="font-semibold text-slate-900">
              ComplianceAstra
            </Link>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              {LEGAL_DISCLAIMER}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Product</h4>
              <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                <li><Link href="/solutions" className="hover:text-slate-900">Solutions</Link></li>
                <li><Link href="/pricing" className="hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/resources" className="hover:text-slate-900">Resources</Link></li>
                <li><Link href="/assessments/new" className="hover:text-slate-900">Free Assessment</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Legal</h4>
              <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                <li><Link href="/legal/disclaimer" className="hover:text-slate-900">Disclaimer</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200/60 text-xs text-slate-500">
          © {new Date().getFullYear()} Dama AI LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
