export function Header() {
  return (
    <section className="hero">
      <nav className="nav">
        <span className="brand-mark">MF</span>
        <span>ProofStream</span>
        <a href="https://github.com/dicethedev/MerkleForge" target="_blank" rel="noreferrer">
          Built on MerkleForge
        </a>
      </nav>

      <div className="hero-grid">
        <div>
          <p className="hero-kicker">Live blockchain data, backed by proof</p>
          <h1>Do not just show DEX data. Prove it.</h1>
          <p className="lede">
            ProofStream fetches live swaps from The Graph, seals them with
            MerkleForge, and gives users a small receipt they can verify in the browser.
          </p>
          <div className="hero-actions">
            <a href="#lab" className="primary">Try the proof lab</a>
            <a href="#architecture" className="secondary">See the flow</a>
          </div>
        </div>

        <div className="commitment-card" aria-label="ProofStream visual">
          <div className="proof-orbit" aria-hidden="true" />
          <div className="proof-source-card">
            <span>Source</span>
            <b>The Graph JSON</b>
            <small>Live swaps, pools, and wallet activity</small>
          </div>
          <div className="proof-root-node">Root</div>
          <div className="proof-receipt-card">
            <span>Receipt</span>
            <b>One row + helper hashes</b>
            <small>Enough to check the claim</small>
          </div>
          <div className="proof-client-card">Browser verifies</div>
        </div>
      </div>
    </section>
  );
}
