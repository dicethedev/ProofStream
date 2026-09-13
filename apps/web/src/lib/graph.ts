import {
  isStandardizedDexSwap,
  normalizeStandardizedDexSwap,
  standardizedDexQueryTemplate,
  type StandardizedDexSwap,
} from "./standardizedDex";

export type GraphFetchMode = "recent" | "pool" | "wallet";
export type GraphSchema = "messari-dex-amm" | "sushiswap-v3" | "uniswap-v3";

export type FetchGraphEventsInput = {
  apiKey: string;
  mode: GraphFetchMode;
  endpoint?: string;
  query: string;
  subgraphId: string;
  wallet: string;
  pool: string;
  schema: GraphSchema;
};

export type GraphFetchResult = {
  rows: string[];
  json: GraphResponse;
  endpoint: string;
  suggestedPool: string;
  suggestedWallet: string;
};

const RETRYABLE_ERROR_HINTS = ["Timeout", "too far behind", "BadResponse", "bad indexers"];

export async function fetchGraphEvents(input: FetchGraphEventsInput): Promise<GraphFetchResult> {
  const endpoint = graphEndpoint(input);

  if (!endpoint) {
    throw new Error("Paste a Graph API key and choose a subgraph before running the query.");
  }

  const request = graphRequest(input);
  const data = await fetchWithRetry(endpoint, request, input.apiKey);

  const swaps = data.data?.swaps ?? [];
  if (!swaps.length) {
    throw new Error("No live rows returned for this source. Try recent swaps or another address.");
  }

  return {
    endpoint,
    json: data,
    rows: normalizeGraphRows(data, input.schema),
    suggestedPool: swapPool(swaps[0]),
    suggestedWallet: swapWallet(swaps[0]),
  };
}

export function normalizeGraphRows(data: GraphResponse, schema: GraphSchema = "uniswap-v3"): string[] {
  return (data.data?.swaps ?? []).map((swap) => formatSwapRow(swap, schema));
}

export function queryTemplate(
  mode: GraphFetchMode,
  pool: string,
  schema: GraphSchema = "uniswap-v3",
): string {
  if (schema === "messari-dex-amm") {
    return standardizedDexQueryTemplate(mode, pool);
  }

  if (schema === "sushiswap-v3") {
    return sushiQueryTemplate(mode, pool);
  }

  if (mode === "wallet") {
    return `query ProofStreamWalletEvents($wallet: Bytes!) {
  swaps(
    first: 10
    orderBy: timestamp
    orderDirection: desc
    where: { origin: $wallet }
  ) {
${indent(SWAP_FIELDS.trim(), 4)}
  }
}`;
  }

  if (mode === "pool") {
    return `query ProofStreamPoolEvents {
  swaps(
    first: 10
    orderBy: timestamp
    orderDirection: desc
    where: { pool: "${pool.toLowerCase()}" }
  ) {
${indent(SWAP_FIELDS.trim(), 4)}
  }
}`;
  }

  return `query ProofStreamRecentEvents {
  swaps(
    first: 10
    orderBy: timestamp
    orderDirection: desc
  ) {
${indent(SWAP_FIELDS.trim(), 4)}
  }
}`;
}

export function graphEndpoint(input: Pick<FetchGraphEventsInput, "apiKey" | "endpoint" | "subgraphId">) {
  const endpoint = input.endpoint?.trim();
  const apiKey = input.apiKey.trim();
  const subgraphId = input.subgraphId.trim();

  if (!apiKey) return "";
  if (endpoint) {
    if (endpoint.includes("{subgraph-id}") || endpoint.includes("<subgraph-id>")) return "";

    return endpoint;
  }
  if (!subgraphId) return "";

  return graphEndpointTemplate(subgraphId);
}

export function graphEndpointTemplate(subgraphId: string) {
  return `https://gateway.thegraph.com/api/subgraphs/id/${subgraphId.trim() || "{subgraph-id}"}`;
}

function graphRequest(input: FetchGraphEventsInput): GraphRequest {
  const query = input.query.trim() || queryTemplate(input.mode, input.pool, input.schema);

  if (input.mode === "wallet") {
    assertHex(input.wallet, "wallet address");

    return {
      query,
      variables: { wallet: input.wallet.toLowerCase() },
    };
  }

  if (input.mode === "pool") {
    assertHex(input.pool, "pool address");
  }

  return { query };
}

async function fetchWithRetry(
  endpoint: string,
  request: GraphRequest,
  apiKey: string,
): Promise<GraphResponse> {
  const attempts = 3;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchGraphql(endpoint, request, apiKey);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown The Graph error.");

      if (!isRetryable(lastError.message) || attempt === attempts) {
        throw lastError;
      }

      await delay(700 * attempt);
    }
  }

  throw lastError ?? new Error("The Graph request failed.");
}

async function fetchGraphql(
  endpoint: string,
  request: GraphRequest,
  apiKey: string,
): Promise<GraphResponse> {
  const headers: Record<string, string> = { "content-type": "application/json" };

  if (apiKey.trim()) {
    headers.authorization = `Bearer ${apiKey.trim()}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`The Graph request failed with HTTP ${response.status}.`);
  }

  const data = await response.json() as GraphResponse;

  if (data.errors?.length) {
    throw new Error(humanizeGraphError(data.errors[0]?.message ?? "The Graph returned an error."));
  }

  return data;
}

function assertHex(value: string, label: string) {
  if (!/^0x[a-fA-F0-9]+$/.test(value.trim())) {
    throw new Error(`Enter a valid ${label}, starting with 0x.`);
  }
}

function isRetryable(message: string) {
  return RETRYABLE_ERROR_HINTS.some((hint) => message.includes(hint));
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatSwapRow(swap: GraphSwap, schema: GraphSchema) {
  if (schema === "messari-dex-amm") {
    if (!isStandardizedDexSwap(swap)) {
      throw new Error("The returned data does not match the Messari DEX AMM standard.");
    }

    return normalizeStandardizedDexSwap(swap);
  }

  if (schema === "sushiswap-v3" && isSushiSwap(swap)) {
    return [
      `swap:${swap.tokenIn.symbol}/${swap.tokenOut.symbol}`,
      swap.tokenIn.id ? `token0:${swap.tokenIn.id}` : "",
      swap.tokenOut.id ? `token1:${swap.tokenOut.id}` : "",
      `origin:${swap.account.id}`,
      `amount:${swap.amountIn}/-${swap.amountOut}`,
      `usd:${swap.amountInUSD || swap.amountOutUSD || "unknown"}`,
      `tx:${swap.hash}`,
      `block:${swap.blockNumber}`,
    ].filter(Boolean).join(" | ");
  }

  if (!isUniswapSwap(swap)) {
    throw new Error("The returned swap format does not match the selected DEX preset.");
  }

  return [
    `swap:${swap.token0.symbol}/${swap.token1.symbol}`,
    swap.token0.id ? `token0:${swap.token0.id}` : "",
    swap.token1.id ? `token1:${swap.token1.id}` : "",
    `origin:${swap.origin}`,
    `amount:${swap.amount0}/${swap.amount1}`,
    `usd:${swap.amountUSD ?? "unknown"}`,
    `tx:${swap.transaction.id}`,
    `block:${swap.transaction.blockNumber}`,
  ].filter(Boolean).join(" | ");
}

function swapPool(swap: GraphSwap | undefined) {
  return swap?.pool?.id ?? "";
}

function swapWallet(swap: GraphSwap | undefined) {
  if (!swap) return "";
  if (isStandardizedDexSwap(swap)) return swap.from;
  return isSushiSwap(swap) ? swap.account.id : swap.origin;
}

function isSushiSwap(swap: GraphSwap): swap is SushiGraphSwap {
  return "tokenIn" in swap;
}

function isUniswapSwap(swap: GraphSwap): swap is UniswapGraphSwap {
  return "token0" in swap;
}

function humanizeGraphError(message: string) {
  if (/type [`"]?Query[`"]? has no field [`"]?swaps/i.test(message)) {
    return "This subgraph does not expose a compatible swaps feed. Choose a verified preset or provide a swaps-compatible custom subgraph.";
  }

  if (/has no field/i.test(message)) {
    return "This subgraph uses a different data shape. Choose a verified preset so ProofStream can build the correct query automatically.";
  }

  return message;
}

function sushiQueryTemplate(mode: GraphFetchMode, pool: string) {
  let filter = "";
  if (mode === "wallet") {
    filter = "    where: { account: $wallet }\n";
  } else if (mode === "pool") {
    filter = `    where: { pool: "${pool.toLowerCase()}" }\n`;
  }
  const declaration = mode === "wallet" ? "($wallet: String!)" : "";

  return `query ProofStreamSushiEvents${declaration} {
  swaps(
    first: 10
    orderBy: timestamp
    orderDirection: desc
${filter}  ) {
${indent(SUSHI_SWAP_FIELDS.trim(), 4)}
  }
}`;
}

function indent(value: string, spaces: number) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}

const SWAP_FIELDS = `
  id
  sender
  recipient
  origin
  pool {
    id
  }
  amount0
  amount1
  amountUSD
  transaction {
    id
    blockNumber
  }
  token0 {
    id
    symbol
  }
  token1 {
    id
    symbol
  }
`;

const SUSHI_SWAP_FIELDS = `
  id
  hash
  account {
    id
  }
  pool {
    id
  }
  blockNumber
  amountIn
  amountOut
  amountInUSD
  amountOutUSD
  tokenIn {
    id
    symbol
  }
  tokenOut {
    id
    symbol
  }
`;

type GraphRequest = {
  query: string;
  variables?: Record<string, string>;
};

export type GraphResponse = {
  errors?: Array<{ message: string }>;
  data?: {
    swaps?: GraphSwap[];
  };
};

type UniswapGraphSwap = {
  id: string;
  sender: string;
  recipient: string;
  origin: string;
  pool?: { id: string };
  amount0: string;
  amount1: string;
  amountUSD?: string;
  transaction: {
    id: string;
    blockNumber: string;
  };
  token0: { id?: string; symbol: string };
  token1: { id?: string; symbol: string };
};

type SushiGraphSwap = {
  id: string;
  hash: string;
  account: { id: string };
  pool: { id: string };
  blockNumber: string;
  amountIn: string;
  amountOut: string;
  amountInUSD: string;
  amountOutUSD: string;
  tokenIn: { id?: string; symbol: string };
  tokenOut: { id?: string; symbol: string };
};

type GraphSwap = StandardizedDexSwap | SushiGraphSwap | UniswapGraphSwap;

export function graphSchemaUsesRawTokenUnits(schema: GraphSchema) {
  return schema === "messari-dex-amm" || schema === "sushiswap-v3";
}
