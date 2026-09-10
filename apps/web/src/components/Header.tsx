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
          <p className="eyebrow">ETHGlobal Online idea</p>
          <h1>Blockchain data answers with cryptographic receipts.</h1>
          <p className="lede">
            Fetch indexed events, commit the dataset with MerkleForge, and send
            a tiny proof anyone can verify without trusting your backend.
          </p>
          <div className="hero-actions">
            <a href="#lab" className="primary">Try the proof lab</a>
            <a href="#architecture" className="secondary">See the flow</a>
          </div>
        </div>

        <div className="commitment-card" aria-label="ProofStream visual">
          <div className="root-node">Root</div>
          <div className="proof-path">
            <span />
            <span />
            <span />
          </div>
          <div className="dataset-plane">
            <b>Live indexed rows</b>
            <small>The Graph → MerkleForge → Proof</small>
          </div>
          <div className="agent-pill">AI agent verifies</div>
        </div>
      </div>
    </section>
  );
}
