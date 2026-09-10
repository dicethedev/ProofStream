export function Architecture() {
  const steps = [
    ["1", "Fetch", "The Graph returns live indexed blockchain records."],
    ["2", "Commit", "MerkleForge turns those records into one dataset root."],
    ["3", "Prove", "The server sends only the selected row and sibling path."],
    ["4", "Verify", "A client or agent recomputes the root statelessly."],
  ];

  return (
    <section className="section" id="architecture">
      <div className="section-heading">
        <p className="eyebrow">Architecture</p>
        <h2>A verification layer for blockchain APIs.</h2>
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
