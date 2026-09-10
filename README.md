# MerkleForge ProofStream

> Verifiable blockchain data for humans, apps, and AI agents.

ProofStream is an ETHGlobal Online project built on top of
[MerkleForge Framework](https://github.com/dicethedev/MerkleForge). It turns
indexed blockchain data into compact Merkle proofs so a user, light client, or
AI agent can verify an answer without trusting the backend that returned it.

## Hackathon Angle

Most apps ask users to trust an indexer response:

> "Wallet `0xabc...` made this swap."

ProofStream adds a cryptographic evidence layer:

> "Here is the indexed record, the dataset root, and the Merkle proof showing
> this exact row belongs to the committed dataset."

## Bounty Targets

- **The Graph** — live subgraph data is the source of records.
- **Bazantic** — expose proof APIs as agent-usable tools and recipes.
- **Chainlink** — optional extension: anchor dataset roots onchain.

## Repository Layout

```text
merkleforge-proofstream/
├── apps/
│   └── web/                    # Vite + React proof lab
├── crates/
│   └── proofstream-core/       # Rust proof engine powered by MerkleForge
├── .env.example
├── Cargo.toml
└── package.json
```

## Quick Start

Run the Rust proof engine:

```bash
cargo run -p proofstream-core
```

Run the web demo:

```bash
npm install
npm run dev
```

Open the local Vite URL and use the proof playground:

1. Choose sample rows or fetch live swaps from The Graph.
2. Pick one row to prove.
3. Edit the client claim or click **Tamper test**.
4. Watch the receipt move between **Verified** and **Rejected**.

## Live Data From The Graph

Copy the environment file:

```bash
cp .env.example apps/web/.env.local
```

Get a Graph Gateway API key from Subgraph Studio, then paste it into the demo at
runtime. ProofStream does not store the key and does not print it back into the
page. The visible query URL stays in this form:
`https://gateway.thegraph.com/api/subgraphs/id/{subgraph_id}`.

The browser sends the API key only as an `Authorization: Bearer ...` request
header when you click **Query**.

The proof lab includes DEX presets and three live query modes:

- **Uniswap V3 mainnet** — default preset for the smoothest demo.
- **PancakeSwap V3 Ethereum / BNB Chain** — alternative DEX presets.
- **Custom DEX** — paste any swaps-compatible subgraph ID from Graph Explorer.
- **Recent swaps** — safest query mode; no filter, newest rows.
- **Pool feed** — filters by one pool address.
- **Wallet activity** — filters by swap `origin`, with retry handling for
  temporary gateway/indexer failures.

Fetched subgraph data is shown as JSON first, then normalized into editable
receipt rows. The proof verifies one row from those rows, not the whole table.

## Core Flow

```text
Live blockchain
      ↓
The Graph / Subgraph
      ↓
Normalized event records
      ↓
MerkleForge ProofStream
      ↓
Merkle root + compact proof
      ↓
User, app, or AI agent verifies statelessly
```

## Why It Wins

- It makes blockchain data verifiable at the API layer.
- It extends an existing open-source Rust framework with a new real-world app.
- The demo is easy to understand: edit records, prove one row, verify the root.
- The project can grow naturally into AI-agent tooling and onchain root
  anchoring.

## Current Status

- Browser proof lab scaffolded.
- Rust MerkleForge proof engine scaffolded.
- The Graph endpoint adapter scaffolded.
- API gateway, Bazantic recipe, and Chainlink root registry are next.
