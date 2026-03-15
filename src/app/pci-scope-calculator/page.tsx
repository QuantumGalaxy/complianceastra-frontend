import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "PCI Scope Calculator | Determine PCI DSS Scope",
  description:
    "Understand your PCI DSS compliance scope using this simple calculator. Determine which systems fall within PCI DSS scope.",
};

export default function PCIScopeCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">PCI DSS Scope Calculator</h1>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Understanding your PCI DSS scope is the foundation of compliance. The scope defines which
        systems, networks, and people are involved in storing, processing, or transmitting
        cardholder data—and therefore must meet PCI DSS requirements.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">What Does PCI DSS Scope Mean?</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        PCI DSS scope includes all system components that are connected to the cardholder data
        environment (CDE). This typically includes servers that store or process card data, networks
        that transmit it, and any system that can access the CDE. A clear scope definition helps you
        focus security efforts where they matter most.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Why Scope Reduction Matters</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Reducing scope lowers compliance cost and complexity. By minimizing the number of systems
        that handle cardholder data—for example, through tokenization or outsourcing payment
        processing—merchants can often qualify for simpler SAQs and reduce the number of controls
        they must implement.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Examples of In-Scope Systems</h2>
      <ul className="text-slate-600 mb-6 space-y-2 list-disc pl-6">
        <li>Web servers that host checkout pages or payment forms</li>
        <li>Databases that store cardholder data (even temporarily)</li>
        <li>Point-of-sale (POS) terminals and integrated systems</li>
        <li>Networks that connect to systems processing card data</li>
        <li>Third-party service providers with access to cardholder data</li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
        Benefits of Using a Structured Scope Tool
      </h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        A structured scope assessment guides you through transaction flows and environment types,
        helping you identify what is in scope and what is not. This reduces guesswork and ensures
        you have a defensible scope definition for your acquirer or assessor.
      </p>

      <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-700 mb-4 font-medium">
          Use our guided scope assessment to map your environment and determine your PCI DSS scope.
        </p>
        <Link href="/assessments/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Start PCI Scope Assessment
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
