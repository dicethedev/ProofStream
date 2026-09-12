export type TokenAsset = {
  address: string;
  decimals?: number;
  logoURI?: string;
  name?: string;
  symbol: string;
};

type TokenListResponse = {
  tokens?: TokenAsset[];
};

const NETWORK_SLUGS: Record<string, string> = {
  "Arbitrum One": "arbitrum-one",
  Avalanche: "avalanche",
  Base: "base",
  "BNB Chain": "binance-smart-chain",
  Celo: "celo",
  Ethereum: "ethereum",
  Optimism: "optimistic-ethereum",
  Polygon: "polygon-pos",
};

const tokenListCache = new Map<string, Promise<TokenAsset[]>>();

export async function resolveTokenAsset(network: string, address: string, symbol: string) {
  const slug = NETWORK_SLUGS[network];
  if (!slug) return null;

  try {
    const tokens = await loadTokenList(slug);
    const normalizedAddress = address.trim().toLowerCase();
    const normalizedSymbol = symbol.trim().toLowerCase();
    const exactToken = normalizedAddress
      ? tokens.find((token) => token.address.toLowerCase() === normalizedAddress)
      : undefined;
    const symbolToken = tokens.find(
      (token) => token.symbol.toLowerCase() === normalizedSymbol && token.logoURI,
    );

    return exactToken ?? symbolToken ?? null;
  } catch {
    return null;
  }
}

function loadTokenList(slug: string) {
  const cached = tokenListCache.get(slug);
  if (cached) return cached;

  const request = fetch(`https://tokens.coingecko.com/${slug}/all.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Token list returned HTTP ${response.status}`);
      return response.json() as Promise<TokenListResponse>;
    })
    .then((response) => response.tokens ?? []);

  tokenListCache.set(slug, request);
  return request;
}
