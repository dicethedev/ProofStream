import type { GraphSchema } from "../lib/graph";
import {
  STANDARDIZED_DEX_REGISTRY_URL,
  STANDARDIZED_DEX_SCHEMA,
  STANDARDIZED_DEX_SCHEMA_VERSION,
} from "../lib/standardizedDex";

export type DexPreset = {
  id: string;
  name: string;
  network: string;
  subgraphId: string;
  logoDomain: string;
  description: string;
  schema: GraphSchema;
  standard?: {
    name: string;
    registryUrl: string;
    version: string;
  };
  custom?: boolean;
};

export const DEX_PRESETS: DexPreset[] = [
  {
    id: "uniswap-v3-mainnet",
    name: "Uniswap V3",
    network: "Ethereum",
    subgraphId: "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
    logoDomain: "uniswap.org",
    description: "Best default. Recent swaps, pool activity, and wallet-origin queries.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-base",
    name: "Uniswap V3",
    network: "Base",
    subgraphId: "43Hwfi3dJSoGpyas9VwNoDAv55yjgGrPpNSmbQZArzMG",
    logoDomain: "uniswap.org",
    description: "Base swaps from a live Uniswap V3 deployment on The Graph.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-arbitrum",
    name: "Uniswap V3",
    network: "Arbitrum One",
    subgraphId: "FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
    logoDomain: "uniswap.org",
    description: "Arbitrum V3 swaps for lower-cost L2 activity demos.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-optimism",
    name: "Uniswap V3",
    network: "Optimism",
    subgraphId: "Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj",
    logoDomain: "uniswap.org",
    description: "Optimism swaps using the same V3-style schema.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-polygon",
    name: "Uniswap V3",
    network: "Polygon",
    subgraphId: "3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm",
    logoDomain: "uniswap.org",
    description: "Polygon swaps for high-volume DEX activity demos.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-bnb",
    name: "Uniswap V3",
    network: "BNB Chain",
    subgraphId: "G5MUbSBM7Nsrm9tH2tGQUiAF4SZDGf2qeo1xPLYjKr7K",
    logoDomain: "uniswap.org",
    description: "Live Uniswap V3 swap activity indexed from BNB Chain.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-celo",
    name: "Uniswap V3",
    network: "Celo",
    subgraphId: "ESdrTJ3twMwWVoQ1hUE2u7PugEHX3QkenudD6aXCkDQ4",
    logoDomain: "uniswap.org",
    description: "Celo swap activity from a verified V3-compatible schema.",
    schema: "uniswap-v3",
  },
  {
    id: "uniswap-v3-avalanche",
    name: "Uniswap V3",
    network: "Avalanche",
    subgraphId: "GVH9h9KZ9CqheUEL93qMbq7QwgoBu32QXQDPR6bev4Eo",
    logoDomain: "uniswap.org",
    description: "Avalanche swaps from The Graph decentralized network.",
    schema: "uniswap-v3",
  },
  {
    id: "sushiswap-v3-ethereum",
    name: "SushiSwap V3",
    network: "Ethereum",
    subgraphId: "2tGWMrDha4164KkFAfkU3rDCtuxGb4q1emXmFdLLzJ8x",
    logoDomain: "sushi.com",
    description: "Ethereum SushiSwap V3 swaps from The Graph Explorer.",
    schema: "sushiswap-v3",
  },
  {
    id: "aerodrome-base",
    name: "Aerodrome",
    network: "Base",
    subgraphId: "GENunSHWLBXm59mBSgPzQ8metBEp9YDfdqwFr91Av1UM",
    logoDomain: "aerodrome.finance",
    description: "High-volume Aerodrome swaps from its full Base subgraph.",
    schema: "uniswap-v3",
  },
  {
    id: "messari-sushiswap-ethereum",
    name: "SushiSwap (Standard)",
    network: "Ethereum",
    subgraphId: "77jZ9KWeyi3CJ96zkkj5s1CojKPHt6XJKjLFzsDCd8Fd",
    logoDomain: "sushi.com",
    description: "Messari DEX AMM 1.3.2. Shares one query contract with ApeSwap and Trader Joe.",
    schema: "messari-dex-amm",
    standard: {
      name: STANDARDIZED_DEX_SCHEMA,
      registryUrl: STANDARDIZED_DEX_REGISTRY_URL,
      version: STANDARDIZED_DEX_SCHEMA_VERSION,
    },
  },
  {
    id: "messari-apeswap-bsc",
    name: "ApeSwap (Standard)",
    network: "BNB Chain",
    subgraphId: "4u1aTvzBMjBdm7aK7uQmjffhoPc6Ceu3w2nTfq6vUQnb",
    logoDomain: "apeswap.finance",
    description: "Messari DEX AMM 1.3.2 on BNB Chain with the shared cross-protocol query.",
    schema: "messari-dex-amm",
    standard: {
      name: STANDARDIZED_DEX_SCHEMA,
      registryUrl: STANDARDIZED_DEX_REGISTRY_URL,
      version: STANDARDIZED_DEX_SCHEMA_VERSION,
    },
  },
  {
    id: "messari-trader-joe-avalanche",
    name: "Trader Joe (Standard)",
    network: "Avalanche",
    subgraphId: "H2VGe2tYavUEosSjomHwxbvCKy3LaNaW8Kjw2KhhHs1K",
    logoDomain: "lfj.gg",
    description: "Messari DEX AMM 1.3.2 on Avalanche with the shared cross-protocol query.",
    schema: "messari-dex-amm",
    standard: {
      name: STANDARDIZED_DEX_SCHEMA,
      registryUrl: STANDARDIZED_DEX_REGISTRY_URL,
      version: STANDARDIZED_DEX_SCHEMA_VERSION,
    },
  },
  {
    id: "custom",
    name: "Custom DEX",
    network: "Bring your own",
    subgraphId: "",
    logoDomain: "",
    description: "Paste any swaps-compatible subgraph ID from The Graph Explorer.",
    schema: "uniswap-v3",
    custom: true,
  },
];

export function dexLogoUrl(preset: DexPreset) {
  if (!preset.logoDomain) return "";

  return `https://www.google.com/s2/favicons?domain=${preset.logoDomain}&sz=128`;
}
