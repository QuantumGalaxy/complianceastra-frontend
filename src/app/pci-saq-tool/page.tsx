import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "PCI DSS SAQ Tool | Determine Your SAQ Type",
  description:
    "Use the ComplianceAstra PCI DSS SAQ tool to determine the correct Self-Assessment Questionnaire (SAQ) for your business.",
};

export default function PCISAQToolPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">PCI DSS SAQ Tool</h1>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Determining the correct Self-Assessment Questionnaire (SAQ) is a critical first step for any
        merchant handling cardholder data. The wrong SAQ can lead to unnecessary compliance burden
        or, worse, gaps in your security posture.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">What Is a PCI DSS SAQ?</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        A PCI DSS SAQ (Self-Assessment Questionnaire) is a validation tool that merchants use to
        self-assess their compliance with the Payment Card Industry Data Security Standard (PCI
        DSS). The PCI Security Standards Council provides several SAQ types, each designed for
        different merchant environments and card-acceptance methods.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
        Why Merchants Must Determine the Correct SAQ
      </h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Using the wrong SAQ can result in incomplete assessments, failed audits, or unnecessary
        effort. Your acquiring bank or payment brand may require you to validate compliance using a
        specific SAQ based on how you store, process, or transmit cardholder data. Getting it right
        from the start saves time and reduces compliance risk.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Common SAQ Types</h2>
      <ul className="text-slate-600 mb-6 space-y-3 list-disc pl-6">
        <li>
          <strong className="text-slate-800">SAQ A</strong> — For merchants who outsource all
          cardholder data functions to validated third parties (e.g., fully outsourced ecommerce).
        </li>
        <li>
          <strong className="text-slate-800">SAQ A-EP</strong> — For ecommerce merchants whose
          website can impact the security of the cardholder data environment, even if they do not
          directly handle card data.
        </li>
        <li>
          <strong className="text-slate-800">SAQ D</strong> — For merchants who store, process, or
          transmit cardholder data, or who do not meet the criteria for other SAQ types.
        </li>
      </ul>

      <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-700 mb-4 font-medium">
          Not sure which SAQ applies to you? Use our guided assessment to determine your scope and
          SAQ type.
        </p>
        <Link href="/assessments/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Determine Your SAQ Type
          </Button>
        </Link>
      </div>

      <nav className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-3">Related resources:</p>
        <ul className="flex flex-wrap gap-4 text-sm">
          <li>
            <Link href="/pci-scope-calculator" className="text-emerald-600 hover:underline">
              PCI Scope Calculator
            </Link>
          </li>
          <li>
            <Link href="/pci-dss-requirements" className="text-emerald-600 hover:underline">
              PCI DSS Requirements Explained
            </Link>
          </li>
          <li>
            <Link href="/assessments/new" className="text-emerald-600 hover:underline">
              Start Free Assessment
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
