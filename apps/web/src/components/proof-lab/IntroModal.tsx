import {
  LuArrowRight,
  LuDatabase,
  LuExternalLink,
  LuInfo,
  LuKeyRound,
  LuRows3,
  LuShieldCheck,
  LuX,
} from "react-icons/lu";

type IntroModalProps = {
  readonly onClose: () => void;
};

const GUIDE_STEPS = [
  {
    label: "Fetch",
    title: "Load live DEX activity",
    text: "Choose a ready-made DEX and query its public data through The Graph.",
    Icon: LuDatabase,
  },
  {
    label: "Choose",
    title: "Pick one readable row",
    text: "Review the returned swaps, then select the activity you want to prove.",
    Icon: LuRows3,
  },
  {
    label: "Verify",
    title: "Check its proof receipt",
    text: "Your browser confirms that the selected row belongs to the sealed dataset.",
    Icon: LuShieldCheck,
  },
];

export function IntroModal({ onClose }: IntroModalProps) {
  return (
    <div
      className="intro-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <dialog
        className="intro-modal intro-modal-guide"
        aria-labelledby="intro-modal-title"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        open
      >
        <button
          className="intro-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close introduction"
        >
          <LuX aria-hidden="true" />
        </button>

        <header className="intro-guide-heading">
          <span className="intro-guide-icon" aria-hidden="true">
            <LuShieldCheck />
          </span>
          <div>
            <p className="eyebrow">Welcome to Proof Lab</p>
            <h2 id="intro-modal-title">Test a DEX proof in three simple steps.</h2>
            <p>
              Fetch real indexed activity, choose one record, and verify its
              cryptographic receipt directly in your browser.
            </p>
          </div>
        </header>

        <div className="intro-guide-steps" aria-label="Proof Lab steps">
          {GUIDE_STEPS.map((step) => (
            <article key={step.label}>
              <div>
                <step.Icon aria-hidden="true" />
                <small>{step.label}</small>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <aside className="intro-guide-key-note">
          <LuKeyRound aria-hidden="true" />
          <div>
            <b>Bring a Graph Gateway API key</b>
            <p>
              ProofStream uses it only for your request. It stays in this tab's
              memory and is never stored.
            </p>
          </div>
        </aside>

        <p className="intro-guide-disclaimer">
          <LuInfo aria-hidden="true" />
          The receipt proves inclusion in the fetched dataset. It does not
          certify an indexer's accuracy and is not financial advice.
        </p>

        <div className="intro-modal-actions intro-guide-actions">
          <a
            href="https://thegraph.com/studio/apikeys/"
            target="_blank"
            rel="noreferrer"
          >
            Get a Graph API key <LuExternalLink aria-hidden="true" />
          </a>
          <button type="button" onClick={onClose}>
            Start Proof Lab <LuArrowRight aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </div>
  );
}
