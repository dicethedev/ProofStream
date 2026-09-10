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

Open the local Vite URL and edit the transaction rows. Click **Generate proof**
to see the Merkle root, checked row, sibling path, and verification result.

## Live Data From The Graph

Copy the environment file:

```bash
cp .env.example apps/web/.env.local
```

Set `VITE_GRAPH_ENDPOINT` to a live Subgraph or Graph Gateway endpoint. The UI
will use live indexed data when the endpoint is available and fall back to demo
records when it is not.

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
