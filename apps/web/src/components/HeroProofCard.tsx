import { useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";

const proofStages = [
  {
    step: "01 / Fetch",
    topLabel: "Live DEX activity",
    topValue: "USDC → WETH",
    topMeta: "The Graph · block 22,104,918",
    bottomLabel: "Query result",
    bottomValue: "12 readable rows",
    bottomMeta: "Source response is ready to seal",
    status: "Data received",
  },
  {
    step: "02 / Seal",
    topLabel: "Dataset",
    topValue: "12 rows committed",
    topMeta: "MerkleForge hashes every activity record",
    bottomLabel: "Dataset fingerprint",
    bottomValue: "0x8f3a…91c",
    bottomMeta: "Changing one row produces a different root",
    status: "Root created",
  },
  {
    step: "03 / Verify",
    topLabel: "Proof receipt",
    topValue: "Row #3 + 4 hashes",
    topMeta: "Only the selected claim and helper path",
    bottomLabel: "Client result",
    bottomValue: "Activity verified",
    bottomMeta: "The recomputed root matches the dataset",
    status: "Receipt valid",
  },
];

export function HeroProofCard() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % proofStages.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const stage = proofStages[activeStage];

  return (
    <div
      className="hero-receipt-preview proof-demo-card"
      aria-label="ProofStream verification flow preview"
    >
      <div className="proof-demo-toolbar">
        <b>ProofStream</b>
        <span>{stage.step}</span>
        <div className="proof-demo-dots" aria-label="Select proof stage">
          {proofStages.map((item, index) => (
            <button
              className={activeStage === index ? "active" : ""}
              key={item.step}
              onClick={() => setActiveStage(index)}
              aria-label={`Show ${item.step}`}
              aria-pressed={activeStage === index}
            />
          ))}
        </div>
      </div>

      <div className="proof-demo-scene" key={stage.step}>
        <section>
          <small>{stage.topLabel}</small>
          <strong>{stage.topValue}</strong>
          <span>{stage.topMeta}</span>
        </section>

        <div className="proof-demo-arrow" aria-hidden="true">
          <LuArrowRight />
        </div>

        <section>
          <small>{stage.bottomLabel}</small>
          <strong>{stage.bottomValue}</strong>
          <span>{stage.bottomMeta}</span>
        </section>
      </div>

      <div className="proof-demo-footer">
        <span>
          <i aria-hidden="true" />
          {stage.status}
        </span>
        <a href="#/proof-lab">Run it yourself</a>
      </div>
    </div>
  );
}
