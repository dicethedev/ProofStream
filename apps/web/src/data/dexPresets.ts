export type DexPreset = {
  id: string;
  name: string;
  network: string;
  subgraphId: string;
  logoDomain: string;
  description: string;
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
  },
  {
    id: "uniswap-v3-base",
    name: "Uniswap V3",
    network: "Base",
    subgraphId: "43Hwfi3dJSoGpyas9VwNoDAv55yjgGrPpNSmbQZArzMG",
    logoDomain: "uniswap.org",
    description: "Base swaps from a live Uniswap V3 deployment on The Graph.",
  },
  {
    id: "uniswap-v3-arbitrum",
    name: "Uniswap V3",
    network: "Arbitrum One",
    subgraphId: "Fo8QBLpEGfXHWkGMD3jSM4vVLk4JxvxxQD3v3U4fsrbh",
    logoDomain: "uniswap.org",
    description: "Arbitrum V3 swaps for lower-cost L2 activity demos.",
  },
  {
    id: "uniswap-v3-optimism",
    name: "Uniswap V3",
    network: "Optimism",
    subgraphId: "49LkWjoVKd3bM9ZrMdFgYkjaCuVj4ExZttQi6XfbcPpG",
    logoDomain: "uniswap.org",
    description: "Optimism swaps using the same V3-style schema.",
  },
  {
    id: "uniswap-v3-polygon",
    name: "Uniswap V3",
    network: "Polygon",
    subgraphId: "5KKEX1Czc4eP3KA13ivn6dDARaG6NkotHMabwK8k32Px",
    logoDomain: "uniswap.org",
    description: "Polygon swaps for high-volume DEX activity demos.",
  },
  {
    id: "sushiswap-v3-ethereum",
    name: "SushiSwap V3",
    network: "Ethereum",
    subgraphId: "2tGWMrDha4164KkFAfkU3rDCtuxGb4q1emXmFdLLzJ8x",
    logoDomain: "sushi.com",
    description: "Ethereum SushiSwap V3 swaps from The Graph Explorer.",
  },
  {
    id: "pancakeswap-v3-ethereum",
    name: "PancakeSwap V3",
    network: "Ethereum",
    subgraphId: "9opY17WnEPD4REcC43yHycQthSeUMQE26wyoeMjZTLEx",
    logoDomain: "pancakeswap.finance",
    description: "Ethereum PancakeSwap V3 swaps using a Uniswap-style schema.",
  },
  {
    id: "pancakeswap-v3-bnb",
    name: "PancakeSwap V3",
    network: "BNB Chain",
    subgraphId: "78EUqzJmEVJsAKvWghn7qotf9LVGqcTQxJhT5z84ZmgJ",
    logoDomain: "pancakeswap.finance",
    description: "BNB Chain V3 swaps for testing another DEX network.",
  },
  {
    id: "custom",
    name: "Custom DEX",
    network: "Bring your own",
    subgraphId: "",
    logoDomain: "",
    description: "Paste any swaps-compatible subgraph ID from The Graph Explorer.",
    custom: true,
  },
];

export function dexLogoUrl(preset: DexPreset) {
  if (!preset.logoDomain) return "";

  return `https://www.google.com/s2/favicons?domain=${preset.logoDomain}&sz=128`;
}
