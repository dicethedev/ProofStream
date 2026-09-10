import { JUDGE_CARDS, RECEIPT_BREAKDOWN } from "../../data/proofLabContent";
import type { BrowserProof, VerificationResult } from "../../lib/merkle";
import { short, tamperClaim } from "../../utils/text";

type ReceiptPanelProps = {
  readonly clientClaim: string;
  readonly proof: BrowserProof;
  readonly rowsLength: number;
  readonly selectedLeaf: string;
  readonly selectedRow: number;
  readonly verification: VerificationResult;
  readonly onClientClaimChange: (value: string) => void;
};

const TECH_TERMS = [
  {
    label: "Public Merkle root",
    meaning: "Fingerprint for the whole dataset.",
    getValue: (proof: BrowserProof, verification: VerificationResult) =>
      proof.root || verification.recomputedRoot,
  },
  {
    label: "Client recomputed root",
    meaning: "Fingerprint rebuilt from the claimed row and proof path.",
    getValue: (_proof: BrowserProof, verification: VerificationResult) =>
      verification.recomputedRoot,
  },
  {
    label: "Leaf hash",
    meaning: "Fingerprint of only the row being checked.",
    getValue: (_proof: BrowserProof, verification: VerificationResult) =>
      verification.leafHash,
  },
  {
    label: "Proof path",
    meaning: "The small set of sibling fingerprints needed to reach the root.",
    getValue: (proof: BrowserProof) => `${proof.siblings.length} helper hashes`,
  },
];

export function ReceiptPanel({
  clientClaim,
  proof,
  rowsLength,
  selectedLeaf,
  selectedRow,
  verification,
  onClientClaimChange,
}: Readonly<ReceiptPanelProps>) {
  return (
    <div className="tab-panel single-tab-panel">
      <div className="panel result-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Verification</p>
            <h3>Trust receipt</h3>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onClientClaimChange(tamperClaim(selectedLeaf))}
          >
            Tamper test
          </button>
        </div>

        <div className={verification.valid ? "receipt-card verified" : "receipt-card rejected"}>
          <span className={verification.valid ? "status good" : "status bad"}>
            {verification.valid ? "Verified" : "Rejected"}
          </span>
          <h3>
            {verification.valid
              ? "This row belongs to the committed DEX dataset."
              : "This claim does not match the committed dataset."}
          </h3>
          <p>
            The client checks one row against the public Merkle root. It does
            not need the full swap table, server database, or indexer state.
          </p>
          <div className="receipt-metrics">
            <span>{rowsLength} rows sealed</span>
            <span>{proof.siblings.length} proof hashes sent</span>
            <span>0 full dataset download</span>
          </div>
        </div>

        <div className="receipt-breakdown" aria-label="Cryptographic receipt breakdown">
          <div className="receipt-line" aria-hidden="true" />
          {RECEIPT_BREAKDOWN.map((item, index) => (
            <article key={item.label}>
              <span>{index + 1}</span>
              <small>{item.label}</small>
              <b>{item.value}</b>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="claim-card">
          <div>
            <p className="eyebrow">Claim being checked</p>
            <h4>Row #{selectedRow}</h4>
          </div>
          <textarea
            className="claim-box"
            id="client-claim"
            aria-label="Claim the client received"
            value={clientClaim}
            onChange={(event) => onClientClaimChange(event.target.value)}
          />
          <div className="claim-actions">
            <button type="button" onClick={() => onClientClaimChange(selectedLeaf)}>
              Restore real row
            </button>
            <button className="ghost-button" type="button" onClick={() => onClientClaimChange("")}>
              Clear claim
            </button>
          </div>
        </div>

        <div className="plain-proof">
          {JUDGE_CARDS.map((card) => (
            <article key={card.label}>
              <span>{card.label}</span>
              <p>{card.value}</p>
            </article>
          ))}
        </div>

        <details className="technical-details">
          <summary>Break down the cryptographic receipt</summary>
          <div className="term-list">
            {TECH_TERMS.map((term) => (
              <article key={term.label}>
                <div>
                  <b>{term.label}</b>
                  <p>{term.meaning}</p>
                </div>
                <code>{short(term.getValue(proof, verification))}</code>
              </article>
            ))}
          </div>
          <Result label="Selected dataset row" value={`#${selectedRow} ${proof.leaf}`} />

          <div className="proof-list">
            <p className="eyebrow">Receipt helper hashes</p>
            {proof.siblings.map((step, index) => (
              <div className="proof-step" key={`${step.hash}-${index}`}>
                <span>{index + 1}</span>
                <b>{step.side} sibling</b>
                <code>{short(step.hash, 36)}</code>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

function Result({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="result">
      <span>{label}</span>
      <code>{short(value)}</code>
    </div>
  );
}
