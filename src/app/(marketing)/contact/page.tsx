import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Contact | ComplianceAstra",
  description: "Schedule a compliance consultation. Get in touch for complex environments and custom scoping.",
};

export default function ContactPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Schedule a Consultation</h1>
          <p className="mt-4 text-slate-600">
            Complex environments often benefit from a compliance review. Our team can help you scope
            your cardholder data environment and plan your readiness journey.
          </p>
        </header>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Email us to schedule a call. Include your environment type and any specific questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:consulting@complianceastra.com"
              className="text-emerald-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
            >
              consulting@complianceastra.com
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
