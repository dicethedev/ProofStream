import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";

const benefits = [
  {
    number: "01",
    tab: "Fetch",
    eyebrow: "Start with live data",
    title: "See the exact DEX response.",
    body: "Query The Graph and inspect the returned swaps before ProofStream changes anything.",
    detail: "Nothing is hidden or pre-generated.",
    visual: "source",
  },
  {
    number: "02",
    tab: "Seal",
    eyebrow: "Commit the dataset",
    title: "Turn every row into one fingerprint.",
    body: "MerkleForge seals the response into a single root. Change one row and the fingerprint changes too.",
    detail: "The original rows remain readable.",
    visual: "receipt",
  },
  {
    number: "03",
    tab: "Verify",
    eyebrow: "Check one activity",
    title: "Verify one row without the backend.",
    body: "The browser uses the selected row and a small proof path to reproduce the same root independently.",
    detail: "No full dataset or trusted server required.",
    visual: "client",
  },
] as const;

type StoryVisualProps = {
  readonly type: (typeof benefits)[number]["visual"];
};

function StoryVisual({ type }: StoryVisualProps) {
  if (type === "source") {
    return (
      <div className="story-visual story-visual-source" aria-hidden="true">
        <div className="story-window">
          <div className="story-window-bar">
            <span>Live GraphQL response</span>
            <i>12 rows</i>
          </div>
          <div className="story-source-grid">
            <div className="story-query-lines">
              <small>query LatestSwaps</small>
              <b>swaps(first: 12)</b>
              <span>token0 · token1</span>
              <span>amountUSD · timestamp</span>
            </div>
            <div className="story-json-lines">
              <small>JSON</small>
              <span>{`{ "pair": "USDC/WETH" }`}</span>
              <span>{`{ "value": "$2,481.12" }`}</span>
              <span>{`{ "block": "25947441" }`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "receipt") {
    return (
      <div className="story-visual story-visual-receipt" aria-hidden="true">
        <div className="story-row-stack">
          <span>
            <i>01</i> USDC → WETH
          </span>
          <span>
            <i>02</i> WETH → USDT
          </span>
          <span>
            <i>03</i> USDC → USDT
          </span>
        </div>
        <div className="story-flow-arrow">
          <LuArrowRight aria-hidden="true" />
        </div>
        <div className="story-root-card">
          <small>Dataset fingerprint</small>
          <b>0x8f3a...91c</b>
          <span>12 rows sealed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="story-visual story-visual-client" aria-hidden="true">
      <div className="story-proof-card">
        <small>Proof receipt</small>
        <b>USDC → WETH</b>
        <span>Row #03 · 4 helper hashes</span>
      </div>
      <div className="story-verification-line" />
      <div className="story-verified-card">
        <span>✓</span>
        <div>
          <small>Client result</small>
          <b>Activity verified</b>
        </div>
      </div>
    </div>
  );
}

export function ProofStreamStory() {
  const [active, setActive] = useState(0);
  const benefit = benefits[active];

  return (
    <section
      className="section story-section"
      id="product"
      aria-labelledby="story-title"
    >
      <div className="story-heading" data-reveal>
        <p className="eyebrow">See ProofStream in action</p>
        <h2 id="story-title">
          From live DEX data to a receipt anyone can check.
        </h2>
        <p>
          Follow one clear flow. Fetch the records, seal the response, and
          verify one activity without trusting the server that returned it.
        </p>
      </div>

      <div className="story-console" data-reveal>
        <div
          className="story-tabs"
          role="tablist"
          aria-label="ProofStream product flow"
        >
          {benefits.map((item, index) => (
            <button
              className={active === index ? "active" : ""}
              key={item.title}
              onClick={() => setActive(index)}
              role="tab"
              aria-selected={active === index}
            >
              <span>{item.number}</span>
              <b>{item.tab}</b>
              <small>{item.eyebrow}</small>
            </button>
          ))}
        </div>

        <article
          className={`story-active story-${benefit.visual}`}
          role="tabpanel"
        >
          <div className="story-copy">
            <p>{benefit.eyebrow}</p>
            <h3>{benefit.title}</h3>
            <small>{benefit.body}</small>
            <span className="story-detail">
              <i>✓</i>
              {benefit.detail}
            </span>
            <a href="#/proof-lab">
              Try this step in Proof Lab <LuArrowRight aria-hidden="true" />
            </a>
          </div>
          <StoryVisual type={benefit.visual} />
        </article>
      </div>
    </section>
  );
}
