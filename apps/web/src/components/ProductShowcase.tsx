import { LuArrowRight } from "react-icons/lu";

const features = [
  {
    number: "01",
    tag: "Query",
    title: "Fetch live activity",
    body: "Choose a DEX preset or use your own subgraph. The request and raw response stay visible.",
    result: "GraphQL + JSON",
    kind: "query",
  },
  {
    number: "02",
    tag: "Read",
    title: "Understand every row",
    body: "Turn nested JSON into clear activity records with pair, value, wallet, transaction, and block details.",
    result: "Human-readable rows",
    kind: "dataset",
  },
  {
    number: "03",
    tag: "Prove",
    title: "Create a small receipt",
    body: "Seal the dataset and package one selected activity with only the hashes needed to prove it belongs.",
    result: "Row + Merkle proof",
    kind: "receipt",
  },
  {
    number: "04",
    tag: "Verify",
    title: "Check it independently",
    body: "Recompute the dataset root in the browser without trusting the API, dashboard, or source database.",
    result: "Verified or rejected",
    kind: "verify",
  },
] as const;

type FeatureKind = (typeof features)[number]["kind"];

function FeatureVisual({ kind }: { kind: FeatureKind }) {
  if (kind === "query") {
    return (
      <div className="feature-mini feature-mini-query" aria-hidden="true">
        <header>
          <i />
          <span>Recent swaps</span>
          <small>LIVE</small>
        </header>
        <code>swaps(first: 10)</code>
        <div>
          <span />
          <span />
          <span />
        </div>
        <b>12 rows returned</b>
      </div>
    );
  }

  if (kind === "dataset") {
    return (
      <div className="feature-mini feature-mini-dataset" aria-hidden="true">
        <small>Readable dataset</small>
        <span>
          <i>01</i>
          <b>USDC → WETH</b>
        </span>
        <span>
          <i>02</i>
          <b>WETH → USDT</b>
        </span>
        <span>
          <i>03</i>
          <b>USDC → USDT</b>
        </span>
      </div>
    );
  }

  if (kind === "receipt") {
    return (
      <div className="feature-mini feature-mini-receipt" aria-hidden="true">
        <small>Proof receipt</small>
        <b>Activity #03</b>
        <code>root 0x8f3a...91c</code>
        <div>
          <span>1 row</span>
          <span>4 hashes</span>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-mini feature-mini-verify" aria-hidden="true">
      <span>✓</span>
      <small>Client result</small>
      <b>Proof verified</b>
      <code>roots match</code>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section className="section product-showcase" id="use-cases">
      <div className="section-heading product-heading" data-reveal>
        <div>
          <p className="eyebrow">One product, four clear views</p>
          <h2>See every step from query to proof.</h2>
        </div>
        <p>
          ProofStream keeps each stage visible, so developers and users can
          understand what was fetched, sealed, sent, and verified.
        </p>
      </div>

      <div className="feature-track">
        {features.map((feature) => (
          <article
            className={`feature-card feature-${feature.kind}`}
            key={feature.title}
            data-reveal
          >
            <div className="feature-pin" aria-hidden="true">
              <span>{feature.number}</span>
            </div>
            <div className="feature-art">
              <FeatureVisual kind={feature.kind} />
            </div>
            <div className="feature-content">
              <small>{feature.tag}</small>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <footer>
                <span>{feature.result}</span>
                <a
                  href="#/proof-lab"
                  aria-label={`Open ${feature.tag} in Proof Lab`}
                >
                  <LuArrowRight aria-hidden="true" />
                </a>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
