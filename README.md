# MerkleForge ProofStream

> Live blockchain data, backed by cryptographic proof receipts.

ProofStream is a hackathon project built on top of
[MerkleForge Framework](https://github.com/dicethedev/MerkleForge). It turns
indexed DEX activity from The Graph into compact Merkle receipts, so a user,
wallet, dashboard, or AI agent can verify one record without trusting the
server that returned it.

## The Problem

Most blockchain apps depend on indexed API data:

> "This wallet made this swap."  
> "This pool produced these recent events."  
> "This dashboard result came from live chain activity."

That is useful, but the user still has to trust the backend response. ProofStream
adds a verification layer: the app returns the row, the dataset root, and a tiny
proof path. The client can then check the claim locally.

## What ProofStream Does

- Fetches live DEX swap data from The Graph.
- Converts raw JSON into readable receipt rows.
- Commits the row list into a Merkle root using MerkleForge.
- Produces a proof for one selected row.
- Verifies that proof in the browser with no database access.
- Lets users tamper with the row and see verification fail immediately.

## Why It Matters

ProofStream is a practical demo of stateless verification for API-driven
blockchain apps. Instead of asking users to blindly trust an indexer, it shows
how API responses can carry cryptographic evidence.

This is useful for:

- wallets checking activity summaries
- dashboards proving displayed market data
- AI agents consuming blockchain API responses
- light clients that cannot store full datasets
- data providers that want verifiable API responses

## Live Demo Flow

1. Paste a Graph Gateway API key.
2. Choose a DEX preset, such as Uniswap V3 or PancakeSwap V3.
3. Run a live swaps query.
4. Inspect the raw GraphQL JSON result.
5. Convert JSON into human-readable rows.
6. Pick one row to verify.
7. Open the receipt tab and check the proof result.
8. Use **Tamper test** to change the row and watch verification reject it.

## How It Works

```text
The Graph subgraph
      ↓
Live DEX swap JSON
      ↓
Readable event rows
      ↓
MerkleForge BinaryMerkleTree<Keccak256>
      ↓
Dataset root + selected-row proof
      ↓
Browser verifies the receipt statelessly
```

The important idea: the client does not need the full dataset. It only needs the
selected row, the Merkle root, and the sibling hashes in the proof path.

## Key Features

- **Graph-powered live data** — pulls indexed DEX swaps from The Graph Gateway.
- **DEX presets** — includes Uniswap V3, SushiSwap V3, and PancakeSwap V3
  presets across multiple networks.
- **Custom subgraph support** — paste any swaps-compatible subgraph ID.
- **API key privacy** — API keys are kept only in browser memory and sent as an
  `Authorization: Bearer ...` header.
- **Readable dataset view** — raw JSON becomes simple rows people can inspect.
- **Proof receipt view** — explains claim, proof, and decision in plain language.
- **Tamper testing** — edit a claim and watch proof verification fail.
- **Rust proof engine** — backend/core proof packet generation uses MerkleForge.

## Repository Structure

```text
merkleforge-proofstream/
├── apps/
│   └── web/
│       ├── src/components/          # React UI sections
│       ├── src/components/proof-lab # Query, dataset, receipt, guide components
│       ├── src/data/                # DEX presets and UI copy
│       ├── src/lib/                 # Graph adapter and Merkle proof logic
│       └── src/utils/               # Formatting and row parsing helpers
├── crates/
│   └── proofstream-core/
│       └── src/                     # Rust proof packet implementation
├── .env.example
├── Cargo.toml
└── package.json
```

## Implementation Map

| Area | File | What to Review |
|---|---|---|
| React app entry | `apps/web/src/App.tsx` | Page composition |
| Hero section | `apps/web/src/components/Header.tsx` | Project positioning and CTA |
| Proof playground coordinator | `apps/web/src/components/ProofLab.tsx` | Main state, query flow, proof flow |
| Graph adapter | `apps/web/src/lib/graph.ts` | The Graph endpoint, query templates, retry handling |
| Browser proof logic | `apps/web/src/lib/merkle.ts` | In-browser Merkle proof generation and verification |
| DEX presets | `apps/web/src/data/dexPresets.ts` | Supported Graph subgraphs |
| Dataset UI | `apps/web/src/components/proof-lab/DatasetPanel.tsx` | Human-readable row view |
| Receipt UI | `apps/web/src/components/proof-lab/ReceiptPanel.tsx` | Plain-language verification result |
| Guided overlay | `apps/web/src/components/proof-lab/GuideOverlay.tsx` | Step-by-step demo guidance |
| Rust proof core | `crates/proofstream-core/src/lib.rs` | MerkleForge-backed proof packet generation |
| Rust CLI demo | `crates/proofstream-core/src/main.rs` | JSON proof packet output |

## Quick Start

Install dependencies:

```bash
npm install
```

Run the web demo:

```bash
npm run dev
```

Run the Rust proof engine:

```bash
cargo run -p proofstream-core
```

Run tests:

```bash
cargo test
```

Build the web app:

```bash
npm run build
```

## Live Data Setup

Copy the example environment file:

```bash
cp .env.example apps/web/.env.local
```

Then open the app and paste a Graph Gateway API key into the UI.

ProofStream does **not** store the API key in local storage, session storage, or
environment output. It stays in React state while the page is open and is sent
only as an authorization header when running a query.

Visible query URLs use this form:

```text
https://gateway.thegraph.com/api/subgraphs/id/{subgraph_id}
```

## Supported Demo Sources

The current playground includes presets for:

- Uniswap V3 on Ethereum
- Uniswap V3 on Base
- Uniswap V3 on Arbitrum One
- Uniswap V3 on Optimism
- Uniswap V3 on Polygon
- SushiSwap V3 on Ethereum
- PancakeSwap V3 on Ethereum
- PancakeSwap V3 on BNB Chain
- Custom DEX subgraph ID

The query modes are:

- **Recent swaps** — safest demo mode; fetches latest swaps.
- **Pool feed** — filters by one pool address.
- **Wallet activity** — filters by swap origin wallet.

After a successful query, ProofStream auto-fills the pool and wallet inputs from
the first returned swap so judges can quickly test the other modes.

## Security And Data Notes

- This is a hackathon proof-of-concept, not a trading tool.
- Live rows come from The Graph and its indexers.
- ProofStream verifies dataset membership for the returned rows; it does not
  claim the subgraph itself is canonical Ethereum consensus.
- API keys are not persisted by the app.
- The browser proof demo is intentionally transparent so judges can inspect the
  data, receipt, root, and helper hashes.

## Built On MerkleForge

The Rust proof engine uses:

- `merkle-core`
- `merkleforge-hash`
- `merkle-variants`

The browser demo mirrors the same idea in TypeScript so users can see the proof
flow live without running a backend.

## Hackathon Direction

ProofStream is designed to show how verifiable API responses can become normal
developer infrastructure. The current version focuses on live DEX activity and
browser receipts. Natural next steps include:

- API endpoint for proof packets
- agent-readable proof tools
- onchain root anchoring
- support for more subgraph schemas
- downloadable/shareable receipt format

## Judge Review Checklist

- Open the web demo and read the intro modal.
- Query live DEX data from The Graph.
- Confirm JSON appears in the query panel.
- Convert JSON to readable dataset rows.
- Select a row and verify the receipt.
- Tamper with the selected row and confirm the proof rejects it.
- Inspect `apps/web/src/lib/merkle.ts` for browser proof logic.
- Inspect `crates/proofstream-core/src/lib.rs` for Rust/MerkleForge proof packet generation.
