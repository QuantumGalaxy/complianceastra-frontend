export default function TermsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-slate-500">Last updated: March 2025</p>
        <div className="mt-8 prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            By using ComplianceAstra, you agree to these terms. Our platform provides guidance and
            readiness insights only—we do not certify compliance.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Use of Service</h2>
          <p>
            You may use our free assessment and paid report services in accordance with these terms.
            You are responsible for the accuracy of information you provide and for ensuring your
            organization meets applicable compliance obligations.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Disclaimer</h2>
          <p>
            This tool provides guidance and readiness insights only. Final compliance validation
            depends on your acquiring bank, payment processor, or qualified security assessor where
            applicable.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Contact</h2>
          <p>
            For questions about these terms, contact us at legal@complianceastra.com.
          </p>
        </div>
      </div>
    </div>
  );
}
