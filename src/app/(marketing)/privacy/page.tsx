export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-slate-500">Last updated: March 2025</p>
        <div className="mt-8 prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            ComplianceAstra LLC (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy
            describes how we collect, use, and protect your information when you use our platform.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Information We Collect</h2>
          <p>
            We collect information you provide when registering, completing assessments, or
            contacting us—including email, name, and assessment responses. We do not collect or store
            payment card data; payments are processed by Stripe.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">How We Use Your Information</h2>
          <p>
            We use your information to provide our services, generate reports, improve our platform,
            and communicate with you. We may use assessment data in aggregate for product improvement.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data.
            Data is stored securely and transmitted over HTTPS.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8">Contact</h2>
          <p>
            For privacy-related questions, contact us at privacy@complianceastra.com.
          </p>
        </div>
      </div>
    </div>
  );
}
