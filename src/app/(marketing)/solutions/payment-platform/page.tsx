import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Layers, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Payment Platform Compliance | ComplianceAstra",
  description:
    "PCI DSS scoping for payment platforms and fintech: APIs, multi-tenant systems, card data exposure. Prepare for SAQ or ROC.",
};

export default function PaymentPlatformCompliancePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/solutions" className="hover:text-slate-900">
                Solutions
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-slate-900 font-medium">Payment Platform Compliance</li>
          </ol>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Payment Platform & Fintech Compliance</h1>
          <p className="mt-4 text-lg text-slate-600">
            PCI DSS scoping for APIs, multi-tenant systems, and embedded payments. We help you
            evaluate card data exposure and prepare for SAQ or ROC.
          </p>
        </header>

        <section className="space-y-12" aria-labelledby="what-we-cover">
          <h2 id="what-we-cover" className="text-2xl font-bold text-slate-900">
            What we cover
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <Code className="h-8 w-8 text-emerald-600 mb-2" aria-hidden />
                <CardTitle>Data flow & APIs</CardTitle>
                <CardDescription>
                  Tokenized, pass-through, or stored—how card data flows through your platform
                  determines scope.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-slate-200">
              <CardHeader>
                <Layers className="h-8 w-8 text-emerald-600 mb-2" aria-hidden />
                <CardTitle>Multi-tenant isolation</CardTitle>
                <CardDescription>
                  Is card data isolated per tenant? We help you scope exposure across your
                  architecture.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="benefits">
          <h2 id="benefits" className="text-2xl font-bold text-slate-900">
            Why use our assessment
          </h2>
          <ul className="space-y-4">
            {[
              "Platform-specific questions—APIs, tenants, sub-processors",
              "Card data exposure evaluation",
              "Plain-English results and architecture recommendations",
              "Free scope summary; optional paid report for detailed action plan",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Ready to scope your payment platform?
              </h3>
              <p className="text-sm text-slate-600 mt-1">Free assessment. No credit card required.</p>
            </div>
            <Link href="/assessments/new?env=payment_platform">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Platform Assessment
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
