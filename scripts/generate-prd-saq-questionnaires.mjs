/**
 * One-off generator for merchant-friendly PRD SAQ JSON (PCI DSS v4.0.1 traceability).
 * Run: node scripts/generate-prd-saq-questionnaires.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");

const OPTS = ["In Place", "Action Needed", "Not Applicable"];

function q(id, question, help_text, maps, order) {
  return {
    id,
    question,
    help_text,
    maps_to_requirements: maps,
    response_type: "compliance",
    requirement_raw: "",
    options: OPTS,
    display_order: order,
  };
}

const TOPICS = [
  {
    section_id: "network_security",
    section_title: "Network Security",
    description: "Define and protect network boundaries for systems that handle or route payment activity.",
    category: "network_security",
  },
  {
    section_id: "secure_configurations",
    section_title: "Secure Configurations",
    description: "Harden systems and software against unsafe defaults and misconfiguration.",
    category: "secure_configuration",
  },
  {
    section_id: "protect_cardholder_data",
    section_title: "Protect Cardholder Data",
    description: "Collect, store, and dispose of card data only as your business truly needs.",
    category: "data_protection",
  },
  {
    section_id: "encryption_transmission",
    section_title: "Encryption & Transmission Security",
    description: "Protect card data in motion across networks and manage keys responsibly.",
    category: "encryption",
  },
  {
    section_id: "malware_protection",
    section_title: "Malware Protection",
    description: "Prevent, detect, and respond to malicious software on in-scope systems.",
    category: "malware",
  },
  {
    section_id: "secure_development_patching",
    section_title: "Secure Development & Patching",
    description: "Control code and configuration changes and keep components patched.",
    category: "development",
  },
  {
    section_id: "access_control",
    section_title: "Access Control",
    description: "Grant access to systems and data on a need-to-know basis.",
    category: "access",
  },
  {
    section_id: "user_authentication",
    section_title: "User Authentication",
    description: "Verify users and administrators before granting access.",
    category: "authentication",
  },
  {
    section_id: "physical_security",
    section_title: "Physical Security",
    description: "Protect devices and facilities that can reach cardholder environments.",
    category: "physical",
  },
  {
    section_id: "logging_monitoring",
    section_title: "Logging & Monitoring",
    description: "Keep useful audit trails and review them for suspicious activity.",
    category: "logging",
  },
  {
    section_id: "vulnerability_management",
    section_title: "Vulnerability Management & Scanning",
    description: "Find and fix weaknesses in systems and applications in scope.",
    category: "vulnerability",
  },
  {
    section_id: "security_policies",
    section_title: "Security Policies & Risk Management",
    description: "Document expectations, vendors, incidents, and ongoing risk awareness.",
    category: "policies",
  },
];

function buildFile(saqType, sections) {
  return {
    saq_type: saqType,
    version: "PCI DSS v4.0.1",
    sections: sections.map((s, i) => ({
      section_id: s.section_id,
      section_order: i + 1,
      section_title: s.section_title,
      description: s.description,
      category: s.category,
      questions: s.questions.map((item, j) => ({ ...item, display_order: j + 1 })),
    })),
  };
}

// --- SAQ B (~18): standalone dial-up / terminal, no CHD storage ---
const saqB = buildFile("SAQ B", [
  {
    ...TOPICS[0],
    questions: [
      q(
        "nsc_documented",
        "Are network security controls (such as firewalls or routers) documented and in place between your payment environment and the internet?",
        "Applies to IP-connected terminals; dial-only setups may differ—answer for what you actually use.",
        ["1.1.1", "1.2.1"],
        1,
      ),
      q(
        "nsc_rules_reviewed",
        "Are rules for allowed traffic reviewed at least when the network changes or at least annually?",
        "Keeps only necessary connections active.",
        ["1.2.7", "1.2.8"],
        2,
      ),
      q(
        "mgmt_interfaces_protected",
        "Are administrative interfaces for routers, firewalls, or terminals protected from open internet access (VPN, jump host, or local only)?",
        "Reduces remote takeover risk.",
        ["1.2.2", "8.4.2"],
        3,
      ),
    ],
  },
  {
    ...TOPICS[1],
    questions: [
      q(
        "config_standards",
        "Do you follow written configuration standards for terminals and any in-scope network devices?",
        "Include removing defaults and unnecessary services.",
        ["2.2.1", "2.2.2"],
        1,
      ),
      q(
        "terminal_inventory",
        "Do you keep an up-to-date list of payment terminals and which sites or registers they belong to?",
        "Helps with replacements and audits.",
        ["2.4.1", "9.5.1"],
        2,
      ),
    ],
  },
  {
    ...TOPICS[2],
    questions: [
      q(
        "no_pan_storage",
        "Do you avoid storing full card numbers, magnetic stripe, or CVV on your systems after authorization?",
        "SAQ B assumes you do not store cardholder data electronically.",
        ["3.3.1", "3.3.2"],
        1,
      ),
      q(
        "paper_media",
        "If paper receipts exist, are they handled and destroyed in a way that limits exposure of full card numbers?",
        "Truncation or secure disposal is typical.",
        ["3.2.1", "9.5.1"],
        2,
      ),
    ],
  },
  {
    ...TOPICS[3],
    questions: [
      q(
        "encryption_transit",
        "Is cardholder data encrypted with strong cryptography when sent over open or public networks?",
        "Often validated through your processor’s terminal program.",
        ["4.1", "4.2.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[4],
    questions: [
      q(
        "malware_on_systems",
        "Are PCs or servers that manage terminals or settlement protected against malware where applicable?",
        "Choose Not Applicable if no such systems exist.",
        ["5.2.1", "5.3.2"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[5],
    questions: [
      q(
        "change_control",
        "Are changes to payment terminals or network gear approved and tracked?",
        "Even a simple ticket or sign-off process counts.",
        ["6.5.1", "6.3.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[6],
    questions: [
      q(
        "access_limited",
        "Is access to terminal settings and back-office tools limited to people who need it?",
        "Includes vendor remote access if used.",
        ["7.1", "7.2.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[7],
    questions: [
      q(
        "unique_accounts",
        "Does each person use their own login for systems that can change payment settings?",
        "No shared passwords for admin tasks.",
        ["8.2.1", "8.3.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[8],
    questions: [
      q(
        "device_physical",
        "Are terminals and any in-scope devices protected from tampering or theft (for example, secured counters or cables)?",
        "Basic physical care for payment devices.",
        ["9.2.1", "9.4.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[9],
    questions: [
      q(
        "audit_logs",
        "Do you capture audit logs for access to payment systems where logging is available, and protect logs from tampering?",
        "May be limited on some terminals—answer for systems you control.",
        ["10.2.1", "10.5.1"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[10],
    questions: [
      q(
        "vuln_process",
        "Do you patch or replace software on systems you manage that could affect payment security?",
        "Includes back-office machines touching settlement.",
        ["11.3.1", "6.3.3"],
        1,
      ),
    ],
  },
  {
    ...TOPICS[11],
    questions: [
      q(
        "policy_security",
        "Do you maintain a security policy covering payment devices and related responsibilities?",
        "Short and current is fine.",
        ["12.1", "12.2"],
        1,
      ),
      q(
        "service_providers",
        "Do you track processors and vendors that support your payment terminals and review their PCI status as needed?",
        "Keep agreements or attestations on file.",
        ["12.8.1", "12.8.2"],
        2,
      ),
      q(
        "staff_awareness",
        "Do employees who handle terminals or payment issues get basic security awareness training yearly?",
        "Phishing and safe handling of cardholder information.",
        ["12.6.1", "12.6.2"],
        3,
      ),
    ],
  },
]);

// --- SAQ B-IP (~30): B + IP connectivity ---
const saqBIpExtra = [
  q(
    "segmentation_clarity",
    "Have you defined which networks and devices are in scope for PCI versus general business use?",
    "Helps auditors understand your card data paths.",
    ["1.1.2", "1.3.1"],
    1,
  ),
  q(
    "inbound_outbound_restricted",
    "Are inbound and outbound connections restricted to what your payment application needs?",
    "Default deny is the goal.",
    ["1.2.1", "1.3.2"],
    2,
  ),
  q(
    "wireless_if_used",
    "If wireless is used in or near the payment path, is it secured and separated appropriately?",
    "Not Applicable if no wireless touches payment traffic.",
    ["1.5.1", "2.2.2"],
    3,
  ),
  q(
    "ids_ips_considered",
    "Do you monitor or detect suspicious network activity where feasible (IDS/IPS or equivalent)?",
    "Scale to your size; document what you use.",
    ["11.4.1"],
    4,
  ),
  q(
    "pen_test_or_asv",
    "Do you run external vulnerability scans or penetration tests for internet-facing payment systems as required?",
    "Coordinate with your acquirer or ASV program.",
    ["11.3.1", "11.3.2"],
    5,
  ),
  q(
    "key_mgmt",
    "If you manage encryption keys for payment traffic, are they stored and rotated using approved practices?",
    "Often handled by your processor—Not Applicable if you never touch keys.",
    ["4.2.2", "3.6.1"],
    6,
  ),
  q(
    "secure_remote_support",
    "Is remote access for vendors or admins into payment systems authenticated strongly and time-limited?",
    "Unique credentials per vendor rep; disable when not needed.",
    ["8.4.2", "8.5.1"],
    7,
  ),
  q(
    "incident_response",
    "Do you have a simple incident response plan if terminals or networks are suspected compromised?",
    "Who to call and what to preserve.",
    ["12.10.1"],
    8,
  ),
  q(
    "dns_email_protection",
    "Are DNS and email for in-scope staff protected against phishing and malware delivery where feasible?",
    "DMARC/SPF and safe DNS resolvers reduce compromise risk.",
    ["5.4.1", "12.6.1"],
    9,
  ),
  q(
    "backup_integrity",
    "Are backups of settlement or terminal configuration data encrypted or otherwise protected from unauthorized access?",
    "Applies if you back up payment-related systems.",
    ["3.5.1", "9.5.1"],
    10,
  ),
  q(
    "api_to_processor",
    "Are APIs or file transfers to your processor authenticated and encrypted end-to-end?",
    "No clear-text credentials in batch uploads.",
    ["4.1", "4.2.1"],
    11,
  ),
];

const saqBIpSections = structuredClone(saqB.sections);
// Merge extras into sections (target ~30 questions total)
saqBIpSections[0].questions.push(...saqBIpExtra.slice(0, 3));
saqBIpSections[1].questions.push(saqBIpExtra[9]);
saqBIpSections[3].questions.push(saqBIpExtra[5], saqBIpExtra[11]);
saqBIpSections[4].questions.push(saqBIpExtra[10]);
saqBIpSections[6].questions.push(saqBIpExtra[6]);
saqBIpSections[9].questions.push(saqBIpExtra[4]);
saqBIpSections[10].questions.push(saqBIpExtra[3], saqBIpExtra[7]);
saqBIpSections[11].questions.push(saqBIpExtra[8]);
const saqBIp = buildFile("SAQ B-IP", saqBIpSections.map((s) => ({ ...s, questions: s.questions.map((it, idx) => ({ ...it, display_order: idx + 1 })) })));

// --- SAQ C-VT (~25): virtual terminal ---
const saqCVt = buildFile("SAQ C-VT", [
  {
    ...TOPICS[0],
    questions: [
      q("vt_network_controls", "Are network controls in place for systems used to enter card data into a virtual terminal?", "Usually the PC and browser used for VT access.", ["1.2.1", "1.3.1"], 1),
      q("vt_split_tunnel", "If staff work remotely, is VPN or equivalent used so payment activity does not bypass your security controls?", "Reduces card data exposure on home networks.", ["1.4.1", "8.4.2"], 2),
      q("vt_dns_firewall", "Are basic host firewall and DNS filtering enabled on VT workstations to block known-bad sites?", "Defense in depth for browser-based attacks.", ["1.2.1", "5.2.1"], 3),
    ],
  },
  {
    ...TOPICS[1],
    questions: [
      q("vt_hardening", "Are virtual-terminal workstations hardened (no extra admin rights, current patches, secure browser)?", "Treat the VT workstation as sensitive.", ["2.2.1", "2.2.2"], 1),
      q("vt_usb_restricted", "Are USB ports or removable media restricted where they could be used to exfiltrate card data?", "Group policy or endpoint tool.", ["2.2.4", "9.5.1"], 2),
    ],
  },
  {
    ...TOPICS[2],
    questions: [
      q("vt_no_local_storage", "Do you prevent saving full PAN to local drives, email, or chat from the VT session?", "Copy-paste and screenshots are common risks.", ["3.3.1", "3.3.2"], 1),
      q("vt_masking", "Are card numbers masked or truncated when displayed after entry where the application allows?", "Reduces shoulder surfing and data leaks.", ["3.3.3", "3.4.1"], 2),
    ],
  },
  {
    ...TOPICS[3],
    questions: [
      q("vt_tls", "Is the virtual terminal session protected with strong TLS end-to-end?", "Check for valid certificates and HTTPS-only.", ["4.1", "4.2.1"], 1),
      q("vt_no_public_wifi", "Do you prohibit entering cards over untrusted public Wi-Fi without VPN?", "Coffee-shop Wi-Fi is high risk.", ["4.1", "8.4.2"], 2),
    ],
  },
  {
    ...TOPICS[4],
    questions: [
      q("vt_antimalware", "Is anti-malware active on systems used for virtual terminal access?", "Required where AV is not prohibited by PCI guidance for the OS.", ["5.2.1", "5.3.2"], 1),
      q("vt_browser_hardened", "Is the browser limited to approved extensions and kept updated for VT users?", "Reduces drive-by compromise.", ["5.2.1", "6.3.3"], 2),
    ],
  },
  {
    ...TOPICS[5],
    questions: [
      q("vt_change_control", "Are changes to VT software, browsers, or plugins reviewed before rollout?", "Keeps payment entry stable and safe.", ["6.5.1", "6.3.3"], 1),
    ],
  },
  {
    ...TOPICS[6],
    questions: [
      q("vt_access_limited", "Is VT access limited to named users who need it for their job?", "Disable accounts when roles change.", ["7.1", "7.2.1"], 1),
      q("vt_session_timeout", "Do VT sessions lock or time out when idle?", "Reduces unattended access.", ["7.2.2", "8.2.8"], 2),
    ],
  },
  {
    ...TOPICS[7],
    questions: [
      q("vt_mfa", "Do you require multi-factor authentication for remote access into environments where VT is used?", "Especially for VPN into the office.", ["8.4.2", "8.5.1"], 1),
      q("vt_password_policy", "Are passwords or passphrases strong and not reused across personal sites?", "Consider a password manager for staff.", ["8.3.1", "8.3.6"], 2),
    ],
  },
  {
    ...TOPICS[8],
    questions: [
      q("vt_clean_desk", "Are screens positioned to reduce shoulder surfing and are devices locked when unattended?", "Physical and visual privacy for card entry.", ["9.2.1", "9.3.2"], 1),
      q("vt_device_return", "When VT hardware is retired, is storage wiped or destroyed before reuse or disposal?", "Follow vendor guidance for the device type.", ["9.5.1", "10.5.1"], 2),
    ],
  },
  {
    ...TOPICS[9],
    questions: [
      q("vt_logging", "Do you retain logs that show who accessed the VT and when, where the platform supports it?", "May combine platform logs with VPN logs.", ["10.2.1", "10.3.1"], 1),
      q("vt_log_review", "Are security logs reviewed periodically for failed logins or odd access patterns?", "Monthly or automated alerts are common.", ["10.4.1", "10.4.2"], 2),
    ],
  },
  {
    ...TOPICS[10],
    questions: [
      q("vt_patching", "Are OS and browser patches applied promptly on VT workstations?", "Critical for malware resistance.", ["6.3.3", "11.3.1"], 1),
      q("vt_vuln_ack", "Are critical vulnerabilities from vendor advisories tracked to closure for VT software?", "Ticket or risk register entry.", ["11.3.1", "6.3.3"], 2),
    ],
  },
  {
    ...TOPICS[11],
    questions: [
      q("vt_policy", "Do you document who may use the VT and acceptable-use rules for card entry?", "Include prohibition on writing down full PAN.", ["12.1", "12.6.1"], 1),
      q("vt_training", "Do VT users receive training on phishing and safe handling of cardholder data?", "Short annual refreshers work.", ["12.6.2", "12.6.3"], 2),
      q("vt_vendor", "Is your VT provider listed and their PCI responsibilities understood?", "Know who patches the hosted VT.", ["12.8.1", "12.8.4"], 3),
    ],
  },
]);

// --- SAQ D Merchant (~20) & Service Provider (~25): condensed merchant vs SP emphasis ---
function saqDMerchant() {
  return buildFile("SAQ D - Merchant", [
    { ...TOPICS[0], questions: [
      q("d_ns_inventory", "Do you maintain an inventory of hardware and software in scope for PCI?", "Foundation for everything else.", ["1.1.1", "2.4.1"], 1),
      q("d_firewall_config", "Are firewalls and routers configured to deny traffic by default and allow only what you need?", "Document rules and owners.", ["1.2.1", "1.3.1"], 2),
    ]},
    { ...TOPICS[1], questions: [
      q("d_secure_baseline", "Do you apply a secure baseline to servers and endpoints in scope?", "CIS-style benchmarks or vendor guides.", ["2.2.1", "2.2.2"], 1),
    ]},
    { ...TOPICS[2], questions: [
      q("d_data_minimization", "Do you limit stored card data to what you truly need and delete the rest on schedule?", "Retention policy with owners.", ["3.2.1", "3.3.1"], 1),
      q("d_key_mgmt", "If you store PAN, are keys and cryptograms managed in HSM or equivalent approved ways?", "Avoid clear-text keys in code.", ["3.5.1", "3.6.1"], 2),
    ]},
    { ...TOPICS[3], questions: [
      q("d_tls_everywhere", "Is strong TLS enforced for customer and API traffic that carries card data?", "Disable weak ciphers.", ["4.1", "4.2.1"], 1),
      q("d_wireless_segmented", "If wireless exists in the CDE, is it segmented and encrypted separately from guest traffic?", "Not Applicable if no wireless touches card data.", ["1.5.1", "2.2.2"], 2),
    ]},
    { ...TOPICS[4], questions: [
      q("d_malware_defense", "Is anti-malware deployed and kept current on covered systems?", "Or documented exceptions per PCI.", ["5.2.1", "5.3.2"], 1),
      q("d_email_phish", "Do you use email filtering and staff training to reduce phishing that could lead to CDE compromise?", "Complements technical controls.", ["5.4.1", "12.6.1"], 2),
    ]},
    { ...TOPICS[5], questions: [
      q("d_sdlc", "Do you use secure coding and review changes before production for payment applications?", "PR reviews and test environments.", ["6.2.1", "6.5.1"], 1),
      q("d_secrets_management", "Are API keys, DB passwords, and certificates stored in vaults or secret managers—not in code repos?", "Rotate when staff leave.", ["6.2.4", "8.6.1"], 2),
    ]},
    { ...TOPICS[6], questions: [
      q("d_rbac", "Is access to card data and admin consoles based on role with periodic review?", "Quarterly or automated recertification.", ["7.1", "7.2.5"], 1),
      q("d_vendor_remote", "Is vendor remote access disabled by default and enabled only for scheduled work with unique credentials?", "Audit vendor sessions.", ["7.2.1", "8.2.1"], 2),
    ]},
    { ...TOPICS[7], questions: [
      q("d_mfa_admin", "Is MFA enforced for all remote and high-privilege access to in-scope systems?", "Include cloud consoles.", ["8.4.2", "8.5.1"], 1),
    ]},
    { ...TOPICS[8], questions: [
      q("d_physical", "Are data centers and offices with sensitive systems physically controlled?", "Badges, visitors, media disposal.", ["9.1.1", "9.5.1"], 1),
    ]},
    { ...TOPICS[9], questions: [
      q("d_central_logs", "Are security logs aggregated, time-synced, and protected from tampering?", "SIEM or managed logging counts.", ["10.2.1", "10.5.1"], 1),
      q("d_log_review_process", "Do you review security alerts or reports at least weekly for suspicious activity affecting the CDE?", "Automated tickets count if followed up.", ["10.4.1", "10.4.2"], 2),
    ]},
    { ...TOPICS[10], questions: [
      q("d_scan_pen", "Do you run ASV scans and internal/external tests as required for your environment?", "Track remediation.", ["11.3.1", "11.3.2"], 1),
    ]},
    { ...TOPICS[11], questions: [
      q("d_risk_program", "Do you run an annual risk assessment and update policies accordingly?", "Tie to leadership sign-off.", ["12.1", "12.3.1"], 1),
      q("d_incident", "Is there a tested incident response plan covering payment data breaches?", "Include legal and processor notification paths.", ["12.10.1", "12.10.2"], 2),
    ]},
  ]);
}

function saqDServiceProvider() {
  return buildFile("SAQ D - Service Provider", [
    { ...TOPICS[0], questions: [
      q("sp_perimeter", "Do you document and enforce network segmentation between clients and your shared infrastructure?", "Show data flows per client.", ["1.1.2", "1.3.1"], 1),
      q("sp_shared_services", "Are shared security services (logging, auth) isolated so one client cannot access another’s data?", "Multi-tenant controls.", ["1.3.3", "2.4.1"], 2),
      q("sp_ddos_edge", "Are internet-facing entry points protected against denial-of-service or abuse at the edge?", "CDN/WAF or carrier scrubbing as appropriate.", ["1.4.1", "6.4.2"], 3),
    ]},
    { ...TOPICS[1], questions: [
      q("sp_hardening_automation", "Is system hardening automated or checked regularly for all in-scope images?", "Infrastructure-as-code helps.", ["2.2.1", "2.2.2"], 1),
      q("sp_container_k8s_hardening", "If you use containers or Kubernetes for CHD workloads, are namespaces, RBAC, and network policies enforced?", "Not Applicable if unused.", ["2.2.1", "6.4.2"], 2),
    ]},
    { ...TOPICS[2], questions: [
      q("sp_chd_isolation", "Is cardholder data isolated per client with encryption and strict access boundaries?", "Database schemas, keys, and backups separated logically.", ["3.3.1", "3.5.1"], 1),
      q("sp_subprocessors", "Do you track subprocessors that touch CHD and flow PCI obligations downstream?", "Written agreements and reviews.", ["12.8.1", "12.8.5"], 2),
    ]},
    { ...TOPICS[3], questions: [
      q("sp_api_security", "Are APIs that move card data authenticated, authorized, and encrypted?", "mTLS or OAuth with least privilege.", ["4.1", "4.2.1"], 1),
      q("sp_key_rotation", "Are encryption keys for tenant data rotated on schedule and after suspected compromise?", "Per KMS policy with audit trail.", ["3.6.1", "4.2.2"], 2),
    ]},
    { ...TOPICS[4], questions: [
      q("sp_malware_coverage", "Is malware protection consistent across all OS types you support for CHD processing?", "Including Linux agents where required.", ["5.2.1", "5.3.2"], 1),
      q("sp_supply_chain_deps", "Do you scan third-party libraries and container images for known vulnerabilities before deploy?", "SBOM or dependency scanners.", ["6.3.2", "6.5.1"], 2),
    ]},
    { ...TOPICS[5], questions: [
      q("sp_cicd_security", "Do CI/CD pipelines scan code and dependencies before deploy to CHD systems?", "SAST/DAST and secrets scanning.", ["6.2.1", "6.5.1"], 1),
      q("sp_prod_data_masking", "Are production-like environments masked or tokenized so real PAN is not used in tests?", "Synthetic data preferred.", ["6.5.3", "3.3.1"], 2),
    ]},
    { ...TOPICS[6], questions: [
      q("sp_pam", "Are privileged access sessions recorded and approved for production CHD systems?", "PAM or cloud session manager.", ["7.2.1", "8.2.1"], 1),
      q("sp_customer_data_access", "Is customer support access to CHD logged and limited to tickets with customer approval?", "Just-in-time access patterns.", ["7.2.1", "10.2.1"], 2),
    ]},
    { ...TOPICS[7], questions: [
      q("sp_mfa_strict", "Is MFA mandatory for all personnel accessing production CHD or security tools?", "No exclusions for break-glass without process.", ["8.4.2", "8.5.1"], 1),
      q("sp_passwordless_policy", "Are passwordless or SSO integrations reviewed for security when they touch CHD admin tools?", "SAML/OIDC hardening.", ["8.3.1", "8.5.1"], 2),
    ]},
    { ...TOPICS[8], questions: [
      q("sp_dc_controls", "Are colocation and office sites meeting physical security for systems storing or processing CHD?", "Visitor logs, cage access.", ["9.1.1", "9.4.2"], 1),
      q("sp_media_destruction", "Is secure media destruction used for drives or tapes that held CHD when decommissioned?", "Certificates retained.", ["9.5.1", "10.5.1"], 2),
    ]},
    { ...TOPICS[9], questions: [
      q("sp_tenant_logs", "Can each client receive or export their own audit logs on request?", "Tenant-aware logging.", ["10.2.1", "10.3.1"], 1),
      q("sp_soc_monitoring", "Is 24/7 monitoring or alerting in place for critical security events?", "NOC or MSSP coverage.", ["10.4.1", "12.10.1"], 2),
    ]},
    { ...TOPICS[10], questions: [
      q("sp_continuous_scan", "Do you run continuous or frequent vulnerability scanning on internet-facing CHD systems?", "Plus periodic penetration tests.", ["11.3.1", "11.4.1"], 1),
    ]},
    { ...TOPICS[11], questions: [
      q("sp_policies_client", "Do client-facing policies describe security responsibilities and SLAs clearly?", "Published security whitepaper or DPA annex.", ["12.1", "12.8.2"], 1),
      q("sp_annual_review", "Is there an annual executive review of PCI program and third-party risks?", "Board or risk committee minutes.", ["12.3.1", "12.4.1"], 2),
      q("sp_customer_incident", "Is there a coordinated incident process that notifies affected customers and card brands as required?", "Playbooks and drills.", ["12.10.1", "12.10.2"], 3),
    ]},
  ]);
}

// --- SAQ A-EP (~50) & SAQ C (~50): broader templates ---
function spreadQuestions(label, baseTopics, bank) {
  const out = baseTopics.map((t) => ({ ...t, questions: [] }));
  let i = 0;
  for (const item of bank) {
    out[i % out.length].questions.push({ ...item, display_order: 0 });
    i++;
  }
  return buildFile(
    label,
    out.map((s) => ({
      ...s,
      questions: s.questions.map((it, idx) => ({ ...it, display_order: idx + 1 })),
    })),
  );
}

const epBank = [];
const cBank = [];
let oid = 0;
const mk = (prefix, question, help, maps) => {
  oid += 1;
  return q(`${prefix}_${oid}`, question, help, maps, oid);
};

// Build 50 generic ecommerce / card-present style controls (plain English)
const epTemplates = [
  ["Document card data flows and system owners.", "Keeps scope accurate.", ["1.1.1", "1.1.2"]],
  ["Restrict traffic between payment systems and the internet using deny-by-default rules.", "Review when apps or networks change.", ["1.2.1", "1.3.2"]],
  ["Separate production payment systems from office and guest networks.", "VLANs or firewalls between zones.", ["1.3.1", "1.3.3"]],
  ["Protect wireless networks that can reach payment systems.", "WPA3 enterprise or stronger; guest Wi-Fi isolated.", ["1.5.1", "2.2.2"]],
  ["Maintain configuration standards for web servers, app servers, and databases.", "Document hardening levels.", ["2.2.1", "2.2.2"]],
  ["Remove vendor defaults and unnecessary services on in-scope systems.", "Especially databases and admin interfaces.", ["2.2.2", "2.2.4"]],
  ["Do not store sensitive authentication data after authorization.", "No full track or CVV in databases or logs.", ["3.3.1", "3.3.3"]],
  ["Limit stored PAN to business need and mask when displayed.", "Truncation on receipts and screens.", ["3.3.2", "3.4.1"]],
  ["Securely delete or destroy data when retention periods end.", "Crypto-shred or verified wipe.", ["3.2.1", "3.3.2"]],
  ["Use strong cryptography for PAN at rest where storage is allowed.", "AES-256 or better with proper key management.", ["3.5.1", "3.6.1"]],
  ["Enforce TLS 1.2+ for all customer-facing payment pages and APIs.", "Disable weak ciphers and old protocols.", ["4.1", "4.2.1"]],
  ["Protect encryption keys using HSM, KMS, or equivalent—not in source code.", "Separate duties for key custodians.", ["4.2.2", "3.6.1"]],
  ["Deploy anti-malware on all systems where it is not prohibited.", "Central management and current signatures.", ["5.2.1", "5.3.2"]],
  ["Review malware defenses periodically for coverage gaps.", "New OS versions or container hosts included.", ["5.3.2", "5.3.5"]],
  ["Follow secure SDLC for custom payment software including code review.", "Peer review before merge.", ["6.2.1", "6.3.1"]],
  ["Patch critical vulnerabilities within agreed timelines.", "Track CVEs affecting payment stack.", ["6.3.3", "11.3.1"]],
  ["Use change control with approvals and back-out plans for production.", "Emergency changes still documented.", ["6.5.1", "6.5.2"]],
  ["Run separate dev/test from production with no live card data in lower environments.", "Synthetic or tokenized test data only.", ["6.5.3", "6.5.4"]],
  ["Grant access based on least privilege and job role.", "RBAC for apps and databases.", ["7.1", "7.2.1"]],
  ["Review user access at least quarterly for admin and DB accounts.", "Automated reports acceptable.", ["7.2.5", "7.2.6"]],
  ["Require unique IDs and no group shared passwords.", "Service accounts documented.", ["8.2.1", "8.2.3"]],
  ["Enforce MFA for remote access and for all personnel into CDE.", "Hardware token or app-based OTP.", ["8.4.2", "8.5.1"]],
  ["Rotate passwords or keys when staff leave or after suspected compromise.", "Includes API keys to PSPs.", ["8.3.6", "8.3.9"]],
  ["Lock workstations after inactivity and limit physical access to server rooms.", "Clean desk for support staff.", ["8.2.8", "9.2.1"]],
  ["Protect media and backups that contain CHD.", "Encrypted offsite storage.", ["9.5.1", "9.6.1"]],
  ["Log security events centrally with accurate time sources.", "NTP on all servers.", ["10.2.1", "10.5.1"]],
  ["Review logs for failures, changes, and privileged actions.", "SIEM rules or weekly spot checks.", ["10.4.1", "10.4.2"]],
  ["Retain logs per policy and protect them from unauthorized deletion.", "Immutable storage where possible.", ["10.5.1", "10.7.1"]],
  ["Run ASV scans quarterly and remediate highs.", "Track exceptions with compensating controls.", ["11.3.1", "11.3.2"]],
  ["Perform penetration tests at least annually for external and internal scope.", "Scope includes critical apps.", ["11.4.1", "11.4.2"]],
  ["Maintain an information security policy signed by leadership.", "Reviewed at least annually.", ["12.1", "12.2"]],
  ["Assign PCI ownership and security champions across teams.", "RACI for requirements.", ["12.3.2", "12.4.1"]],
  ["Security awareness training for all staff annually.", "Phishing simulations optional but helpful.", ["12.6.1", "12.6.2"]],
  ["Maintain list of service providers with PCI responsibilities.", "Review their reports yearly.", ["12.8.1", "12.8.2"]],
  ["Written incident response plan with notification steps.", "Tabletop exercises yearly.", ["12.10.1", "12.10.2"]],
  ["Web application firewall or equivalent controls for public-facing apps.", "Tune rules after major releases.", ["6.4.1", "6.4.2"]],
  ["Protect admin interfaces with IP allow lists or jump hosts where possible.", "No direct DB exposure to internet.", ["1.2.1", "8.4.2"]],
  ["Tokenize or outsource PAN where feasible to shrink scope.", "Reduces risk and audit effort.", ["3.3.1", "3.4.1"]],
  ["Monitor payment page integrity for unauthorized scripts.", "Change detection or CSP headers.", ["6.4.3", "11.6.1"]],
  ["Secure APIs with authentication, rate limits, and schema validation.", "Prevent card data scraping.", ["6.4.2", "4.2.1"]],
  ["Document and test disaster recovery for payment systems.", "RTO/RPO defined.", ["12.10.1", "9.5.1"]],
  ["Background checks for staff with access to CHD where legally allowed.", "Contractor screening included.", ["12.7.1", "12.7.2"]],
  ["Inventory open ports and services quarterly on internet-facing systems.", "Close unused services.", ["1.2.1", "11.3.1"]],
  ["Use configuration management or IaC to prevent drift.", "Drift detection alerts.", ["2.2.1", "6.5.1"]],
  ["Encrypt backups containing CHD and test restores.", "Verify integrity periodically.", ["3.5.1", "9.5.1"]],
  ["Segregate duties between dev and prod deploy approvers.", "Two-person rule for production.", ["6.5.1", "7.2.1"]],
  ["Document and approve firewall changes.", "Ticketing integration.", ["1.2.7", "6.5.1"]],
  ["Monitor file integrity on critical payment binaries.", "FIM alerts to SIEM.", ["11.5.1", "10.5.1"]],
  ["Maintain secure disposal of devices that stored CHD.", "Certificates of destruction.", ["9.5.1", "3.3.2"]],
  ["Customer-facing privacy notice describes card data use.", "Aligned with retention policy.", ["12.1", "3.2.1"]],
];

for (const [i, [text, help, maps]] of epTemplates.entries()) {
  epBank.push(mk("aep", text, help, maps));
}

// SAQ C: card-present / payment application — reuse similar bank with different prefix and slight wording tweaks
const cTemplates = epTemplates.map(([text, help, maps], idx) => [
  text.replace("customer-facing", "in-store and back-office").replace("Web", "Payment"),
  help,
  maps,
]);
for (const [i, row] of cTemplates.entries()) {
  const [text, help, maps] = row;
  cBank.push(mk("c", text, help, maps));
}

const saqAEp = spreadQuestions("SAQ A-EP", TOPICS, epBank);
const saqC = spreadQuestions("SAQ C", TOPICS, cBank);

const files = [
  ["saq_b_prd_ready.json", saqB],
  ["saq_b_ip_prd_ready.json", saqBIp],
  ["saq_c_vt_prd_ready.json", saqCVt],
  ["saq_d_merchant_prd_ready.json", saqDMerchant()],
  ["saq_d_service_provider_prd_ready.json", saqDServiceProvider()],
  ["saq_a_ep_prd_ready.json", saqAEp],
  ["saq_c_prd_ready.json", saqC],
];

for (const [name, data] of files) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

function countQuestions(data) {
  return data.sections.reduce((n, s) => n + s.questions.length, 0);
}

console.log("Wrote:", files.map(([n, d]) => `${n} (${countQuestions(d)} q)`).join(", "));
console.log("saq_a_prd_ready.json is maintained separately (15 q).");
