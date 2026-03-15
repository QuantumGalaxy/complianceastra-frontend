import Link from "next/link";

const LEGAL_DISCLAIMER =
  "This tool provides guidance and readiness insights only. Final compliance validation depends on your acquiring bank, payment processor, or qualified security assessor where applicable.";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-semibold text-slate-900">
              ComplianceAstra
            </Link>
            <p className="mt-2 text-sm text-slate-600 max-w-md">
              {LEGAL_DISCLAIMER}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Product</h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/solutions" className="hover:text-slate-900">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-slate-900">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/assessments/new" className="hover:text-slate-900">
                  Free Assessment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/legal/disclaimer" className="hover:text-slate-900">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 text-sm text-slate-500">
          © {new Date().getFullYear()} ComplianceAstra LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
