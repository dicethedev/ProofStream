import { HeroProofCard } from "./HeroProofCard";

export function Header() {
  return (
    <section className="hero">
      <nav className="nav">
        <a className="nav-brand" href="#top" aria-label="ProofStream home">
          <span>ProofStream</span>
        </a>

        <div className="nav-links" aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#architecture">How it works</a>
          <a href="#use-cases">Use cases</a>
          <a href="#security">Trust</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="nav-actions">
          <a
            className="github-link"
            href="https://github.com/dicethedev/MerkleForge"
            target="_blank"
            rel="noreferrer"
            aria-label="Open MerkleForge on GitHub"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"
              />
            </svg>
          </a>
          <a className="nav-primary" href="#/proof-lab">Open proof lab</a>
        </div>
      </nav>

      <div className="hero-center" id="top" data-reveal>
        <div className="hero-center-copy">
          <h1>
            Verify DEX activity
            {" "}<span>with proof receipts</span>
          </h1>
          <a href="#/proof-lab" className="primary hero-primary">Open proof lab</a>
        </div>

        <HeroProofCard />
      </div>
    </section>
  );
}
