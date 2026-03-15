import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "PCI SAQ Questionnaire Guide | Determine Your PCI SAQ",
  description:
    "Understand the PCI DSS Self-Assessment Questionnaire (SAQ) and determine which SAQ your business must complete.",
};

export default function PCISAQQuestionnairePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">PCI SAQ Questionnaire Guide</h1>

      <p className="text-slate-600 mb-4 leading-relaxed">
        The PCI SAQ questionnaire is a self-validation tool that merchants and service providers use
        to assess their compliance with the Payment Card Industry Data Security Standard (PCI DSS).
        Merchants must complete the appropriate SAQ when they are required to validate compliance
        with their acquiring bank or payment brand. The SAQ is typically required annually, when
        significant changes occur to your cardholder data environment, or as specified by your
        acquirer or payment processor.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">What Is a PCI SAQ?</h2>
      <p className="text-slate-600 mb-4 leading-relaxed">
        The Self-Assessment Questionnaire (SAQ) is used by merchants and service providers to
        validate PCI DSS compliance without a full audit. Instead of engaging a Qualified Security
        Assessor (QSA) for a Report on Compliance (ROC), eligible organizations can complete the
        applicable SAQ and submit an Attestation of Compliance (AOC) to demonstrate they meet the
        required security controls.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Types of PCI SAQ</h2>
      <p className="text-slate-600 mb-4 leading-relaxed">
        The PCI Security Standards Council offers several SAQ types, each tailored to different
        payment acceptance methods and system configurations. Selecting the correct SAQ depends on
        your payment flow, how cardholder data is handled, and your system scope.
      </p>
      <ul className="text-slate-600 mb-6 space-y-3 list-disc pl-6">
        <li>
          <strong className="text-slate-800">SAQ A</strong> — For card-not-present merchants who
          outsource all cardholder data functions to validated third parties.
        </li>
        <li>
          <strong className="text-slate-800">SAQ A-EP</strong> — For ecommerce merchants whose
          website can impact the security of the cardholder data environment.
        </li>
        <li>
          <strong className="text-slate-800">SAQ B</strong> — For merchants using only imprint
          machines or standalone dial-out terminals.
        </li>
        <li>
          <strong className="text-slate-800">SAQ B-IP</strong> — For merchants using standalone
          IP-connected payment terminals.
        </li>
        <li>
          <strong className="text-slate-800">SAQ C</strong> — For merchants with payment
          applications connected to the Internet but no electronic cardholder data storage.
        </li>
        <li>
          <strong className="text-slate-800">SAQ C-VT</strong> — For merchants who manually enter
          card data via a virtual terminal on a single computer.
        </li>
        <li>
          <strong className="text-slate-800">SAQ P2PE</strong> — For merchants using validated
          point-to-point encryption (P2PE) solutions.
        </li>
        <li>
          <strong className="text-slate-800">SAQ D</strong> — For merchants who store, process, or
          transmit cardholder data, or who do not meet the criteria for other SAQ types.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
        How to Determine the Correct SAQ
      </h2>
      <p className="text-slate-600 mb-4 leading-relaxed">
        Merchants must understand their cardholder data flow, payment processing method, and system
        connectivity to select the right SAQ. Mapping how card data enters, moves through, and
        leaves your environment is essential. Incorrect SAQ selection can lead to compliance issues,
        failed validations, or unnecessary control requirements. Your acquirer or payment processor
        can provide guidance, but a structured assessment can help you confidently identify the
        applicable SAQ.
      </p>

      <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-700 mb-4 font-medium">
          Use the ComplianceAstra assessment tool to determine which PCI SAQ applies to your
          business and get plain-English guidance.
        </p>
        <Link href="/assessments/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Start PCI SAQ Assessment
          </Button>
        </Link>
      </div>

      <nav className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-3">Related resources:</p>
        <ul className="flex flex-wrap gap-4 text-sm">
          <li>
            <Link href="/pci-saq-tool" className="text-emerald-600 hover:underline">
              PCI DSS SAQ Tool
            </Link>
          </li>
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
