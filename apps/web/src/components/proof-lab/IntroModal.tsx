type IntroModalProps = {
  readonly onClose: () => void;
};

const MODAL_POINTS = [
  {
    title: "What ProofStream does",
    text: "It fetches DEX activity, turns the rows into a Merkle dataset, and creates a receipt for one selected row.",
  },
  {
    title: "What gets verified",
    text: "The browser checks that the selected row belongs to the committed dataset using only the row, root, and proof.",
  },
  {
    title: "API key privacy",
    text: "Your Graph API key is never stored. It stays in browser memory and is only sent as an Authorization header for the query.",
  },
  {
    title: "Data disclaimer",
    text: "Live rows come from The Graph and its indexers. This is a verification demo, not financial advice or a trading tool.",
  },
];

export function IntroModal({ onClose }: IntroModalProps) {
  return (
    <div className="intro-modal-backdrop">
      <dialog className="intro-modal" aria-labelledby="intro-modal-title" open>
        <div className="intro-modal-hero" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="intro-modal-copy">
          <p className="eyebrow">Before you run the demo</p>
          <h2 id="intro-modal-title">Verify one DEX activity record without trusting the server.</h2>
          <p>
            ProofStream shows how indexed blockchain data can become a human-readable,
            cryptographic receipt.
          </p>
        </div>

        <div className="intro-modal-grid">
          {MODAL_POINTS.map((point) => (
            <article key={point.title}>
              <b>{point.title}</b>
              <p>{point.text}</p>
            </article>
          ))}
        </div>

        <div className="intro-modal-actions">
          <a href="https://thegraph.com/studio/apikeys/" target="_blank" rel="noreferrer">
            Get Graph API key
          </a>
          <button type="button" onClick={onClose}>
            Enter playground
          </button>
        </div>
      </dialog>
    </div>
  );
}
