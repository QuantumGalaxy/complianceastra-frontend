/**
 * PCI SAQ eligibility decision tree — config-driven questions and copy.
 * Update rules here when PCI guidance or product copy changes.
 */

import type { SaqType } from "@/components/assessment/checklist-data";

export type PaymentChannel =
  | "card_present"
  | "ecommerce"
  | "moto"
  | "service_provider";

export type WizardStateV2 = {
  payment_channel: PaymentChannel | null;
  /** Service provider: handles CHD for other businesses */
  service_provider_handles_chd_for_others?: "yes" | "no";
  /** Card-present: store CHD (even temporarily)? */
  card_present_stores_chd?: "yes" | "no" | "unsure";
  /** Card-present: how payments accepted */
  card_present_how?:
    | "imprint_dial"
    | "pts_ip"
    | "pos_internet"
    | "virtual_terminal";
  /** MOTO: store CHD? */
  moto_stores_chd?: "yes" | "no" | "unsure";
  /** MOTO: fully outsourced to PCI-compliant provider */
  moto_fully_outsourced?: "yes" | "no";
  /** MOTO: how processed when not fully outsourced */
  moto_how_process?: "virtual_terminal" | "pos_application" | "other";
  /** Ecommerce: processing fully outsourced to PCI DSS compliant provider */
  ecommerce_fully_outsourced?: "yes" | "no";
  /** Ecommerce: payment page handling */
  ecommerce_payment_page?:
    | "redirect"
    | "iframe_embedded"
    | "direct_post_js"
    | "merch_servers_touch";
  saq: SaqType | null;
};

export type QuestionOption = {
  value: string;
  label: string;
  description?: string;
};

export type SaqQuestionConfig = {
  id: string;
  channel: PaymentChannel | "entry";
  badge: string;
  title: string;
  description?: string;
  helpText?: string;
  options: QuestionOption[];
};

/** Step 1 — entry (all channels) */
export const ENTRY_QUESTION: SaqQuestionConfig = {
  id: "payment_channel",
  channel: "entry",
  badge: "Step 1",
  title: "How do you accept payments?",
  description: "Choose the option that best describes your primary way of taking card payments.",
  options: [
    {
      value: "card_present",
      label: "Card-present (POS / in-store)",
      description: "Customers pay in person with a terminal, register, or manual imprint.",
    },
    {
      value: "ecommerce",
      label: "E-commerce (website / app)",
      description: "Customers pay online through your site, app, or a hosted checkout.",
    },
    {
      value: "moto",
      label: "MOTO (phone / mail orders)",
      description: "Staff take card details by phone, mail, or fax — not face-to-face.",
    },
    {
      value: "service_provider",
      label: "Service provider",
      description: "You provide services (e.g. hosting, payment software) that touch other businesses’ card data.",
    },
  ],
};

export const SERVICE_PROVIDER_QUESTION: SaqQuestionConfig = {
  id: "service_provider_handles_chd_for_others",
  channel: "service_provider",
  badge: "Service provider",
  title: "Are you a service provider handling cardholder data for other businesses?",
  description:
    "This means you store, process, or transmit card data on behalf of merchants or other entities.",
  options: [
    { value: "yes", label: "Yes", description: "We handle card data for clients or partners." },
    {
      value: "no",
      label: "No",
      description: "We don’t handle other businesses’ card data in scope of PCI.",
    },
  ],
};

export const CARD_PRESENT_STORAGE_QUESTION: SaqQuestionConfig = {
  id: "card_present_stores_chd",
  channel: "card_present",
  badge: "Card-present",
  title: "Do you store any cardholder data (even temporarily)?",
  description: "Including on servers, databases, spreadsheets, voice recordings, or paper beyond immediate transaction needs.",
  helpText: "If you’re not sure, choose “Not sure” — we’ll use a conservative path.",
  options: [
    { value: "yes", label: "Yes", description: "We keep or store card data anywhere in our environment." },
    { value: "no", label: "No", description: "We don’t store cardholder data after authorization completes." },
    { value: "unsure", label: "Not sure", description: "Treat as higher scope until you confirm with your acquirer or QSA." },
  ],
};

export const CARD_PRESENT_HOW_QUESTION: SaqQuestionConfig = {
  id: "card_present_how",
  channel: "card_present",
  badge: "Card-present",
  title: "How do you accept card-present payments?",
  description: "Pick the option that best matches your main setup.",
  options: [
    {
      value: "imprint_dial",
      label: "Imprint machine or dial-out terminal (no internet)",
      description: "Manual imprint or a phone line terminal; not connected to your network for card data.",
    },
    {
      value: "pts_ip",
      label: "PTS-approved device connected to the internet",
      description: "Standalone payment terminal approved by PCI PTS, using IP (e.g. Ethernet/Wi‑Fi).",
    },
    {
      value: "pos_internet",
      label: "POS system connected to the internet",
      description: "Integrated register or payment application on a network — not just a standalone dial terminal.",
    },
    {
      value: "virtual_terminal",
      label: "Virtual terminal via browser",
      description: "Staff key cards into a web-based terminal (e.g. processor portal in a browser).",
    },
  ],
};

export const MOTO_STORAGE_QUESTION: SaqQuestionConfig = {
  id: "moto_stores_chd",
  channel: "moto",
  badge: "MOTO",
  title: "Do you store any cardholder data?",
  description: "Electronic or paper retention beyond what’s needed for the transaction.",
  options: [
    { value: "yes", label: "Yes", description: "We keep card data in systems, files, or long-term paper." },
    { value: "no", label: "No", description: "We don’t retain cardholder data." },
    { value: "unsure", label: "Not sure", description: "Conservative path until you confirm." },
  ],
};

export const MOTO_OUTSOURCED_QUESTION: SaqQuestionConfig = {
  id: "moto_fully_outsourced",
  channel: "moto",
  badge: "MOTO",
  title: "Are all payment functions fully outsourced to a PCI-compliant provider?",
  description:
    "For example: customers pay via a hosted page or IVR, and you don’t electronically store, process, or transmit card data on your systems.",
  options: [
    { value: "yes", label: "Yes", description: "Card data stays with the compliant provider; we don’t touch it electronically." },
    { value: "no", label: "No", description: "We use virtual terminals, POS, or other systems that handle card data." },
  ],
};

export const MOTO_HOW_QUESTION: SaqQuestionConfig = {
  id: "moto_how_process",
  channel: "moto",
  badge: "MOTO",
  title: "How do you process payments?",
  description: "When payment isn’t fully outsourced as described above.",
  options: [
    {
      value: "virtual_terminal",
      label: "Virtual terminal (browser-based)",
      description: "Staff enter cards in a web terminal from the processor or gateway.",
    },
    {
      value: "pos_application",
      label: "POS system or application",
      description: "Software or device application that processes or stores card data.",
    },
    {
      value: "other",
      label: "Other / mixed / unsure",
      description: "Multiple methods or unclear flow — needs a broader assessment.",
    },
  ],
};

export const ECOMMERCE_OUTSOURCED_QUESTION: SaqQuestionConfig = {
  id: "ecommerce_fully_outsourced",
  channel: "ecommerce",
  badge: "E-commerce",
  title: "Is your payment processing fully outsourced to a PCI DSS compliant provider?",
  description:
    "The compliant provider handles card data; your systems don’t store, process, or transmit account data.",
  options: [
    { value: "yes", label: "Yes", description: "Processor/host handles card data; we meet SAQ A-style outsourcing assumptions." },
    { value: "no", label: "No", description: "Our systems store, process, or transmit card data — broader PCI scope." },
  ],
};

export const ECOMMERCE_PAYMENT_PAGE_QUESTION: SaqQuestionConfig = {
  id: "ecommerce_payment_page",
  channel: "ecommerce",
  badge: "E-commerce",
  title: "How is the payment page handled?",
  description: "This determines whether you fit SAQ A (outsourced page) or SAQ A-EP (merchant-influenced page).",
  options: [
    {
      value: "redirect",
      label: "Customer is redirected to a third-party payment page (URL redirect)",
      description: "Customer leaves your site URL to pay on the provider’s hosted page (e.g. Stripe Checkout redirect).",
    },
    {
      value: "iframe_embedded",
      label: "Payment form is embedded (iframe) and hosted entirely by third party",
      description: "The card form is in an iframe; content and scripts come from the payment provider, not your origin.",
    },
    {
      value: "direct_post_js",
      label: "My website sends payment data via API (Direct Post / JavaScript)",
      description: "Your page or scripts collect or shape how card data is sent (direct post, JS SDK on your domain, etc.).",
    },
    {
      value: "merch_servers_touch",
      label: "My servers process or touch card data",
      description: "Your systems see, store, or relay full card numbers — full merchant PCI scope.",
    },
  ],
};

export const QUESTIONS_BY_ID: Record<string, SaqQuestionConfig> = {
  payment_channel: ENTRY_QUESTION,
  service_provider_handles_chd_for_others: SERVICE_PROVIDER_QUESTION,
  card_present_stores_chd: CARD_PRESENT_STORAGE_QUESTION,
  card_present_how: CARD_PRESENT_HOW_QUESTION,
  moto_stores_chd: MOTO_STORAGE_QUESTION,
  moto_fully_outsourced: MOTO_OUTSOURCED_QUESTION,
  moto_how_process: MOTO_HOW_QUESTION,
  ecommerce_fully_outsourced: ECOMMERCE_OUTSOURCED_QUESTION,
  ecommerce_payment_page: ECOMMERCE_PAYMENT_PAGE_QUESTION,
};
