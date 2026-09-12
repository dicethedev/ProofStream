import { LuArrowRight } from "react-icons/lu";

export function ProblemSection() {
  return (
    <section className="section guarantee-section" id="guarantee">
      <div className="guarantee-shell" data-reveal>
        <div className="guarantee-copy">
          <p className="eyebrow">Small receipt. Strong guarantee.</p>
          <h2>Verify the data, not the dashboard.</h2>
          <p>
            A dashboard can change what it displays. A ProofStream receipt lets
            anyone confirm that one DEX activity record is unchanged and belongs
            to the published dataset.
          </p>
          <a href="#/proof-lab" className="guarantee-action">
            Create a proof receipt <LuArrowRight aria-hidden="true" />
          </a>
        </div>

        <article
          className="guarantee-receipt"
          aria-label="Example verified ProofStream receipt"
        >
          <header>
            <div>
              <small>Proof receipt</small>
              <b>DEX activity #03</b>
            </div>
            <span className="guarantee-status">
              <i>✓</i> Verified
            </span>
          </header>

          <div className="guarantee-claim">
            <small>Checked activity</small>
            <strong>1,250 USDC → 0.41 WETH</strong>
            <span>Uniswap V3 · Block 25,947,441</span>
          </div>

          <div className="guarantee-checks">
            <span>
              <i>✓</i> The activity record has not changed
            </span>
            <span>
              <i>✓</i> It belongs to the sealed dataset
            </span>
            <span>
              <i>✓</i> No source database was needed
            </span>
          </div>

          <footer>
            <span>1 row</span>
            <span>4 helper hashes</span>
            <code>root 0x8f3a...91c</code>
          </footer>
        </article>
      </div>
    </section>
  );
}
