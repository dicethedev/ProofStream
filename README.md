# ProofStream

> Turn live DEX activity into a proof receipt anyone can inspect and verify.

ProofStream fetches indexed swap activity from
[The Graph](https://thegraph.com/), turns the response into readable rows, and
uses [MerkleForge Framework](https://github.com/dicethedev/MerkleForge) to seal
the dataset with a Merkle root. A user can then verify one selected activity in
the browser using only that row and its compact proof.

This repository contains an interactive React proof lab and a Rust proof engine.

## The Idea

Blockchain applications often show data returned by an indexer or API. The data
may be useful, but the person reading it still has to trust the server that
presented it. ProofStream adds a portable receipt to the response:

```text
The Graph JSON -> readable DEX rows -> Merkle root -> selected-row proof -> local verification
```

The full dataset can stay with the data provider. A client only needs:

- the activity row being checked
- the public dataset root
- the row index
- the helper hashes in the Merkle proof

## What A Receipt Proves

| A valid receipt proves | It does not prove |
|---|---|
| The selected row belongs to the exact sealed dataset. | The Graph indexer interpreted the blockchain correctly. |
| The row has not changed since the receipt was created. | The swap was profitable, safe, or approved by ProofStream. |
| The browser can reproduce the published root without the full dataset. | The current demo root was anchored onchain or signed by a trusted publisher. |

The current demo creates and verifies the root locally so the entire mechanism
is visible. A production integration can sign the root, publish it through an
API, or anchor it onchain.

## What You Can Do

- Query recent swaps, one pool, or activity associated with a wallet origin.
- Choose a ready-to-query DEX preset or supply a compatible subgraph ID.
- Inspect and edit both the GraphQL request and raw JSON response.
- Convert nested JSON into readable activity cards.
- See token logos, formatted values, and exact values on hover.
- Select any returned row and create a compact Merkle proof receipt.
- Verify the receipt locally, without access to the original tree or database.
- Change the selected row and watch the same proof be rejected.
- Inspect roots, hashes, and proof directions in the developer details.
- Download a structured JSON receipt or a plain-language PDF receipt.
- Copy a preset's subgraph ID or open it in Graph Explorer.

Token artwork is loaded for presentation only. Logos and display formatting do
not change the canonical row data or any cryptographic hash.

## Quick Start

### Requirements

- Node.js and npm compatible with Vite 7
- Rust 1.97.1 for the Rust proof engine
- A Graph Gateway API key for live queries

### Run The Web App

```bash
git clone https://github.com/dicethedev/ProofStream.git
cd ProofStream
npm install
npm run dev
```

Open the local URL printed by Vite. The proof lab is also available directly at
`http://localhost:5173/#/proof-lab`.

Create or manage a Graph Gateway API key in
[Subgraph Studio](https://thegraph.com/studio/). Paste the key into the proof
lab when prompted.

### Run The Rust Demo

```bash
cargo run -p proofstream-core
```

The command prints a JSON proof packet produced with MerkleForge.

## Five-Minute Demo

1. Open **Proof Lab** and read the short introduction.
2. Paste a Graph Gateway API key and choose a DEX source.
3. Keep **Recent swaps** selected and run the query.
4. Inspect the GraphQL request and JSON response, then choose **Build dataset**.
5. Select an activity, open **Receipt**, and verify it in the browser.
6. Run the tamper test to see a changed row fail verification.
7. Download the receipt as JSON or PDF.

Rows use zero-based indexes: row `0` is the first activity in the response.
After a successful query, the first pool and wallet-origin values are filled
automatically so the other query modes are easy to try.

## Live Data Sources

The current presets use swaps-compatible subgraphs on The Graph decentralized
network.

| DEX | Networks |
|---|---|
| Uniswap V3 | Ethereum, Base, Arbitrum One, Optimism, Polygon, BNB Chain, Celo, Avalanche |
| SushiSwap V3 | Ethereum |
| Aerodrome | Base |
| Messari DEX AMM standard | SushiSwap on Ethereum, ApeSwap on BNB Chain, Trader Joe on Avalanche |
| Custom DEX | Any compatible subgraph supplied by the user |

Subgraph schemas are not universal. Custom sources must expose the swap fields
used by the selected query template. ProofStream includes schema-aware adapters
for the bundled Uniswap-style and SushiSwap V3 presets.

### Standardized Cross-Protocol Queries

ProofStream also integrates the Messari DEX AMM 1.3.2 standard. The bundled
SushiSwap, ApeSwap, and Trader Joe standard presets use one shared GraphQL
query and one normalization path; only the live Subgraph deployment ID changes.
Each resulting receipt row commits the protocol slug and reported schema
version alongside the activity data.

The deployments come from Messari's public
[standardized Subgraph registry](https://github.com/messari/subgraphs/blob/master/deployment/deployment.json),
and every request still runs against The Graph decentralized network through
the user's Gateway API key. This demonstrates the practical benefit of the
standard: another compliant protocol can be added as data, without creating a
new protocol-specific query adapter.

### Query Modes

| Mode | What it returns | Best use |
|---|---|---|
| Recent swaps | The newest indexed swaps | Fastest first demo |
| Pool feed | Swaps from one pool address | Monitoring a market or liquidity pool |
| Wallet activity | Swaps whose `origin` matches a wallet | Reviewing activity associated with an origin account |

If a preset becomes unavailable or its schema changes, select another preset or
use a compatible subgraph from
[Graph Explorer](https://thegraph.com/explorer).

## Verification Flow

1. **Fetch**: the browser sends an editable GraphQL request to The Graph Gateway.
2. **Read**: ProofStream normalizes the returned swaps into deterministic text rows.
3. **Seal**: every row is hashed as a leaf and combined into one Merkle root.
4. **Prove**: ProofStream packages one row with only the sibling hashes needed to reconstruct that root.
5. **Verify**: the browser hashes the row and proof path again, then accepts only when the recomputed root equals the receipt root.

Changing the selected row changes its leaf hash. The old proof then reconstructs
a different root and verification fails.

## Receipt Contents

The receipt view keeps the result readable first and places cryptographic detail
behind an expandable developer section. A receipt includes:

- verification result and a plain-language explanation
- DEX, network, token pair, indexed value, transaction, and block
- selected row and total dataset size
- public Merkle root and client-recomputed root
- leaf hash and ordered helper hashes
- exact source values used to create the proof

Use the JSON export for software integration and the PDF export for sharing a
human-readable record.

## API-Key Privacy

ProofStream does not save a Graph API key to local storage, session storage, a
database, or the repository. The key remains in React memory while the page is
open and is sent only in the Graph Gateway authorization header for the query.
Refreshing or closing the page clears it.

Do not place a real key in a `VITE_*` environment variable: Vite exposes those
values to browser code. The included [`.env.example`](./.env.example) contains
only optional, non-secret demo defaults.

## Rust Proof Engine

The Rust crate uses the published MerkleForge components:

- `merkle-core`
- `merkleforge-hash`
- `merkle-variants`

It constructs a `BinaryMerkleTree<Keccak256>`, creates a proof packet, drops the
tree, and recomputes the root statelessly from the selected row and proof. The
web app implements the same domain-separated Keccak-256 binary proof flow in
TypeScript so visitors can run it without a backend.

## Verification Commands

```bash
# Type-check and build the React app
npm run build

# Run the Rust workspace tests
npm run rust:test

# Run the Rust proof packet demo
npm run rust:demo
```

## Repository Structure

```text
ProofStream/
|-- apps/web/
|   |-- src/components/             React pages and reusable sections
|   |-- src/components/proof-lab/   Query, dataset, receipt, guide, and toast UI
|   |-- src/data/                   DEX presets and proof-lab content
|   |-- src/lib/                    Graph adapter, token assets, and Merkle logic
|   `-- src/utils/                  Row parsing, formatting, clipboard, and exports
|-- crates/proofstream-core/        MerkleForge-backed Rust proof engine
|-- .env.example                    Optional non-secret browser defaults
|-- Cargo.toml                      Rust workspace
`-- package.json                    Web and Rust convenience commands
```

## Implementation Map

| Area | File |
|---|---|
| App routes and page composition | `apps/web/src/App.tsx` |
| Proof-lab state and workflow | `apps/web/src/components/ProofLab.tsx` |
| Query configuration and console | `apps/web/src/components/proof-lab/QueryPanel.tsx` |
| Readable activity selection | `apps/web/src/components/proof-lab/DatasetPanel.tsx` |
| Verification and receipt downloads | `apps/web/src/components/proof-lab/ReceiptPanel.tsx` |
| GraphQL templates and request adapter | `apps/web/src/lib/graph.ts` |
| Browser Merkle implementation | `apps/web/src/lib/merkle.ts` |
| DEX and network presets | `apps/web/src/data/dexPresets.ts` |
| Token artwork resolution | `apps/web/src/lib/tokenAssets.ts` |
| Human-readable amount formatting | `apps/web/src/utils/activityFormat.ts` |
| JSON and PDF receipt generation | `apps/web/src/utils/receiptExport.ts` |
| Rust proof packet implementation | `crates/proofstream-core/src/lib.rs` |

## Current Limitations

- ProofStream currently supports swaps-compatible GraphQL schemas, not every
  subgraph schema.
- The browser demo proves membership in the fetched response; it does not prove
  blockchain consensus or indexer correctness.
- Roots are generated locally and are not yet signed or anchored onchain.
- Live results depend on The Graph Gateway and the selected indexers being
  available and synchronized.
- This project is a verification demo, not financial or trading advice.

## Roadmap

- signed and onchain-anchored dataset roots
- shareable receipt URLs and a receipt verification API
- agent-friendly proof tools and machine-readable verification responses
- additional schema adapters beyond swap events
- independently hosted proof generation for production clients

## Contributing

Issues and pull requests are welcome. For a focused contribution:

1. Fork the repository and create a feature branch.
2. Keep UI code reusable and preserve the plain-language proof explanations.
3. Run `npm run build` and `npm run rust:test`.
4. Explain the user-visible behavior and proof implications in the pull request.

When adding a data source, document its network, subgraph ID, schema family, and
the exact query modes it supports.

## License

ProofStream is dual-licensed under the MIT License and Apache License 2.0. You may use, modify, and distribute this project under either license at your option.

- **MIT License**: See [LICENSE-MIT](./LICENSE-MIT) for details.
- **Apache License 2.0**: See [LICENSE-APACHE](./LICENSE-APACHE) for details.

When using ProofStream in your own project, you may choose which license works best for your use case. This dual licensing ensures compatibility with projects that require a specific open-source license.
