export function Architecture() {
  const steps = [
    ["1", "Fetch live data", "Pull DEX activity from The Graph, such as swaps, pools, or wallet activity."],
    ["2", "Seal the list", "MerkleForge turns the fetched rows into one public dataset fingerprint."],
    ["3", "Send a receipt", "Only the selected row and a tiny proof path are sent to the client."],
    ["4", "Verify anywhere", "A browser, wallet, or agent checks the receipt without downloading the full dataset."],
  ];

  return (
    <section className="section" id="architecture">
      <div className="section-heading">
        <p className="eyebrow">How it works</p>
        <h2>From live DEX data to a proof anyone can check.</h2>
        <p>
          ProofStream adds a verification layer between indexed blockchain data
          and the apps, wallets, or agents that depend on it.
        </p>
      </div>

      <div className="flow-grid">
        {steps.map(([index, title, body]) => (
          <article className="flow-card" key={title}>
            <span>{index}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
