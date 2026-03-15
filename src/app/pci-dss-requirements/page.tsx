import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "PCI DSS Requirements Explained | 12 PCI Requirements",
  description:
    "Learn the 12 PCI DSS requirements and how businesses must secure cardholder data.",
};

export default function PCIDSSRequirementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">PCI DSS Requirements Explained</h1>

      <p className="text-slate-600 mb-6 leading-relaxed">
        The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards
        designed to ensure that all companies that store, process, or transmit credit card
        information maintain a secure environment. The standard is organized into 12 high-level
        requirements that businesses must meet to protect cardholder data.
      </p>

      <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">The 12 PCI DSS Requirements</h2>
      <ol className="text-slate-600 mb-6 space-y-4 list-decimal pl-6">
        <li>
          <strong className="text-slate-800">Build and Maintain a Secure Network</strong> — Install
          and maintain firewall configurations to protect cardholder data.
        </li>
        <li>
          <strong className="text-slate-800">Protect Cardholder Data</strong> — Do not store
          sensitive authentication data after authorization. Protect stored cardholder data through
          encryption and other means.
        </li>
        <li>
          <strong className="text-slate-800">Vulnerability Management</strong> — Protect systems
          against malware and keep security software up to date. Develop and maintain secure
          systems and applications.
        </li>
        <li>
          <strong className="text-slate-800">Access Control</strong> — Restrict access to cardholder
          data by business need-to-know. Assign a unique ID to each person with computer access.
          Restrict physical access to cardholder data.
        </li>
        <li>
          <strong className="text-slate-800">Monitoring and Testing</strong> — Track and monitor
          all access to network resources and cardholder data. Regularly test security systems and
          networks.
        </li>
        <li>
          <strong className="text-slate-800">Security Policies</strong> — Maintain a policy that
          addresses information security for all personnel.
        </li>
        <li>
          <strong className="text-slate-800">Secure Network Architecture</strong> — Implement
          network security controls such as firewalls and network segmentation.
        </li>
        <li>
          <strong className="text-slate-800">Strong Access Control Measures</strong> — Implement
          identification and authentication mechanisms for access to system components.
        </li>
        <li>
          <strong className="text-slate-800">Restrict Physical Access</strong> — Implement
          physical access controls for facilities that house systems storing cardholder data.
        </li>
        <li>
          <strong className="text-slate-800">Log and Monitor</strong> — Implement logging,
          monitoring, and alerting to detect and respond to security events.
        </li>
        <li>
          <strong className="text-slate-800">Test Security Systems</strong> — Regularly test
          security systems, networks, and applications for vulnerabilities.
        </li>
        <li>
          <strong className="text-slate-800">Information Security Policy</strong> — Maintain an
          information security policy and ensure all personnel are aware of and follow it.
        </li>
      </ol>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Each requirement contains multiple sub-requirements and testing procedures. The exact
        controls you must implement depend on your SAQ type and scope. Understanding these
        requirements helps you prioritize security efforts and prepare for validation.
      </p>

      <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-700 mb-4 font-medium">
          Find out which requirements apply to your environment with our guided assessment.
        </p>
        <Link href="/assessments/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Start Free Assessment
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
            <Link href="/assessments/new" className="text-emerald-600 hover:underline">
              Start Free Assessment
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
