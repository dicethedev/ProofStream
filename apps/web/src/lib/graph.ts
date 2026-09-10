export type GraphFetchMode = "recent" | "pool" | "wallet";

export type FetchGraphEventsInput = {
  apiKey: string;
  mode: GraphFetchMode;
  endpoint?: string;
  query: string;
  subgraphId: string;
  wallet: string;
  pool: string;
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
    rows: normalizeGraphRows(data),
    suggestedPool: swaps[0]?.pool?.id ?? "",
    suggestedWallet: swaps[0]?.origin ?? "",
  };
}

export function normalizeGraphRows(data: GraphResponse): string[] {
  return (data.data?.swaps ?? []).map(formatSwapRow);
}

export function queryTemplate(mode: GraphFetchMode, pool: string): string {
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
  const query = input.query.trim() || queryTemplate(input.mode, input.pool);

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
    throw new Error(data.errors[0]?.message ?? "The Graph returned an error.");
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

function formatSwapRow(swap: GraphSwap) {
  return [
    `swap:${swap.token0.symbol}/${swap.token1.symbol}`,
    `origin:${swap.origin}`,
    `amount:${swap.amount0}/${swap.amount1}`,
    `usd:${swap.amountUSD ?? "unknown"}`,
    `tx:${swap.transaction.id}`,
    `block:${swap.transaction.blockNumber}`,
  ].join(" | ");
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
    symbol
  }
  token1 {
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

type GraphSwap = {
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
  token0: { symbol: string };
  token1: { symbol: string };
};
