import { jsPDF } from "jspdf";
import type { SaqType } from "@/components/assessment/checklist-data";
import type {
  ChecklistDefinition,
  ChecklistState,
} from "@/components/assessment/checklist-data";
import { SAQ_LABELS, type ActionCard } from "@/components/assessment/report-data";

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_RESERVE = 26;
const CONTENT_BOTTOM = PAGE_HEIGHT - MARGIN - FOOTER_RESERVE;
const LINE_HEIGHT = 5.5;
const SECTION_GAP = 12;
const BODY_FONT = 9.5;
const SMALL_FONT = 8.5;
const TINY_FONT = 7.5;

/** ComplianceAstra brand palette */
const NAVY: [number, number, number] = [15, 23, 42];
const BRAND_GREEN: [number, number, number] = [5, 150, 105];
const BRAND_GREEN_SOFT: [number, number, number] = [236, 253, 245];
const SLATE_BG: [number, number, number] = [241, 245, 249];
const SLATE_BORDER: [number, number, number] = [226, 232, 240];
const MUTED: [number, number, number] = [100, 116, 139];
const AMBER: [number, number, number] = [245, 158, 11];
const AMBER_SOFT: [number, number, number] = [255, 251, 235];
const SUCCESS: [number, number, number] = [16, 185, 129];
const SUCCESS_SOFT: [number, number, number] = [236, 253, 245];

type ScopeInfo = {
  inScope: string[];
  outOfScope: string[];
  assumptions: string[];
};

export type ReportInput = {
  result: {
    saq: SaqType;
    title: string;
    why: string[];
    summary: string;
    estimateLabel: string;
  };
  scopeInfo: ScopeInfo;
  riskLevel: string;
  /** Up to 5 action cards (title + priority for the table) */
  topActionCards: ActionCard[];
  checklistDef: ChecklistDefinition;
  checklistState: ChecklistState;
  completed: number;
  totalItems: number;
};

function addNewPageIfNeeded(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > CONTENT_BOTTOM) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function formatPciReference(pciRef: string): string {
  return pciRef.replace(/^(\s*PCI\s*Ref:\s*)+/i, "").trim();
}

function answerToLabel(
  answer: string | null | undefined,
): { text: string; tone: "success" | "amber" | "neutral" | "muted" } {
  if (answer === null || answer === undefined) {
    return { text: "Not Started", tone: "muted" };
  }
  switch (answer) {
    case "in_place":
      return { text: "In Place", tone: "success" };
    case "in_place_ccw":
      return { text: "In Place with CCW", tone: "success" };
    case "not_applicable":
      return { text: "Not Applicable", tone: "neutral" };
    case "not_tested":
      return { text: "Not Tested", tone: "neutral" };
    case "not_in_place":
      return { text: "Not in Place", tone: "amber" };
    case "action_needed":
      return { text: "Action Needed", tone: "amber" };
    default:
      return { text: "Not Started", tone: "muted" };
  }
}

function writeBulletList(doc: jsPDF, items: string[], y: number): number {
  let currentY = y;
  doc.setFontSize(BODY_FONT);
  doc.setFont("helvetica", "normal");
  for (const item of items) {
    const lines = doc.splitTextToSize(`• ${item}`, CONTENT_WIDTH - 10);
    currentY = addNewPageIfNeeded(doc, currentY, lines.length * LINE_HEIGHT + 2);
    doc.text(lines, MARGIN + 2, currentY);
    currentY += lines.length * LINE_HEIGHT + 3;
  }
  return currentY;
}

/** Brand strip + title block (call after optional top accent rect). */
function drawPremiumHeader(doc: jsPDF, y: number, generatedAt: string, saqLabel: string): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...NAVY);
  doc.text("ComplianceAstra", MARGIN, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND_GREEN);
  doc.text("PCI DSS Assessment Report", MARGIN, y + 8);

  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text(saqLabel, MARGIN, y + 16);

  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${generatedAt}`, PAGE_WIDTH - MARGIN, y + 4, { align: "right" });

  y += 26;
  doc.setDrawColor(...SLATE_BORDER);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 12;

  doc.setTextColor(0, 0, 0);
  return y;
}

function drawExecutiveSummaryGrid(
  doc: jsPDF,
  y: number,
  params: {
    saqLabel: string;
    riskLevel: string;
    completionPct: number;
    scopeSummary: string;
  },
): number {
  y = addNewPageIfNeeded(doc, y, 52);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Executive summary", MARGIN, y);
  y += 8;

  const gap = 5;
  const cardW = (CONTENT_WIDTH - gap) / 2;
  const cardH = 28;
  const labelSize = 7.5;
  const valueSize = 10;

  const cards: { label: string; value: string }[] = [
    { label: "SAQ type", value: params.saqLabel },
    { label: "Risk level", value: params.riskLevel },
    { label: "Completion", value: `${params.completionPct}%` },
    { label: "Scope (summary)", value: params.scopeSummary },
  ];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const idx = row * 2 + col;
      const cx = MARGIN + col * (cardW + gap);
      const cy = y + row * (cardH + gap);
      doc.setFillColor(...BRAND_GREEN_SOFT);
      doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "F");
      doc.setDrawColor(...SLATE_BORDER);
      doc.setLineWidth(0.2);
      doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "S");

      doc.setFontSize(labelSize);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(cards[idx].label, cx + 4, cy + 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(valueSize);
      doc.setTextColor(...NAVY);
      const valLines = doc.splitTextToSize(cards[idx].value, cardW - 8);
      doc.text(valLines, cx + 4, cy + 16);
      doc.setFont("helvetica", "normal");
    }
  }

  doc.setTextColor(0, 0, 0);
  return y + 2 * (cardH + gap) + SECTION_GAP;
}

function drawSectionHeading(doc: jsPDF, y: number, sectionNum: string, title: string): number {
  y = addNewPageIfNeeded(doc, y, 18);
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(MARGIN, y - 1, 3.5, 11, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(`${sectionNum}  ${title}`, MARGIN + 7, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + 14;
}

function drawTopActionsTable(doc: jsPDF, y: number, cards: ActionCard[]): number {
  y = addNewPageIfNeeded(doc, y, 22 + cards.length * 16);
  const colPriority = MARGIN + 2;
  const colAction = MARGIN + 22;
  const colStatus = PAGE_WIDTH - MARGIN - 36;
  const actionColW = colStatus - colAction - 5;

  doc.setFillColor(...SLATE_BG);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 10, 1.5, 1.5, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Priority", colPriority, y + 6.5);
  doc.text("Action", colAction, y + 6.5);
  doc.text("Status", colStatus, y + 6.5);
  doc.setFont("helvetica", "normal");
  y += 12;

  cards.forEach((card, i) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const actionLines = doc.splitTextToSize(card.title, actionColW);
    const rowH = Math.max(13, actionLines.length * LINE_HEIGHT + 6);

    y = addNewPageIfNeeded(doc, y, rowH + 6);
    if (i % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(MARGIN, y - 2, CONTENT_WIDTH, rowH, "F");
    doc.setDrawColor(...SLATE_BORDER);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y + rowH - 2, PAGE_WIDTH - MARGIN, y + rowH - 2);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(`P${i + 1}`, colPriority, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(actionLines, colAction, y + 7);

    const statusText = card.priority === "High" ? "High priority" : "Medium priority";
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    if (card.priority === "High") {
      doc.setTextColor(...AMBER);
    } else {
      doc.setTextColor(...MUTED);
    }
    doc.text(statusText, colStatus, y + 7);

    y += rowH;
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + SECTION_GAP;
}

function drawStatusBadge(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  tone: "success" | "amber" | "neutral" | "muted",
): number {
  const padX = 2;
  doc.setFontSize(7.5);
  const w = doc.getTextWidth(label) + padX * 2;
  let fill: [number, number, number];
  let text: [number, number, number];
  switch (tone) {
    case "success":
      fill = SUCCESS_SOFT;
      text = SUCCESS;
      break;
    case "amber":
      fill = AMBER_SOFT;
      text = AMBER;
      break;
    case "neutral":
      fill = SLATE_BG;
      text = MUTED;
      break;
    default:
      fill = [243, 244, 246];
      text = MUTED;
  }
  doc.setFillColor(...fill);
  doc.roundedRect(x, y - 4, w, 7, 1, 1, "F");
  doc.setTextColor(...text);
  doc.setFont("helvetica", "bold");
  doc.text(label, x + padX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return x + w + 3;
}

function drawChecklistItemCard(
  doc: jsPDF,
  y: number,
  item: { label: string; pciRef: string },
  answerInfo: { text: string; tone: "success" | "amber" | "neutral" | "muted" },
  notes: string,
  ccwExplanation?: string,
): number {
  const pad = 6;
  const innerW = CONTENT_WIDTH - 4 - pad * 2;
  const refLine = formatPciReference(item.pciRef);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  const qLines = doc.splitTextToSize(item.label, innerW);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(TINY_FONT);
  const refLines = doc.splitTextToSize(`Requirement: ${refLine}`, innerW);
  doc.setFontSize(TINY_FONT);
  const notesBlock = notes ? doc.splitTextToSize(`Notes / evidence: ${notes}`, innerW) : [];
  const ccwBlock = ccwExplanation
    ? doc.splitTextToSize(`CCW description: ${ccwExplanation}`, innerW)
    : [];

  const lineH = LINE_HEIGHT * 0.82;
  const cardH =
    pad +
    qLines.length * LINE_HEIGHT +
    4 +
    refLines.length * lineH +
    10 +
    (ccwBlock.length ? ccwBlock.length * lineH + 4 : 0) +
    (notesBlock.length ? notesBlock.length * lineH + 4 : 0) +
    pad;

  y = addNewPageIfNeeded(doc, y, cardH + 6);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...SLATE_BORDER);
  doc.setLineWidth(0.25);
  doc.roundedRect(MARGIN + 2, y, CONTENT_WIDTH - 4, cardH, 2, 2, "FD");

  let iy = y + pad + 5;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(qLines, MARGIN + pad + 2, iy);
  iy += qLines.length * LINE_HEIGHT + 5;

  doc.setFontSize(TINY_FONT);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(refLines, MARGIN + pad + 2, iy);
  iy += refLines.length * lineH + 4;

  drawStatusBadge(doc, MARGIN + pad + 2, iy + 2, answerInfo.text, answerInfo.tone);
  iy += 12;

  if (ccwExplanation) {
    doc.setFontSize(TINY_FONT);
    doc.setTextColor(60, 60, 60);
    doc.text(ccwBlock, MARGIN + pad + 2, iy);
    iy += ccwBlock.length * lineH + 4;
  }
  if (notes) {
    doc.setFontSize(TINY_FONT);
    doc.setTextColor(60, 60, 60);
    doc.text(notesBlock, MARGIN + pad + 2, iy);
  }

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  return y + cardH + 5;
}

function drawSectionBlockTitle(doc: jsPDF, y: number, title: string): number {
  y = addNewPageIfNeeded(doc, y, 12);
  doc.setFillColor(...SLATE_BG);
  doc.rect(MARGIN + 2, y - 2, CONTENT_WIDTH - 4, 9, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN + 5, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + 12;
}

function applyFooters(doc: jsPDF, pageCount: number): void {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BRAND_GREEN);
    doc.setLineWidth(0.35);
    doc.line(MARGIN, PAGE_HEIGHT - 20, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 20);

    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(`ComplianceAstra · Page ${i} of ${pageCount}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 14, {
      align: "center",
    });
    doc.setFontSize(6.8);
    doc.text(
      "This report is for guidance only. Confirm final obligations with your acquirer or QSA. Confidential — for authorized use.",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 9,
      { align: "center" },
    );
    doc.setTextColor(0, 0, 0);
  }
}

export function generateComplianceReportPdf(input: ReportInput): void {
  const doc = new jsPDF();
  const {
    result,
    scopeInfo,
    riskLevel,
    topActionCards,
    checklistDef,
    checklistState,
    completed,
    totalItems,
  } = input;

  const generatedAt = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completionPct = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  const scopeSummaryRaw = scopeInfo.inScope.slice(0, 2).join(" · ");
  const scopeSummary =
    scopeSummaryRaw.length > 120 ? `${scopeSummaryRaw.slice(0, 117)}…` : scopeSummaryRaw || "—";

  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, PAGE_WIDTH, 4, "F");

  let y = MARGIN + 4;
  y = drawPremiumHeader(doc, y, generatedAt, SAQ_LABELS[result.saq]);

  y = drawExecutiveSummaryGrid(doc, y, {
    saqLabel: SAQ_LABELS[result.saq],
    riskLevel,
    completionPct,
    scopeSummary,
  });

  y = drawSectionHeading(doc, y, "1", "SAQ summary");
  doc.setFontSize(BODY_FONT);
  doc.setTextColor(51, 65, 85);
  doc.text("Why this SAQ applies:", MARGIN, y);
  y += 6;
  y = writeBulletList(doc, result.why, y);
  y += SECTION_GAP - 4;

  y = drawSectionHeading(doc, y, "2", "Scope summary");
  doc.setFontSize(BODY_FONT);
  doc.setTextColor(51, 65, 85);
  doc.text("In scope:", MARGIN, y);
  y += 6;
  y = writeBulletList(doc, scopeInfo.inScope, y);
  y += 4;
  doc.text("Out of scope:", MARGIN, y);
  y += 6;
  y = writeBulletList(doc, scopeInfo.outOfScope, y);
  y += 4;
  doc.text("Key assumptions:", MARGIN, y);
  y += 6;
  y = writeBulletList(doc, scopeInfo.assumptions, y);
  y += SECTION_GAP - 4;

  y = drawSectionHeading(doc, y, "3", "Checklist overview");
  doc.setFontSize(BODY_FONT);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Progress: ${completed} of ${totalItems} requirements addressed (${completionPct}%).`,
    MARGIN,
    y,
  );
  y += 8;
  doc.text("Sections in this assessment:", MARGIN, y);
  y += 6;
  const categoryNames = checklistDef.sections.map((s) => s.title);
  y = writeBulletList(doc, categoryNames, y);
  y += SECTION_GAP - 4;

  y = drawSectionHeading(doc, y, "4", "Top 5 actions to get compliant");
  y = drawTopActionsTable(doc, y, topActionCards.slice(0, 5));

  y = drawSectionHeading(doc, y, "5", "Full compliance checklist");
  doc.setFontSize(SMALL_FONT);
  doc.setTextColor(...MUTED);
  doc.text(
    "Each row shows the requirement reference, your question, status, and any notes or evidence you provided.",
    MARGIN,
    y,
  );
  y += 10;

  for (const section of checklistDef.sections) {
    y = drawSectionBlockTitle(doc, y, section.title);

    for (const item of section.items) {
      const state = checklistState[item.id];
      const answerInfo = answerToLabel(state?.answer);
      const notes = state?.notes?.trim() ? state.notes : "";
      const ccwExplanation = state?.ccw_explanation?.trim();

      y = drawChecklistItemCard(doc, y, item, answerInfo, notes, ccwExplanation);
    }
    y += 4;
  }

  const pageCount = doc.getNumberOfPages();
  applyFooters(doc, pageCount);

  const filename = `ComplianceAstra-PCI-Report-${SAQ_LABELS[result.saq].replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
