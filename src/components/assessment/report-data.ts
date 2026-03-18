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

export type ActionCard = {
  title: string;
  description: string;
  whyItMatters: string;
  priority: "High" | "Medium";
};

export const ACTION_CARDS_BY_SAQ: Record<SaqType, ActionCard[]> = {
  A: [
    { title: "Confirm third-party payment pages use vendor secure configurations", description: "Verify your payment provider's hosted pages meet PCI requirements.", whyItMatters: "Required to maintain reduced scope under SAQ A.", priority: "High" },
    { title: "Disable default passwords on all admin and hosting accounts", description: "Remove or change any default credentials.", whyItMatters: "Prevents unauthorized access to systems that could impact payment flows.", priority: "High" },
    { title: "Keep web servers and plugins patched; review new integrations", description: "Apply security updates and assess new plugins before enabling.", whyItMatters: "Reduces risk of compromise affecting your ecommerce environment.", priority: "Medium" },
    { title: "Ensure unique logins and MFA for remote/admin access", description: "No shared accounts; MFA where applicable.", whyItMatters: "Strengthens access control for systems in scope.", priority: "Medium" },
    { title: "Document security policy and TPSP compliance; incident response plan", description: "Written policy and TPSP tracking; simple incident process.", whyItMatters: "Required for PCI and demonstrates due diligence.", priority: "Medium" },
  ],
  "A-EP": [
    { title: "Define and maintain a network diagram for the ecommerce environment", description: "Document systems and data flows that touch the payment page.", whyItMatters: "Foundation for scope and security design.", priority: "High" },
    { title: "Harden ecommerce web servers; ensure no sensitive auth data stored", description: "Secure configs and no storage of full track/CVV after authorization.", whyItMatters: "Core to reducing exposure of cardholder data.", priority: "High" },
    { title: "Implement anti-malware and security testing for web layer", description: "Protect and test the systems that deliver or affect the payment page.", whyItMatters: "Detects and prevents compromise.", priority: "Medium" },
    { title: "Enforce access controls and MFA; maintain security policies", description: "Unique IDs, MFA, and documented policies.", whyItMatters: "Required for PCI and operational security.", priority: "Medium" },
    { title: "Run vulnerability scans and address findings", description: "Regular scans and remediation of critical/high issues.", whyItMatters: "Validates security posture over time.", priority: "Medium" },
  ],
  B: [
    { title: "Store and destroy paper imprints securely", description: "Locked storage and secure destruction when no longer needed.", whyItMatters: "Protects cardholder data on paper.", priority: "High" },
    { title: "Train staff on protecting cardholder data", description: "Simple training on handling imprints and receipts.", whyItMatters: "Human factor in preventing misuse.", priority: "High" },
    { title: "Restrict physical access to terminals and paper records", description: "Only authorized staff can access devices and records.", whyItMatters: "Limits exposure of card data.", priority: "Medium" },
    { title: "Maintain a simple security policy for card handling", description: "Document how you protect cardholder data.", whyItMatters: "Required for PCI and consistency.", priority: "Medium" },
    { title: "Review and update procedures annually", description: "Revisit policy and procedures at least once a year.", whyItMatters: "Keeps controls current.", priority: "Medium" },
  ],
  "B-IP": [
    { title: "Segment IP-connected terminals from other networks where possible", description: "Isolate payment devices from general business networks.", whyItMatters: "Reduces scope and attack surface.", priority: "High" },
    { title: "Change vendor default passwords on devices and routers", description: "No default credentials on any device in scope.", whyItMatters: "Prevents trivial unauthorized access.", priority: "High" },
    { title: "Avoid storing card data on any system connected to terminals", description: "No electronic storage of PAN/CVV on connected systems.", whyItMatters: "Keeps scope limited to terminals.", priority: "Medium" },
    { title: "Run external vulnerability scans on relevant IP ranges", description: "Quarterly scans and remediation.", whyItMatters: "Validates network security.", priority: "Medium" },
    { title: "Review Appendix A2 if using older SSL/TLS", description: "Address legacy crypto if still in use.", whyItMatters: "Closes crypto-related risk.", priority: "Medium" },
  ],
  "C-VT": [
    { title: "Keep the virtual-terminal workstation isolated and patched", description: "Dedicated device, up-to-date OS and anti-malware.", whyItMatters: "Reduces risk of compromise.", priority: "High" },
    { title: "Ensure only one transaction at a time; no card data stored", description: "Single transaction entry; no batch or storage on the workstation.", whyItMatters: "Core C-VT eligibility requirement.", priority: "High" },
    { title: "Use unique logins for each user of the virtual terminal", description: "No shared accounts.", whyItMatters: "Accountability and access control.", priority: "Medium" },
    { title: "Document procedures for handling cardholder data for phone orders", description: "Written process for staff.", whyItMatters: "Required for PCI and consistency.", priority: "Medium" },
    { title: "Maintain anti-malware and security policies", description: "Protect the workstation and document policies.", whyItMatters: "Ongoing security baseline.", priority: "Medium" },
  ],
  C: [
    { title: "Deploy firewall/router to protect the payment network", description: "Segment and protect the payment environment.", whyItMatters: "Foundation for network security.", priority: "High" },
    { title: "Harden payment application servers and terminals", description: "Secure configuration and patching.", whyItMatters: "Reduces vulnerability exposure.", priority: "High" },
    { title: "Render any stored PAN unreadable", description: "Truncation, hashing, or encryption for stored PAN.", whyItMatters: "Protects stored cardholder data.", priority: "Medium" },
    { title: "Review Appendix A2 if applicable", description: "Address legacy SSL/TLS if in use.", whyItMatters: "Closes crypto-related risk.", priority: "Medium" },
    { title: "Maintain access controls, logging, and security policies", description: "Access control, audit trails, and documentation.", whyItMatters: "Required for PCI and operations.", priority: "Medium" },
  ],
  D_MERCHANT: [
    { title: "Define network and data-flow diagrams for all cardholder data", description: "Document in-scope systems and data flows.", whyItMatters: "Foundation for full SAQ D scope.", priority: "High" },
    { title: "Implement secure SDLC with security testing", description: "Secure development and testing for in-scope software.", whyItMatters: "Reduces risk from custom code.", priority: "High" },
    { title: "Assign a PCI owner/coordinator and document scope", description: "Clear ownership and scope documentation.", whyItMatters: "Required for PCI and program management.", priority: "Medium" },
    { title: "Implement logging, monitoring, and access controls", description: "Audit trails, monitoring, and access management.", whyItMatters: "Detection and access control.", priority: "Medium" },
    { title: "Conduct vulnerability scans and penetration testing", description: "Regular scans and annual penetration test where required.", whyItMatters: "Validates security posture.", priority: "Medium" },
  ],
  D_SERVICE_PROVIDER: [
    { title: "Document which PCI requirements you manage vs. customers and TPSPs", description: "Clear responsibility matrix.", whyItMatters: "Defines your compliance scope.", priority: "High" },
    { title: "Establish a formal data-retention schedule for cardholder data", description: "Define and enforce retention and disposal.", whyItMatters: "Required for PCI and risk reduction.", priority: "High" },
    { title: "Implement full PCI DSS controls for in-scope systems", description: "All applicable requirements for your services.", whyItMatters: "Core service provider obligation.", priority: "Medium" },
    { title: "Maintain evidence of compliance for customers", description: "Documentation and attestations for clients.", whyItMatters: "Supports customer compliance.", priority: "Medium" },
    { title: "Conduct required testing and assessments", description: "Scans, testing, and assessments as required.", whyItMatters: "Validates compliance.", priority: "Medium" },
  ],
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
