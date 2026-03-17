export type SaqType = "A" | "A-EP" | "B" | "B-IP" | "C-VT" | "C" | "D_MERCHANT" | "D_SERVICE_PROVIDER";

export type ChecklistAnswer = "in_place" | "not_applicable" | "action_needed" | null;

export type ChecklistItem = {
  id: string;
  label: string;
  pciRef: string;
  type: "scope_question" | "eligibility_confirmation" | "compliance_checkpoint" | "action_item";
  helpText?: string;
};

export type ChecklistSection = {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
};

export type ChecklistDefinition = {
  saq: SaqType;
  title: string;
  estimateLabel: string;
  sections: ChecklistSection[];
};

export const CHECKLISTS: Record<SaqType, ChecklistDefinition> = {
  A: {
    saq: "A",
    title: "SAQ A – Fully outsourced ecommerce / MOTO",
    estimateLabel: "Approx. 25–40 checkpoints",
    sections: [
      {
        id: "req2",
        title: "Secure configurations",
        description: "Scope questions to confirm third-party hosted payment pages are locked down.",
        items: [
          {
            id: "a-2-1",
            label: "Have you confirmed your ecommerce platform and hosting use vendor-recommended secure configurations?",
            pciRef: "PCI Ref: SAQ A Req 2.2",
            type: "compliance_checkpoint",
          },
          {
            id: "a-2-2",
            label: "Are default passwords disabled for all admin, database, and hosting accounts?",
            pciRef: "PCI Ref: SAQ A Req 2.3",
            type: "action_item",
          },
        ],
      },
      {
        id: "req3",
        title: "Stored account data",
        description: "Confirm no card data is stored electronically.",
        items: [
          {
            id: "a-3-1",
            label: "Do you avoid storing full PAN, track data, CVV, or sensitive auth data in any system?",
            pciRef: "PCI Ref: SAQ A Req 3.2",
            type: "eligibility_confirmation",
          },
          {
            id: "a-3-2",
            label: "If you keep paper order forms, are they locked away with access tracked?",
            pciRef: "PCI Ref: SAQ A Req 3.4, 9.5",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "req6",
        title: "Secure systems and software",
        items: [
          {
            id: "a-6-1",
            label: "Are your web servers and ecommerce plugins kept up to date with security patches?",
            pciRef: "PCI Ref: SAQ A Req 6.3.1",
            type: "compliance_checkpoint",
          },
          {
            id: "a-6-2",
            label: "Do you review new plugins or integrations for security impact before enabling them?",
            pciRef: "PCI Ref: SAQ A Req 6.3.2",
            type: "action_item",
          },
        ],
      },
      {
        id: "req8",
        title: "User access and authentication",
        items: [
          {
            id: "a-8-1",
            label: "Do all admin users have their own login (no shared admin accounts)?",
            pciRef: "PCI Ref: SAQ A Req 8.2.1",
            type: "compliance_checkpoint",
          },
          {
            id: "a-8-2",
            label: "Is multi-factor authentication enabled for remote access and cloud admin consoles?",
            pciRef: "PCI Ref: SAQ A Req 8.4.2",
            type: "action_item",
          },
        ],
      },
      {
        id: "req9",
        title: "Physical access to paper records",
        items: [
          {
            id: "a-9-1",
            label: "Are any paper records with cardholder data stored in locked cabinets or rooms?",
            pciRef: "PCI Ref: SAQ A Req 9.5",
            type: "compliance_checkpoint",
          },
          {
            id: "a-9-2",
            label: "Do you have a documented process to shred or destroy paper card data when no longer needed?",
            pciRef: "PCI Ref: SAQ A Req 9.8",
            type: "action_item",
          },
        ],
      },
      {
        id: "req11",
        title: "Security testing and scans",
        items: [
          {
            id: "a-11-1",
            label: "If your website is Internet-facing, do you run regular external vulnerability scans?",
            pciRef: "PCI Ref: SAQ A Req 11.3.2",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "req12",
        title: "Policies, TPSPs, and incident response",
        items: [
          {
            id: "a-12-1",
            label: "Do you maintain an information security policy that includes how card data is handled?",
            pciRef: "PCI Ref: SAQ A Req 12.1",
            type: "action_item",
          },
          {
            id: "a-12-2",
            label: "Do you track and review PCI compliance status for all third-party service providers (TPSPs)?",
            pciRef: "PCI Ref: SAQ A Req 12.8.1",
            type: "compliance_checkpoint",
            helpText: "TPSP = Third-Party Service Provider handling payments, hosting, or security functions.",
          },
          {
            id: "a-12-3",
            label: "Do you have a simple plan for what to do if you suspect card data has been compromised?",
            pciRef: "PCI Ref: SAQ A Req 12.10.1",
            type: "action_item",
          },
        ],
      },
    ],
  },
  "A-EP": {
    saq: "A-EP",
    title: "SAQ A-EP – Ecommerce with merchant web server in scope",
    estimateLabel: "Approx. 45–70 checkpoints",
    sections: [
      {
        id: "aep-1",
        title: "Network security and segmentation",
        items: [
          {
            id: "aep-1-1",
            label: "Is the web server that hosts the payment page separated from your internal network by a firewall?",
            pciRef: "PCI Ref: SAQ A-EP Req 1.2.1",
            type: "scope_question",
          },
        ],
      },
      {
        id: "aep-2",
        title: "Secure configurations",
        items: [
          {
            id: "aep-2-1",
            label: "Do you have a hardened build standard for your ecommerce web servers?",
            pciRef: "PCI Ref: SAQ A-EP Req 2.2",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "aep-3-12",
        title: "Remaining PCI requirements",
        description:
          "High-level confirmation that PCI controls are being addressed across requirements 3–12 for the ecommerce environment.",
        items: [
          {
            id: "aep-3-1",
            label: "Have you confirmed no sensitive authentication data is stored after authorization?",
            pciRef: "PCI Ref: SAQ A-EP Req 3.2",
            type: "eligibility_confirmation",
          },
          {
            id: "aep-5-1",
            label: "Do Internet-facing web servers have anti-malware controls where applicable?",
            pciRef: "PCI Ref: SAQ A-EP Req 5.2",
            type: "compliance_checkpoint",
          },
          {
            id: "aep-11-1",
            label: "Are you performing web-layer security testing or scans at least annually and after major changes?",
            pciRef: "PCI Ref: SAQ A-EP Req 11.3.1",
            type: "action_item",
          },
        ],
      },
    ],
  },
  "C-VT": {
    saq: "C-VT",
    title: "SAQ C-VT – Virtual terminal on single workstation",
    estimateLabel: "Approx. 30–45 checkpoints",
    sections: [
      {
        id: "cvt-1",
        title: "Network and device setup",
        items: [
          {
            id: "cvt-1-1",
            label: "Is the virtual-terminal workstation isolated from other business systems where possible?",
            pciRef: "PCI Ref: SAQ C-VT Req 1.3",
            type: "scope_question",
          },
          {
            id: "cvt-1-2",
            label: "Is only one transaction entered at a time into the virtual terminal?",
            pciRef: "PCI Ref: SAQ C-VT Eligibility",
            type: "eligibility_confirmation",
          },
        ],
      },
      {
        id: "cvt-2-3-4-5-6-7-8-9-12",
        title: "Core PCI controls",
        description: "Condensed checkpoints covering the key PCI requirements for C-VT environments.",
        items: [
          {
            id: "cvt-2-1",
            label: "Is the virtual-terminal workstation kept up to date with security patches and anti-malware?",
            pciRef: "PCI Ref: SAQ C-VT Req 2, 5, 6",
            type: "compliance_checkpoint",
          },
          {
            id: "cvt-3-1",
            label: "Do you avoid storing full card numbers or security codes anywhere on the workstation?",
            pciRef: "PCI Ref: SAQ C-VT Req 3.2",
            type: "eligibility_confirmation",
          },
          {
            id: "cvt-8-1",
            label: "Does each staff member using the virtual terminal have a unique login?",
            pciRef: "PCI Ref: SAQ C-VT Req 7–8",
            type: "compliance_checkpoint",
          },
          {
            id: "cvt-12-1",
            label: "Is there a written, simple procedure describing how to handle cardholder data for phone orders?",
            pciRef: "PCI Ref: SAQ C-VT Req 12",
            type: "action_item",
          },
        ],
      },
    ],
  },
  C: {
    saq: "C",
    title: "SAQ C – Payment application or IP-connected terminals",
    estimateLabel: "Approx. 45–70 checkpoints",
    sections: [
      {
        id: "c-1-2",
        title: "Network and device protection",
        items: [
          {
            id: "c-1-1",
            label: "Is there a firewall or router protecting the payment network from the Internet?",
            pciRef: "PCI Ref: SAQ C Req 1.2.1",
            type: "scope_question",
          },
          {
            id: "c-2-1",
            label: "Are payment application servers and terminals built from a hardened configuration standard?",
            pciRef: "PCI Ref: SAQ C Req 2.2",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "c-3-12",
        title: "Core PCI controls and Appendix A2 placeholder",
        description:
          "High-level checkpoints for protecting stored data, managing access, and running testing. Includes a placeholder for any SSL/early-TLS specific items (Appendix A2).",
        items: [
          {
            id: "c-3-1",
            label: "Is any stored PAN rendered unreadable (for example, via truncation, hashing, or encryption)?",
            pciRef: "PCI Ref: SAQ C Req 3.4",
            type: "compliance_checkpoint",
          },
          {
            id: "c-a2-1",
            label: "If you still use older SSL/TLS for payment traffic, have you reviewed Appendix A2 requirements?",
            pciRef: "PCI Ref: SAQ C Appendix A2",
            type: "action_item",
          },
        ],
      },
    ],
  },
  B: {
    saq: "B",
    title: "SAQ B – Imprint machines and dial-out terminals",
    estimateLabel: "Approx. 15–25 checkpoints",
    sections: [
      {
        id: "b-3",
        title: "Stored account data",
        items: [
          {
            id: "b-3-1",
            label: "Are paper imprints stored securely and destroyed when no longer needed?",
            pciRef: "PCI Ref: SAQ B Req 3.2, 9.8",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "b-7-9-12",
        title: "Access control, physical security, and policies",
        items: [
          {
            id: "b-7-1",
            label: "Are staff handling card imprints trained on how to protect cardholder data?",
            pciRef: "PCI Ref: SAQ B Req 7, 12.6",
            type: "action_item",
          },
          {
            id: "b-9-1",
            label: "Are terminals and paper records kept where only authorized staff can access them?",
            pciRef: "PCI Ref: SAQ B Req 9.1",
            type: "compliance_checkpoint",
          },
        ],
      },
    ],
  },
  "B-IP": {
    saq: "B-IP",
    title: "SAQ B-IP – Standalone IP-connected PTS-approved devices",
    estimateLabel: "Approx. 25–40 checkpoints",
    sections: [
      {
        id: "bip-1-2",
        title: "Network and device hardening",
        items: [
          {
            id: "bip-1-1",
            label: "Are IP-connected terminals segmented from the rest of your network where possible?",
            pciRef: "PCI Ref: SAQ B-IP Req 1.3",
            type: "scope_question",
          },
          {
            id: "bip-2-1",
            label: "Are vendor default passwords changed on all payment devices and routers?",
            pciRef: "PCI Ref: SAQ B-IP Req 2.1",
            type: "compliance_checkpoint",
          },
        ],
      },
      {
        id: "bip-3-4-6-7-8-9-11-12",
        title: "Core controls and Appendix A2 placeholder",
        description:
          "Condensed checkpoints across requirements 3–4, 6–9, 11–12, plus a placeholder for Appendix A2 if applicable.",
        items: [
          {
            id: "bip-3-1",
            label: "Do you avoid storing card numbers on any system connected to these devices?",
            pciRef: "PCI Ref: SAQ B-IP Req 3.2",
            type: "eligibility_confirmation",
          },
          {
            id: "bip-11-1",
            label: "Are external vulnerability scans performed on IP ranges where the terminals reside?",
            pciRef: "PCI Ref: SAQ B-IP Req 11.3.2",
            type: "compliance_checkpoint",
          },
          {
            id: "bip-a2-1",
            label: "If older SSL/TLS is in use, have Appendix A2 requirements been reviewed?",
            pciRef: "PCI Ref: SAQ B-IP Appendix A2",
            type: "action_item",
          },
        ],
      },
    ],
  },
  D_MERCHANT: {
    saq: "D_MERCHANT",
    title: "SAQ D – Merchants",
    estimateLabel: "Varies – typically 100+ checkpoints",
    sections: [
      {
        id: "d-1-12",
        title: "Full SAQ D coverage",
        description:
          "This checklist represents a starting point. SAQ D covers all PCI DSS requirements, so expect to expand this list using your official SAQ D document.",
        items: [
          {
            id: "d-1-1",
            label: "Have you completed or planned a detailed network and data-flow diagram for all cardholder data flows?",
            pciRef: "PCI Ref: SAQ D Req 1.1.2, 1.1.3",
            type: "scope_question",
          },
          {
            id: "d-6-1",
            label: "Do you have a secure software development life cycle (SDLC) that includes security testing?",
            pciRef: "PCI Ref: SAQ D Req 6.1.1",
            type: "action_item",
          },
          {
            id: "d-12-1",
            label: "Is there an assigned PCI owner or coordinator responsible for tracking progress against the full SAQ D?",
            pciRef: "PCI Ref: SAQ D Req 12.4",
            type: "compliance_checkpoint",
          },
        ],
      },
    ],
  },
  D_SERVICE_PROVIDER: {
    saq: "D_SERVICE_PROVIDER",
    title: "SAQ D – Service Providers",
    estimateLabel: "Varies – typically 100+ checkpoints",
    sections: [
      {
        id: "dsp-1-12",
        title: "Service provider responsibilities",
        description:
          "Service providers use SAQ D for Service Providers. This list is a high-level starting point and should be extended using the official SAQ.",
        items: [
          {
            id: "dsp-1-1",
            label: "Have you documented which PCI DSS requirements you manage versus your customers and other TPSPs?",
            pciRef: "PCI Ref: SAQ D SP Req 12.8, 12.9",
            type: "scope_question",
          },
          {
            id: "dsp-3-1",
            label: "Do you have a formal data-retention schedule for all cardholder data you store or process?",
            pciRef: "PCI Ref: SAQ D SP Req 3.1",
            type: "action_item",
          },
        ],
      },
    ],
  },
};

