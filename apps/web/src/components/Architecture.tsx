import {
  LuArrowRight,
  LuDatabase,
  LuFingerprint,
  LuReceiptText,
  LuShieldCheck,
} from "react-icons/lu";

export function Architecture() {
  const steps = [
    {
      title: "Fetch live rows",
      body: "Pull fresh swaps, pool activity, or wallet history from The Graph.",
      signal: "JSON",
      Icon: LuDatabase,
    },
    {
      title: "Seal the dataset",
      body: "MerkleForge turns every row into one tamper-evident root.",
      signal: "ROOT",
      Icon: LuFingerprint,
    },
    {
      title: "Issue a receipt",
      body: "Send the chosen row with only the helper hashes needed to check it.",
      signal: "PROOF",
      Icon: LuReceiptText,
    },
    {
      title: "Verify anywhere",
      body: "A browser, wallet, or agent recomputes the root without trusting your server.",
      signal: "PASS",
      Icon: LuShieldCheck,
    },
  ];

  return (
    <section className="section architecture-section" id="architecture">
      <div className="how-card" data-reveal>
        <header className="how-card-heading">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>From DEX activity to a receipt anyone can verify.</h2>
          </div>
          <p>
            ProofStream keeps the source visible, seals the returned rows, and
            gives the client a small receipt it can check independently.
          </p>
        </header>

        <div className="how-workflow">
          {steps.map((step, index) => (
            <div className="how-step-wrap" key={step.title}>
              <article className="how-step">
                <header>
                  <step.Icon aria-hidden="true" />
                </header>
                <small>{step.signal}</small>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
              {index < steps.length - 1 ? (
                <LuArrowRight className="how-step-arrow" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
