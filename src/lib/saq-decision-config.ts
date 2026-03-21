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

  // Service Provider
  service_provider_handles_chd_for_others?: "yes" | "no";

  // Card-present
  card_present_stores_chd?: "yes" | "no" | "unsure";
  card_present_how?:
    | "imprint_dial"
    | "pts_ip"
    | "pos_internet"
    | "virtual_terminal";

  // MOTO
  moto_stores_chd?: "yes" | "no" | "unsure";
  moto_fully_outsourced?: "yes" | "no";
  moto_how_process?: "virtual_terminal" | "pos_application" | "other";

  // Ecommerce
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

export const ENTRY_QUESTION: SaqQuestionConfig = {
  id: "payment_channel",
  channel: "entry",
  badge: "Step 1",
  title: "How do you accept card payments?",
  description:
    "Choose the option that best matches your primary payment channel.",
  options: [
    {
      value: "card_present",
      label: "Card-present (POS / in-store)",
      description:
        "Customers pay in person using a terminal, POS, or manual imprint.",
    },
    {
      value: "ecommerce",
      label: "E-commerce",
      description:
        "Customers pay on your website or app using an online checkout flow.",
    },
    {
      value: "moto",
      label: "MOTO (Mail / Telephone Orders)",
      description:
        "Staff take card details by phone, mail, or fax instead of a website checkout.",
    },
    {
      value: "service_provider",
      label: "Service Provider",
      description:
        "You provide services to other businesses that store, process, or transmit cardholder data.",
    },
  ],
};

export const SERVICE_PROVIDER_QUESTION: SaqQuestionConfig = {
  id: "service_provider_handles_chd_for_others",
  channel: "service_provider",
  badge: "Service Provider",
  title: "Do you provide payment-related services that store, process, or transmit cardholder data for other businesses?",
  description:
    "Examples include payment processing, managed payment platforms, or services that handle merchants’ cardholder data.",
  options: [
    {
      value: "yes",
      label: "Yes",
      description:
        "We handle cardholder data on behalf of other businesses.",
    },
    {
      value: "no",
      label: "No",
      description:
        "We do not handle other businesses’ cardholder data in scope of PCI.",
    },
  ],
};

export const CARD_PRESENT_STORAGE_QUESTION: SaqQuestionConfig = {
  id: "card_present_stores_chd",
  channel: "card_present",
  badge: "Card-present",
  title: "Do your systems store cardholder data after the transaction is completed?",
  description:
    "This includes card numbers, expiry dates, or similar payment data kept in systems, files, databases, recordings, or paper records.",
  helpText:
    "If you are unsure, choose “Not sure” and use the broader PCI path.",
  options: [
    {
      value: "yes",
      label: "Yes",
      description: "We keep cardholder data after payment is completed.",
    },
    {
      value: "no",
      label: "No",
      description: "We do not retain cardholder data after authorization.",
    },
    {
      value: "unsure",
      label: "Not sure",
      description: "Use a conservative path until this is confirmed.",
    },
  ],
};

export const CARD_PRESENT_HOW_QUESTION: SaqQuestionConfig = {
  id: "card_present_how",
  channel: "card_present",
  badge: "Card-present",
  title: "How do you accept in-person card payments?",
  description: "Choose the option that best matches your setup.",
  options: [
    {
      value: "imprint_dial",
      label: "Imprint machine or dial-out terminal (no internet)",
      description:
        "Manual imprint or phone-line terminal with no internet connection.",
    },
    {
      value: "pts_ip",
      label: "PTS-approved standalone terminal with internet",
      description:
        "Standalone terminal using Ethernet/Wi-Fi, not a full POS system.",
    },
    {
      value: "pos_internet",
      label: "POS system or payment app with internet connection",
      description:
        "An integrated POS or payment application connected to the internet.",
    },
    {
      value: "virtual_terminal",
      label: "Virtual terminal in a web browser",
      description:
        "Staff key in payment details through a browser-based terminal.",
    },
  ],
};

export const MOTO_STORAGE_QUESTION: SaqQuestionConfig = {
  id: "moto_stores_chd",
  channel: "moto",
  badge: "MOTO",
  title: "Do your systems store cardholder data after the transaction is completed?",
  description:
    "This includes paper records, files, recordings, databases, or any other retained payment data.",
  options: [
    {
      value: "yes",
      label: "Yes",
      description: "We keep cardholder data after payment is completed.",
    },
    {
      value: "no",
      label: "No",
      description: "We do not retain cardholder data.",
    },
    {
      value: "unsure",
      label: "Not sure",
      description: "Use a conservative path until this is confirmed.",
    },
  ],
};

export const MOTO_OUTSOURCED_QUESTION: SaqQuestionConfig = {
  id: "moto_fully_outsourced",
  channel: "moto",
  badge: "MOTO",
  title: "Are payment functions completely outsourced to a PCI DSS compliant provider?",
  description:
    "For example, the provider handles the payment interaction and your systems do not electronically store, process, or transmit cardholder data.",
  options: [
    {
      value: "yes",
      label: "Yes",
      description:
        "The compliant provider handles payment processing; we do not touch card data electronically.",
    },
    {
      value: "no",
      label: "No",
      description:
        "We still use a terminal, application, or browser-based entry process.",
    },
  ],
};

export const MOTO_HOW_QUESTION: SaqQuestionConfig = {
  id: "moto_how_process",
  channel: "moto",
  badge: "MOTO",
  title: "How do staff enter payment details?",
  description:
    "Choose the method used when payment is not fully outsourced.",
  options: [
    {
      value: "virtual_terminal",
      label: "Browser-based virtual terminal",
      description:
        "Staff enter card details into a web-based payment terminal.",
    },
    {
      value: "pos_application",
      label: "POS system or payment application",
      description:
        "A payment application or POS software is used to process the transaction.",
    },
    {
      value: "other",
      label: "Other / mixed / unsure",
      description:
        "Multiple methods, unclear flow, or something outside these options.",
    },
  ],
};

export const ECOMMERCE_PAYMENT_PAGE_QUESTION: SaqQuestionConfig = {
  id: "ecommerce_payment_page",
  channel: "ecommerce",
  badge: "E-commerce",
  title: "How does your customer enter card details on your website?",
  description:
    "Choose the option that best matches your checkout flow.",
  helpText:
    "This determines whether you fit SAQ A, SAQ A-EP, or SAQ D.",
  options: [
    {
      value: "redirect",
      label: "Customer is redirected to a third-party payment page",
      description:
        "Customer leaves your site and pays on the provider’s hosted page.",
    },
    {
      value: "iframe_embedded",
      label: "Payment form is embedded in an iframe hosted entirely by a third party",
      description:
        "The card form is served by the provider inside an iframe on your site.",
    },
    {
      value: "direct_post_js",
      label: "My website sends payment data via API / Direct Post / JavaScript",
      description:
        "Your page or scripts influence how card data is submitted to the provider.",
    },
    {
      value: "merch_servers_touch",
      label: "My servers receive, process, or store card data",
      description:
        "Your systems directly handle card numbers or related payment data.",
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
  ecommerce_payment_page: ECOMMERCE_PAYMENT_PAGE_QUESTION,
};