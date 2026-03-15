import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Pricing | ComplianceAstra",
  description: "Start free. Upgrade when you need deeper insights. Free scope assessment and paid readiness reports.",
};

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900">Pricing</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Start free. Upgrade when you need deeper insights.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Free Scope Assessment</CardTitle>
              <CardDescription>
                Understand your PCI scope in plain English. No sign-up required to start.
              </CardDescription>
              <p className="text-3xl font-bold text-slate-900 mt-4">$0</p>
              <ul className="text-sm text-slate-600 space-y-2 mt-4">
                <li>✓ Environment-specific questions</li>
                <li>✓ Transaction-flow-first</li>
                <li>✓ Plain-English scope summary</li>
                <li>✓ Risk areas highlighted</li>
                <li>✓ Sign up to save progress</li>
              </ul>
            </CardHeader>
            <CardContent>
              <Link href="/assessments/new">
                <Button className="w-full" variant="outline">
                  Start Free Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-slate-900">Paid Readiness Report</CardTitle>
              <CardDescription>
                Detailed action plan, control-by-control readiness, prioritized remediation steps.
              </CardDescription>
              <p className="text-3xl font-bold text-slate-900 mt-4">One-time purchase</p>
              <ul className="text-sm text-slate-600 space-y-2 mt-4">
                <li>✓ Full scope definition</li>
                <li>✓ Control readiness by area</li>
                <li>✓ Prioritized action items</li>
                <li>✓ PDF report download</li>
                <li>✓ Consultant-style narrative</li>
              </ul>
            </CardHeader>
            <CardContent>
              <Link href="/assessments/new">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Complete Assessment to Unlock
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="mt-16 text-center">
          <p className="text-slate-600">
            Need help?{" "}
            <Link href="/contact" className="text-emerald-600 hover:underline font-medium">
              Schedule a compliance consultation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
