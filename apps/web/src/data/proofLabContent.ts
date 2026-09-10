import type { GraphFetchMode } from "../lib/graph";

export const SAMPLE_ROWS = [
  "tx:alice->bob:100",
  "tx:bob->carol:50",
  "tx:carol->dave:25",
  "tx:dave->erin:10",
].join("\n");

export const DEFAULT_STABLE_POOL = "0x7858e59e0c01ea06df3af3d20ac7b0003275d4bf";

export type LabTab = "query" | "dataset" | "receipt";

export const LAB_TABS: Array<{ id: LabTab; label: string }> = [
  { id: "query", label: "Query" },
  { id: "dataset", label: "Dataset" },
  { id: "receipt", label: "Receipt" },
];

export const SOURCE_OPTIONS: Array<{
  mode: GraphFetchMode;
  title: string;
  description: string;
}> = [
  {
    mode: "recent",
    title: "Recent swaps",
    description: "Best for live demos. Pulls the newest rows from the selected DEX subgraph.",
  },
  {
    mode: "pool",
    title: "Pool feed",
    description: "Prove activity from one pool, such as USDC/USDT or any pool address you paste.",
  },
  {
    mode: "wallet",
    title: "Wallet activity",
    description: "Prove rows connected to one transaction origin wallet.",
  },
];

export const JUDGE_CARDS = [
  {
    label: "In normal words",
    value: "ProofStream turns one swap row into a receipt: this row was inside that sealed list.",
  },
  {
    label: "What stays private",
    value: "The client does not need every swap row. It only needs the claim and proof.",
  },
  {
    label: "Who can use it",
    value: "Wallets, dashboards, AI agents, and light clients can verify data quickly.",
  },
];

export const RECEIPT_BREAKDOWN = [
  {
    label: "Sealed list",
    value: "All rows",
    text: "Every fetched row is folded into one public fingerprint.",
  },
  {
    label: "Receipt",
    value: "One row + proof",
    text: "The user receives only the row they care about and a few helper hashes.",
  },
  {
    label: "Check",
    value: "Match root",
    text: "If the client rebuilds the same fingerprint, the receipt is genuine.",
  },
];
