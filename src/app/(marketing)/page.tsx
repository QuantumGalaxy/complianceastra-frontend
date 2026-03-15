import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, FileCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white py-24 md:py-32"
        aria-labelledby="hero-heading"
      >
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
            >
              Simplify complex compliance frameworks
            </h1>
            <p className="mt-6 text-lg text-slate-600 md:text-xl">
              ComplianceAstra helps businesses understand and navigate PCI DSS and regulatory
              compliance. Get plain-English scope guidance in minutes—not days.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/assessments/new">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-lg px-8"
                  aria-label="Start free PCI DSS scope assessment"
                >
                  Start Free Assessment
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8"
                  aria-label="Explore compliance solutions"
                >
                  Explore Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-20" aria-labelledby="value-heading">
        <div className="container">
          <div className="text-center mb-16">
            <h2 id="value-heading" className="text-3xl font-bold text-slate-900">
              Understand your PCI scope in minutes
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Transaction-flow-first questions. Environment-specific guidance. Plain-English results.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-slate-200 hover:border-slate-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-emerald-600" aria-hidden />
                  <CardTitle className="text-slate-900">Ecommerce</CardTitle>
                </div>
                <CardDescription>
                  Checkout, hosting, third-party integrations—we help you understand what&apos;s in scope.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/solutions/ecommerce">
                  <Button variant="outline" className="w-full">
                    Learn more
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:border-slate-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-emerald-600" aria-hidden />
                  <CardTitle className="text-slate-900">POS & Retail</CardTitle>
                </div>
                <CardDescription>
                  Network segmentation, terminal management, multi-location requirements—plain English.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/solutions/pos">
                  <Button variant="outline" className="w-full">
                    Learn more
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-slate-200 hover:border-slate-300 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-emerald-600" aria-hidden />
                  <CardTitle className="text-slate-900">Payment Platforms</CardTitle>
                </div>
                <CardDescription>
                  APIs, multi-tenant systems, card data exposure—scope your SAQ or ROC with confidence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/solutions/payment-platform">
                  <Button variant="outline" className="w-full">
                    Learn more
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 bg-slate-900 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="container text-center">
          <h2 id="cta-heading" className="text-3xl font-bold">
            Ready to understand your scope?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Free assessment. No credit card. Get actionable guidance in under 15 minutes.
          </p>
          <Link href="/assessments/new" className="inline-block mt-8">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold"
              aria-label="Start free assessment"
            >
              Start Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
