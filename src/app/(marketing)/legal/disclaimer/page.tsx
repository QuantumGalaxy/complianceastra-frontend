export default function DisclaimerPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Legal Disclaimer</h1>
        <div className="mt-8 prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed">
            <strong>This tool provides guidance and readiness insights only.</strong> Final compliance
            validation depends on your acquiring bank, payment processor, or qualified security
            assessor where applicable.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            ComplianceAstra does not certify compliance. We provide scoping guidance, readiness
            assessment, risk insights, and consultant-style reports to help you understand and
            navigate complex security and regulatory compliance requirements. You are responsible
            for ensuring your organization meets all applicable compliance obligations.
          </p>
        </div>
      </div>
    </div>
  );
}
