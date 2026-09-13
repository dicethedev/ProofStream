import { graphSchemaUsesRawTokenUnits, type GraphSchema } from "../lib/graph";
import type { BrowserProof } from "../lib/merkle";
import { resolveTokenAsset } from "../lib/tokenAssets";
import {
  exactUsdLabel,
  formatTokenAmounts,
  formatUsd,
} from "./activityFormat";
import type { ReceiptRow } from "./receiptRows";

export type ReceiptExport = {
  activity: ReceiptRow;
  network: string;
  proof: BrowserProof;
  rowCount: number;
  rowIndex: number;
  schema: GraphSchema;
  valid: boolean;
};

export function downloadReceiptJson(receipt: ReceiptExport) {
  const content = {
    format: "proofstream-receipt/v1",
    createdAt: new Date().toISOString(),
    result: receipt.valid ? "verified" : "rejected",
    dataset: {
      root: receipt.proof.root,
      rowCount: receipt.rowCount,
    },
    selectedActivity: {
      index: receipt.rowIndex,
      ...receipt.activity,
    },
    proof: {
      leafHash: receipt.proof.leafHash,
      helperHashes: receipt.proof.siblings,
    },
  };

  downloadBlob(
    JSON.stringify(content, null, 2),
    `proofstream-receipt-row-${receipt.rowIndex}.json`,
    "application/json",
  );
}

export async function downloadReceiptPdf(receipt: ReceiptExport) {
  const { jsPDF } = await import("jspdf");
  const [token0, token1] = await Promise.all([
    resolveTokenAsset(
      receipt.network,
      receipt.activity.token0Address,
      receipt.activity.token0Symbol,
    ),
    resolveTokenAsset(
      receipt.network,
      receipt.activity.token1Address,
      receipt.activity.token1Symbol,
    ),
  ]);
  const [token0Image, token1Image] = await Promise.all([
    loadPdfImage(token0?.logoURI),
    loadPdfImage(token1?.logoURI),
  ]);
  const tokenAmounts = formatTokenAmounts({
    amount: receipt.activity.amount,
    decimals0: token0?.decimals,
    decimals1: token1?.decimals,
    name0: token0?.name,
    name1: token1?.name,
    rawUnits: graphSchemaUsesRawTokenUnits(receipt.schema),
    symbol0: receipt.activity.token0Symbol,
    symbol1: receipt.activity.token1Symbol,
  });
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const left = 54;
  const width = 487;
  const result = receipt.valid ? "VERIFIED" : "REJECTED";

  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, 595, 106, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text("ProofStream receipt", left, 48);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("A readable record of one DEX activity checked against a sealed dataset.", left, 72);

  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(`BROWSER RESULT  /  ${result}`, left, 137);
  drawTokenBadge(pdf, left, 158, receipt.activity.token0Symbol, token0Image);
  drawTokenBadge(pdf, left + 27, 158, receipt.activity.token1Symbol, token1Image);
  pdf.setFontSize(20);
  pdf.text(receipt.activity.pair.replace("/", " / "), left + 76, 180);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(83, 83, 97);
  pdf.text(`${receipt.network}  /  Activity #${receipt.rowIndex + 1}`, left + 76, 197);

  pdf.setFillColor(244, 244, 247);
  pdf.roundedRect(left, 220, width, 68, 12, 12, "F");
  drawSummary(pdf, left + 18, 243, "DATASET", `${receipt.rowCount} activities`);
  drawSummary(pdf, left + 174, 243, "SELECTED", `Row #${receipt.rowIndex}`);
  drawSummary(pdf, left + 330, 243, "INDEXED VALUE", formatUsd(receipt.activity.usd));

  let y = 324;
  y = drawFact(
    pdf,
    left,
    width,
    y,
    "Token amounts",
    tokenAmounts.display.replace("↔", "/"),
  );
  y = drawFact(pdf, left, width, y, "Transaction origin", receipt.activity.origin);
  y = drawFact(pdf, left, width, y, "Transaction / block", `${receipt.activity.tx}  /  ${receipt.activity.block}`);

  pdf.setFillColor(244, 244, 247);
  pdf.roundedRect(left, y + 8, width, 96, 12, 12, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("What this receipt means", left + 18, y + 34);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    pdf.splitTextToSize(
      receipt.valid
        ? "The selected activity matches the receipt and belongs to the exact dataset represented by the public root."
        : "The activity does not reproduce the public root, so the claim was rejected.",
      width - 36,
    ),
    left + 18,
    y + 55,
  );
  pdf.text(
    pdf.splitTextToSize("This receipt does not independently prove that the upstream indexer interpreted the blockchain correctly.", width - 36),
    left + 18,
    y + 79,
  );

  const exactY = y + 124;
  pdf.setDrawColor(213, 213, 226);
  pdf.roundedRect(left, exactY, width, 116, 12, 12, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Exact source values", left + 18, exactY + 25);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(83, 83, 97);
  pdf.text(
    pdf.splitTextToSize(`Indexed value: ${exactUsdLabel(receipt.activity.usd)}`, width - 36),
    left + 18,
    exactY + 47,
  );
  pdf.text(
    pdf.splitTextToSize(tokenAmounts.detail, width - 36),
    left + 18,
    exactY + 67,
  );

  pdf.setFontSize(8);
  pdf.setTextColor(83, 83, 97);
  pdf.text(`Dataset reference: ${shortHash(receipt.proof.root)}`, left, 790);
  pdf.text(`Created ${new Date().toLocaleString()}`, left, 806);
  pdf.save(`proofstream-receipt-row-${receipt.rowIndex}.pdf`);
}

function drawSummary(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  x: number,
  y: number,
  label: string,
  value: string,
) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(138, 138, 153);
  pdf.text(label, x, y);
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(value, x, y + 19);
}

function drawFact(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  left: number,
  width: number,
  y: number,
  label: string,
  value: string,
) {
  const lines = pdf.splitTextToSize(value, 315) as string[];
  const rowHeight = Math.max(42, lines.length * 13 + 18);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(83, 83, 97);
  pdf.text(label, left, y);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  pdf.text(lines, left + 145, y);
  pdf.setDrawColor(213, 213, 226);
  pdf.line(left, y + rowHeight - 18, left + width, y + rowHeight - 18);
  return y + rowHeight;
}

function drawTokenBadge(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  x: number,
  y: number,
  symbol: string,
  image: PdfImage | null,
) {
  const size = 38;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(213, 213, 226);
  pdf.circle(x + size / 2, y + size / 2, size / 2, "FD");

  if (image) {
    pdf.addImage(image.dataUrl, image.format, x + 3, y + 3, size - 6, size - 6);
    return;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(0, 0, 0);
  pdf.text(symbol.slice(0, 4).toUpperCase(), x + size / 2, y + 22, { align: "center" });
}

type PdfImage = {
  dataUrl: string;
  format: "JPEG" | "PNG";
};

async function loadPdfImage(url?: string): Promise<PdfImage | null> {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const format = blob.type.includes("png")
      ? "PNG"
      : blob.type.includes("jpeg") || blob.type.includes("jpg")
        ? "JPEG"
        : null;
    if (!format) return null;

    return { dataUrl: await blobToDataUrl(blob), format };
  } catch {
    return null;
  }
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(blob);
  });
}

function downloadBlob(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function shortHash(value: string) {
  if (value.length <= 28) return value;
  return `${value.slice(0, 16)}...${value.slice(-10)}`;
}
