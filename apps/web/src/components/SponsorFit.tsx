import { LuKeyRound, LuShieldCheck, LuWalletCards } from "react-icons/lu";

export function SponsorFit() {
  const safeguards = [
    {
      label: "Memory only",
      title: "Your API key is temporary",
      body: "It is used for the Graph request, kept only in browser memory, and never saved by ProofStream.",
      Icon: LuKeyRound,
    },
    {
      label: "Read-only",
      title: "Your wallet stays untouched",
      body: "The proof lab reads public indexed records. It never asks for a signature or permission to move assets.",
      Icon: LuWalletCards,
    },
    {
      label: "Local check",
      title: "Verification happens here",
      body: "Your browser rebuilds the expected root from the selected row and the receipt's helper hashes.",
      Icon: LuShieldCheck,
    },
  ];

  return (
    <section className="section trust-section" id="security">
      <header className="trust-heading" data-reveal>
        <div>
          <p className="eyebrow">Trust by design</p>
          <h2>ProofStream verifies data without taking control.</h2>
        </div>
        <p>
          Read public blockchain data, create a receipt, and verify it locally.
          No custody, no signatures, and no stored API credentials.
        </p>
      </header>

      <div className="trust-grid">
        {safeguards.map((item) => (
          <article className="trust-card" key={item.title} data-reveal>
            <header>
              <item.Icon aria-hidden="true" />
            </header>
            <small>{item.label}</small>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
