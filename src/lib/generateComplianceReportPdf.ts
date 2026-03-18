import { jsPDF } from "jspdf";
import type { SaqType } from "@/components/assessment/checklist-data";
import type { ChecklistDefinition, ChecklistSection } from "@/components/assessment/checklist-data";
import { SAQ_LABELS } from "@/components/assessment/report-data";

const MARGIN = 20;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 6;
const SECTION_GAP = 10;
const HEADING_FONT = 14;
const BODY_FONT = 10;
const SMALL_FONT = 9;

type ScopeInfo = {
  inScope: string[];
  outOfScope: string[];
  assumptions: string[];
};

type ReportInput = {
  result: {
    saq: SaqType;
    title: string;
    why: string[];
    summary: string;
    estimateLabel: string;
  };
  scopeInfo: ScopeInfo;
  riskLevel: string;
  topActions: string[];
  checklistDef: ChecklistDefinition;
  checklistState: Record<
    string,
    { answer: "in_place" | "not_applicable" | "action_needed" | null; notes: string }
  >;
  completed: number;
  totalItems: number;
};

function addNewPageIfNeeded(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function writeWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (LINE_HEIGHT * (fontSize / 10));
}

function writeSectionHeading(doc: jsPDF, title: string, y: number): number {
  let currentY = addNewPageIfNeeded(doc, y, 15);
  doc.setFontSize(HEADING_FONT);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, currentY);
  currentY += LINE_HEIGHT + 4;
  doc.setFont("helvetica", "normal");
  return currentY;
}

function writeBulletList(doc: jsPDF, items: string[], y: number): number {
  let currentY = y;
  doc.setFontSize(BODY_FONT);
  for (const item of items) {
    currentY = addNewPageIfNeeded(doc, currentY, LINE_HEIGHT + 2);
    doc.text(`• ${item}`, MARGIN + 4, currentY);
    const lines = doc.splitTextToSize(item, CONTENT_WIDTH - 12);
    currentY += Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT) + 2;
  }
  return currentY;
}

export function generateComplianceReportPdf(input: ReportInput): void {
  const doc = new jsPDF();
  const {
    result,
    scopeInfo,
    riskLevel,
    topActions,
    checklistDef,
    checklistState,
    completed,
    totalItems,
  } = input;

  let y = MARGIN;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Your PCI DSS Compliance Report", MARGIN, y);
  y += LINE_HEIGHT + 4;
  doc.setFontSize(BODY_FONT);
  doc.setFont("helvetica", "normal");
  y = writeWrappedText(
    doc,
    "Based on your answers, here is your complete compliance plan.",
    MARGIN,
    y,
    CONTENT_WIDTH,
    BODY_FONT,
  );
  y += SECTION_GAP + 4;

  // SAQ Summary
  y = writeSectionHeading(doc, "1. SAQ Summary", y);
  doc.setFontSize(BODY_FONT);
  doc.text(`SAQ Type: ${SAQ_LABELS[result.saq]}`, MARGIN, y);
  y += LINE_HEIGHT;
  doc.text(`Risk Level: ${riskLevel}`, MARGIN, y);
  y += LINE_HEIGHT + 4;
  doc.text("Why this applies:", MARGIN, y);
  y += LINE_HEIGHT;
  y = writeBulletList(doc, result.why, y);
  y += SECTION_GAP;

  // Scope Summary
  y = writeSectionHeading(doc, "2. Scope Summary", y);
  doc.text("In scope:", MARGIN, y);
  y += LINE_HEIGHT;
  y = writeBulletList(doc, scopeInfo.inScope, y);
  y += 4;
  doc.text("Out of scope:", MARGIN, y);
  y += LINE_HEIGHT;
  y = writeBulletList(doc, scopeInfo.outOfScope, y);
  y += 4;
  doc.text("Key assumptions:", MARGIN, y);
  y += LINE_HEIGHT;
  y = writeBulletList(doc, scopeInfo.assumptions, y);
  y += SECTION_GAP;

  // Checklist Overview
  y = writeSectionHeading(doc, "3. Checklist Overview", y);
  doc.text(
    `Progress: ${completed} of ${totalItems} complete (${totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0}%)`,
    MARGIN,
    y,
  );
  y += LINE_HEIGHT + 4;
  doc.text("Categories:", MARGIN, y);
  y += LINE_HEIGHT;
  const categoryNames = checklistDef.sections.map((s) => s.title);
  y = writeBulletList(doc, categoryNames, y);
  y += SECTION_GAP;

  // Top 5 Actions
  y = writeSectionHeading(doc, "4. Top 5 actions to get compliant", y);
  topActions.forEach((action, i) => {
    y = addNewPageIfNeeded(doc, y, LINE_HEIGHT * 2);
    doc.text(`${i + 1}. ${action}`, MARGIN, y);
    const lines = doc.splitTextToSize(action, CONTENT_WIDTH - 8);
    y += Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT) + 2;
  });
  y += SECTION_GAP;

  // Full checklist
  y = writeSectionHeading(doc, "5. Full compliance checklist", y);
  doc.setFontSize(SMALL_FONT);

  for (const section of checklistDef.sections) {
    y = addNewPageIfNeeded(doc, y, 20);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, MARGIN, y);
    y += LINE_HEIGHT + 2;
    doc.setFont("helvetica", "normal");

    for (const item of section.items) {
      const state = checklistState[item.id];
      const answer = state?.answer ?? "—";
      const answerLabel =
        answer === "in_place"
          ? "In Place"
          : answer === "not_applicable"
            ? "Not Applicable"
            : answer === "action_needed"
              ? "Action Needed"
              : "—";
      const notes = state?.notes?.trim() ? state.notes : "";

      y = addNewPageIfNeeded(doc, y, LINE_HEIGHT * 4);
      doc.text(item.label, MARGIN + 2, y);
      y += LINE_HEIGHT;
      doc.setFontSize(8);
      doc.text(`PCI Ref: ${item.pciRef}`, MARGIN + 2, y);
      y += LINE_HEIGHT;
      doc.text(`Status: ${answerLabel}`, MARGIN + 2, y);
      y += LINE_HEIGHT;
      if (notes) {
        const noteLines = doc.splitTextToSize(notes, CONTENT_WIDTH - 4);
        doc.text(noteLines, MARGIN + 2, y);
        y += noteLines.length * (LINE_HEIGHT * 0.9);
      }
      y += 4;
      doc.setFontSize(SMALL_FONT);
    }
    y += 6;
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `ComplianceAstra · PCI DSS Compliance Report · Page ${i} of ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: "center" },
    );
    doc.text(
      "This report is for guidance only. Confirm final obligations with your acquirer or QSA.",
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 6,
      { align: "center" },
    );
    doc.setTextColor(0, 0, 0);
  }

  const filename = `ComplianceAstra-PCI-Report-${SAQ_LABELS[result.saq].replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
