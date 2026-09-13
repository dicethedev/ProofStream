import type { GraphFetchMode } from "./graph";

/** Messari's shared schema family for automated market maker DEX data. */
export const STANDARDIZED_DEX_SCHEMA = "Messari DEX AMM";

/** Schema version shared by the bundled cross-protocol presets. */
export const STANDARDIZED_DEX_SCHEMA_VERSION = "1.3.2";

/** Registry used to source and audit the bundled standardized deployments. */
export const STANDARDIZED_DEX_REGISTRY_URL =
  "https://github.com/messari/subgraphs/blob/master/deployment/deployment.json";

export type StandardizedDexSwap = {
  id: string;
  hash: string;
  logIndex: number;
  protocol: {
    name: string;
    schemaVersion: string;
    slug: string;
  };
  to: string;
  from: string;
  blockNumber: string;
  timestamp: string;
  tokenIn: { id: string; symbol: string };
  amountIn: string;
  amountInUSD: string;
  tokenOut: { id: string; symbol: string };
  amountOut: string;
  amountOutUSD: string;
  pool: { id: string; name?: string; symbol?: string };
};

/**
 * Builds one query shape that works across Messari DEX AMM implementations.
 * Only the deployment ID changes between protocols and networks.
 */
export function standardizedDexQueryTemplate(mode: GraphFetchMode, pool: string) {
  let filter = "";
  if (mode === "wallet") {
    filter = "    where: { from: $wallet }\n";
  } else if (mode === "pool") {
    filter = `    where: { pool: "${pool.toLowerCase()}" }\n`;
  }
  const declaration = mode === "wallet" ? "($wallet: String!)" : "";

  return `query ProofStreamStandardDexEvents${declaration} {
  swaps(
    first: 10
    orderBy: timestamp
    orderDirection: desc
${filter}  ) {
${indent(STANDARDIZED_SWAP_FIELDS.trim(), 4)}
  }
}`;
}

/** Converts a shared-schema swap into ProofStream's canonical receipt row. */
export function normalizeStandardizedDexSwap(swap: StandardizedDexSwap) {
  return [
    `swap:${swap.tokenIn.symbol}/${swap.tokenOut.symbol}`,
    `token0:${swap.tokenIn.id}`,
    `token1:${swap.tokenOut.id}`,
    `origin:${swap.from}`,
    `amount:${swap.amountIn}/-${swap.amountOut}`,
    `usd:${swap.amountInUSD || swap.amountOutUSD || "unknown"}`,
    `tx:${swap.hash}`,
    `block:${swap.blockNumber}`,
    `protocol:${swap.protocol.slug}`,
    `schema:${swap.protocol.schemaVersion}`,
  ].join(" | ");
}

export function isStandardizedDexSwap(value: unknown): value is StandardizedDexSwap {
  if (!value || typeof value !== "object") return false;

  const swap = value as Partial<StandardizedDexSwap>;
  return Boolean(
    swap.protocol
      && swap.tokenIn
      && swap.tokenOut
      && typeof swap.from === "string"
      && typeof swap.hash === "string",
  );
}

const STANDARDIZED_SWAP_FIELDS = `
  id
  hash
  logIndex
  protocol {
    name
    slug
    schemaVersion
  }
  to
  from
  blockNumber
  timestamp
  tokenIn {
    id
    symbol
  }
  amountIn
  amountInUSD
  tokenOut {
    id
    symbol
  }
  amountOut
  amountOutUSD
  pool {
    id
    name
    symbol
  }
`;

function indent(value: string, spaces: number) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}
