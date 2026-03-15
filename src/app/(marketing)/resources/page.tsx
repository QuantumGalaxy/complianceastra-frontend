import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Resources | ComplianceAstra",
  description: "Compliance guides, FAQs, and documentation. Learn about PCI DSS, scoping, and compliance best practices.",
};

const RESOURCES = [
  {
    title: "PCI DSS Overview",
    description: "Understand the Payment Card Industry Data Security Standard and how it applies to your business.",
    icon: FileText,
    href: "/legal/disclaimer",
  },
  {
    title: "Scoping Guide",
    description: "Learn how to define your cardholder data environment (CDE) and reduce scope where possible.",
    icon: BookOpen,
    href: "/solutions",
  },
  {
    title: "FAQs",
    description: "Common questions about assessments, reports, and compliance requirements.",
    icon: HelpCircle,
    href: "/contact",
  },
];

export default function ResourcesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900">Resources</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Guides, FAQs, and documentation to help you understand compliance and scoping.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {RESOURCES.map((r) => (
            <Link key={r.title} href={r.href} className="group">
              <Card className="border-slate-200 h-full transition-colors group-hover:border-slate-300">
                <CardHeader>
                  <r.icon className="h-8 w-8 text-emerald-600 mb-2" aria-hidden />
                  <CardTitle className="text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {r.title}
                  </CardTitle>
                  <CardDescription>{r.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-slate-600">
            Ready to assess your scope?{" "}
            <Link href="/assessments/new" className="text-emerald-600 hover:underline font-medium">
              Start a free assessment
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
