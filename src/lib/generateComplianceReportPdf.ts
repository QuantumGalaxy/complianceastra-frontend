import { jsPDF } from "jspdf";
import type { SaqType } from "@/components/assessment/checklist-data";
import type { ChecklistDefinition, ChecklistState } from "@/components/assessment/checklist-data";
import { SAQ_LABELS, type ActionCard } from "@/components/assessment/report-data";

const MARGIN = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_RESERVE = 28;
const CONTENT_BOTTOM = PAGE_HEIGHT - MARGIN - FOOTER_RESERVE;
const LINE_HEIGHT = 5.4;
const SECTION_GAP = 11;
const BODY_FONT = 9.5;
const SMALL_FONT = 8.5;
const TINY_FONT = 7.2;

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
const RED: [number, number, number] = [220, 38, 38];
const RED_SOFT: [number, number, number] = [254, 242, 242];

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

type BadgeTone = "success" | "amber" | "neutral" | "muted" | "danger";

function answerToLabel(answer: string | null | undefined): { text: string; tone: BadgeTone } {
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
      return { text: "Not in Place", tone: "danger" };
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

/** PAGE 1 — Cover strip + large title + executive summary cards */
function drawCoverPage(
  doc: jsPDF,
  generatedAt: string,
  saqLabel: string,
  params: { saqLabel: string; riskLevel: string; completionPct: number; scopeSummary: string },
): number {
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(0, 0, PAGE_WIDTH, 5, "F");

  let y = MARGIN + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...NAVY);
  doc.text("ComplianceAstra", MARGIN, y);

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND_GREEN);
  doc.text("PCI DSS Assessment Report", MARGIN, y + 11);

  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text(saqLabel, MARGIN, y + 22);

  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${generatedAt}`, PAGE_WIDTH - MARGIN, y + 6, { align: "right" });

  y += 34;
  doc.setDrawColor(...SLATE_BORDER);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 14;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Executive summary", MARGIN, y);
  y += 10;

  const gap = 5;
  const cardW = (CONTENT_WIDTH - gap) / 2;
  const cardH = 28;
  const labelSize = 7.5;
  const valueSize = 10;

  const cards: { label: string; value: string }[] = [
    { label: "SAQ type", value: params.saqLabel },
    { label: "Risk level", value: params.riskLevel },
    { label: "Completion", value: `${params.completionPct}%` },
    { label: "Scope summary", value: params.scopeSummary },
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
  return y + 2 * (cardH + gap) + 8;
}

function drawSectionHeading(doc: jsPDF, y: number, sectionNum: string, title: string): number {
  y = addNewPageIfNeeded(doc, y, 20);
  doc.setFillColor(...BRAND_GREEN);
  doc.rect(MARGIN, y - 1, 3.5, 11, "F");
  doc.setFontSize(11.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(`${sectionNum}  ${title}`, MARGIN + 7, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + 14;
}

function drawSubheading(doc: jsPDF, y: number, title: string): number {
  y = addNewPageIfNeeded(doc, y, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.setTextColor(51, 65, 85);
  return y;
}

function drawTopActionsTable(doc: jsPDF, y: number, cards: ActionCard[]): number {
  y = addNewPageIfNeeded(doc, y, 22 + cards.length * 16);
  const colPriority = MARGIN + 2;
  const colAction = MARGIN + 22;
  const colStatus = PAGE_WIDTH - MARGIN - 32;
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

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(`P${i + 1}`, colPriority, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(actionLines, colAction, y + 7);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text("Open", colStatus, y + 7);

    y += rowH;
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + SECTION_GAP;
}

function drawStatusBadge(doc: jsPDF, x: number, y: number, label: string, tone: BadgeTone): void {
  const padX = 2.2;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
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
    case "danger":
      fill = RED_SOFT;
      text = RED;
      break;
    default:
      fill = [243, 244, 246];
      text = MUTED;
  }
  doc.setFillColor(...fill);
  doc.roundedRect(x, y - 4, w, 7, 1, 1, "F");
  doc.setTextColor(...text);
  doc.text(label, x + padX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
}

/**
 * Structured checklist row (table-style) — Requirement | Question | Status | Notes/Evidence
 */
function drawChecklistTableRow(
  doc: jsPDF,
  y: number,
  item: { label: string; pciRef: string },
  answerInfo: { text: string; tone: BadgeTone },
  notes: string,
  ccwExplanation?: string,
): number {
  const refLine = formatPciReference(item.pciRef);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const qLines = doc.splitTextToSize(item.label, CONTENT_WIDTH - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(TINY_FONT);
  const reqLine = doc.splitTextToSize(`Requirement: ${refLine}`, CONTENT_WIDTH - 14);
  const notesLine = notes ? doc.splitTextToSize(`Notes / evidence: ${notes}`, CONTENT_WIDTH - 14) : [];
  const ccwLine = ccwExplanation
    ? doc.splitTextToSize(`CCW description: ${ccwExplanation}`, CONTENT_WIDTH - 14)
    : [];

  const lh = LINE_HEIGHT * 0.78;
  const innerPad = 8;
  const rowH =
    innerPad +
    reqLine.length * lh +
    3 +
    qLines.length * LINE_HEIGHT +
    10 +
    (ccwLine.length ? ccwLine.length * lh + 4 : 0) +
    (notesLine.length ? notesLine.length * lh + 4 : 0) +
    innerPad;

  y = addNewPageIfNeeded(doc, y, rowH + 6);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...SLATE_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, rowH, 2, 2, "FD");

  let iy = y + innerPad + 4;
  doc.setFontSize(TINY_FONT);
  doc.setTextColor(...MUTED);
  doc.text(reqLine, MARGIN + 6, iy);
  iy += reqLine.length * lh + 4;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("Question:", MARGIN + 6, iy);
  iy += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(qLines, MARGIN + 6, iy);
  iy += qLines.length * LINE_HEIGHT + 5;

  doc.setFontSize(TINY_FONT);
  doc.setTextColor(...MUTED);
  doc.text("Status:", MARGIN + 6, iy);
  drawStatusBadge(doc, MARGIN + 22, iy, answerInfo.text, answerInfo.tone);
  iy += 12;

  if (ccwExplanation) {
    doc.setFontSize(TINY_FONT);
    doc.setTextColor(60, 60, 60);
    doc.text(ccwLine, MARGIN + 6, iy);
    iy += ccwLine.length * lh + 4;
  }
  if (notes) {
    doc.setFontSize(TINY_FONT);
    doc.setTextColor(60, 60, 60);
    doc.text(notesLine, MARGIN + 6, iy);
  }

  doc.setTextColor(0, 0, 0);
  return y + rowH + 5;
}

function drawSectionTableHeader(doc: jsPDF, y: number, title: string): number {
  y = addNewPageIfNeeded(doc, y, 14);
  doc.setFillColor(...SLATE_BG);
  doc.setDrawColor(...SLATE_BORDER);
  doc.setLineWidth(0.25);
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 11, 1.5, 1.5, "FD");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN + 5, y + 7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  return y + 14;
}

function applyFooters(doc: jsPDF, pageCount: number): void {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BRAND_GREEN);
    doc.setLineWidth(0.35);
    doc.line(MARGIN, PAGE_HEIGHT - 22, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 22);

    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(
      `ComplianceAstra · PCI DSS Assessment Report · Page ${i} of ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 15,
      { align: "center" },
    );
    doc.setFontSize(6.8);
    const year = new Date().getFullYear();
    doc.text(
      `© ${year} Dama AI LLC. All rights reserved.`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
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

  const saqLabel = SAQ_LABELS[result.saq];

  drawCoverPage(doc, generatedAt, saqLabel, {
    saqLabel,
    riskLevel,
    completionPct,
    scopeSummary,
  });

  // PAGE 2 — Scope + Top actions
  doc.addPage();
  let y = MARGIN;

  y = drawSectionHeading(doc, y, "1", "Assessment context");
  y = drawSubheading(doc, y, "Why this SAQ applies");
  y = writeBulletList(doc, result.why, y);
  y += SECTION_GAP - 2;

  y = drawSubheading(doc, y, "In scope");
  y = writeBulletList(doc, scopeInfo.inScope, y);
  y += 4;

  y = drawSubheading(doc, y, "Out of scope");
  y = writeBulletList(doc, scopeInfo.outOfScope, y);
  y += 4;

  y = drawSubheading(doc, y, "Key assumptions");
  y = writeBulletList(doc, scopeInfo.assumptions, y);
  y += SECTION_GAP;

  y = drawSectionHeading(doc, y, "2", "Top 5 actions to get compliant");
  y = drawTopActionsTable(doc, y, topActionCards.slice(0, 5));

  // PAGE 3+ — Full compliance checklist (structured rows)
  doc.addPage();
  y = MARGIN;

  y = drawSectionHeading(doc, y, "3", "Full compliance checklist");
  doc.setFontSize(SMALL_FONT);
  doc.setTextColor(...MUTED);
  doc.text(
    `Progress: ${completed} of ${totalItems} requirements (${completionPct}%). Each row lists the requirement reference, merchant question, status, and notes or evidence.`,
    MARGIN,
    y,
  );
  y += 12;

  for (const section of checklistDef.sections) {
    y = drawSectionTableHeader(doc, y, section.title);

    for (const item of section.items) {
      const state = checklistState[item.id];
      const answerInfo = answerToLabel(state?.answer);
      const notes = state?.notes?.trim() ? state.notes : "";
      const ccwExplanation = state?.ccw_explanation?.trim();

      y = drawChecklistTableRow(doc, y, item, answerInfo, notes, ccwExplanation);
    }
    y += 4;
  }

  const pageCount = doc.getNumberOfPages();
  applyFooters(doc, pageCount);

  const filename = `ComplianceAstra-PCI-Report-${saqLabel.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
