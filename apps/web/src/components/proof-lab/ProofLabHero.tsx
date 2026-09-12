import { useState } from "react";
import {
  LuArrowDown,
  LuArrowRight,
  LuDatabase,
  LuRows3,
  LuShieldCheck,
} from "react-icons/lu";

const HERO_STEPS = [
  {
    label: "Query",
    title: "Fetch live DEX activity",
    body: "Choose a ready-made DEX, add your Graph API key, and run a real GraphQL query.",
    outcome: "You can inspect both the query and raw JSON response.",
    nextLabel: "Review rows",
    Icon: LuDatabase,
  },
  {
    label: "Dataset",
    title: "Read and choose one row",
    body: "ProofStream converts nested JSON into clear activity records you can understand and select.",
    outcome: "You always see the exact record that will be proved.",
    nextLabel: "See the receipt",
    Icon: LuRows3,
  },
  {
    label: "Receipt",
    title: "Verify it in your browser",
    body: "The selected row and its helper hashes recreate the sealed dataset root without the source database.",
    outcome: "Matching roots confirm that the row belongs to the dataset.",
    nextLabel: "Start again",
    Icon: LuShieldCheck,
  },
] as const;

function openLab() {
  document.getElementById("lab")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProofLabHero() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const step = HERO_STEPS[activeStep];

  function showNextStep() {
    setActiveStep((current) => (current + 1) % HERO_STEPS.length);
  }

  return (
    <section className="section lab-page-hero lab-hero-guide" id="top" data-reveal>
      <div className="lab-hero-copy">
        <h1>Fetch live DEX data. Verify one row yourself.</h1>
        <p className="lede">
          Follow the data from The Graph to a readable row, then check its proof
          receipt directly in your browser.
        </p>

        <div className="lab-hero-actions">
          <button type="button" onClick={openLab}>
            Start with live data <LuArrowDown aria-hidden="true" />
          </button>
          <span>No wallet connection or transaction required.</span>
        </div>
      </div>

      <div className="lab-hero-walkthrough">
        <div className="lab-hero-tabs" role="tablist" aria-label="Preview Proof Lab stages">
          {HERO_STEPS.map((item, index) => (
            <button
              className={activeStep === index ? "active" : ""}
              key={item.label}
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              onClick={() => setActiveStep(index)}
            >
              <item.Icon aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <article className="lab-hero-stage" role="tabpanel" aria-live="polite" key={step.label}>
          <header>
            <span>What happens here</span>
            <small>{activeStep + 1} of {HERO_STEPS.length}</small>
          </header>
          <step.Icon className="lab-hero-stage-icon" aria-hidden="true" />
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          <div className="lab-hero-outcome">
            <LuShieldCheck aria-hidden="true" />
            <span>{step.outcome}</span>
          </div>
          <footer>
            <button type="button" onClick={openLab}>Open this workflow</button>
            <button type="button" onClick={showNextStep}>
              {step.nextLabel} <LuArrowRight aria-hidden="true" />
            </button>
          </footer>
        </article>
      </div>
    </section>
  );
}
