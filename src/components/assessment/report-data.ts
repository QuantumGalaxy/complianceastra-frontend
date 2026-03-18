import type { SaqType } from "./checklist-data";

export const SAQ_LABELS: Record<SaqType, string> = {
  A: "SAQ A",
  "A-EP": "SAQ A-EP",
  B: "SAQ B",
  "B-IP": "SAQ B-IP",
  "C-VT": "SAQ C-VT",
  C: "SAQ C",
  D_MERCHANT: "SAQ D (Merchant)",
  D_SERVICE_PROVIDER: "SAQ D (Service Provider)",
};

export type RiskLevel = "Low" | "Medium" | "High";

export const SAQ_RISK_LEVEL: Record<SaqType, RiskLevel> = {
  A: "Low",
  "A-EP": "Medium",
  B: "Low",
  "B-IP": "Medium",
  "C-VT": "Low",
  C: "Medium",
  D_MERCHANT: "High",
  D_SERVICE_PROVIDER: "High",
};

export const TOP_ACTIONS_BY_SAQ: Record<SaqType, string[]> = {
  A: [
    "Confirm third-party payment pages use vendor secure configurations",
    "Disable default passwords on all admin and hosting accounts",
    "Keep web servers and plugins patched; review new integrations before enabling",
    "Ensure unique logins and MFA for remote/admin access",
    "Document security policy and TPSP compliance; have an incident response plan",
  ],
  "A-EP": [
    "Define and maintain a network diagram for the ecommerce environment",
    "Harden ecommerce web servers; ensure no sensitive auth data is stored after authorization",
    "Implement anti-malware and security testing for web layer",
    "Enforce access controls and MFA; maintain security policies",
    "Run vulnerability scans and address findings",
  ],
  B: [
    "Store and destroy paper imprints securely",
    "Train staff on protecting cardholder data",
    "Restrict physical access to terminals and paper records",
    "Maintain a simple security policy for card handling",
    "Review and update procedures annually",
  ],
  "B-IP": [
    "Segment IP-connected terminals from other networks where possible",
    "Change vendor default passwords on devices and routers",
    "Avoid storing card data on any system connected to terminals",
    "Run external vulnerability scans on relevant IP ranges",
    "Review Appendix A2 if using older SSL/TLS",
  ],
  "C-VT": [
    "Keep the virtual-terminal workstation isolated and patched",
    "Ensure only one transaction at a time; no card data stored on the workstation",
    "Use unique logins for each user of the virtual terminal",
    "Document procedures for handling cardholder data for phone orders",
    "Maintain anti-malware and security policies",
  ],
  C: [
    "Deploy firewall/router to protect the payment network",
    "Harden payment application servers and terminals",
    "Render any stored PAN unreadable (truncation, hashing, or encryption)",
    "Review Appendix A2 if applicable",
    "Maintain access controls, logging, and security policies",
  ],
  D_MERCHANT: [
    "Define network and data-flow diagrams for all cardholder data",
    "Implement secure SDLC with security testing",
    "Assign a PCI owner/coordinator and document scope",
    "Implement logging, monitoring, and access controls",
    "Conduct vulnerability scans and penetration testing as required",
  ],
  D_SERVICE_PROVIDER: [
    "Document which PCI requirements you manage vs. customers and TPSPs",
    "Establish a formal data-retention schedule for cardholder data",
    "Implement full PCI DSS controls for in-scope systems",
    "Maintain evidence of compliance for customers",
    "Conduct required testing and assessments",
  ],
};
