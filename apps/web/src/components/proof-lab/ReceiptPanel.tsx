import type { BrowserProof, VerificationResult } from "../../lib/merkle";
import { parseReceiptRow } from "../../utils/receiptRows";
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

export function ReceiptPanel({
  clientClaim,
  proof,
  rowsLength,
  selectedLeaf,
  selectedRow,
  verification,
  onClientClaimChange,
}: Readonly<ReceiptPanelProps>) {
  const row = parseReceiptRow(selectedLeaf);
  const decision = verification.valid ? "Verified" : "Rejected";
  const proofSummary = [
    {
      label: "Claim",
      title: `Row #${selectedRow}`,
      text: verification.valid
        ? "The client received this exact row."
        : "The claim has been changed or no longer matches the receipt.",
    },
    {
      label: "Proof",
      title: `${proof.siblings.length} helper hashes`,
      text: "Only the missing path pieces are sent, not the full DEX dataset.",
    },
    {
      label: "Decision",
      title: decision,
      text: verification.valid
        ? "The recomputed fingerprint matches the public Merkle root."
        : "The recomputed fingerprint is different, so the client rejects it.",
    },
  ];

  return (
    <div className="tab-panel single-tab-panel">
      <div className="panel result-panel receipt-simple">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Receipt</p>
            <h3>Can the client trust this one row?</h3>
            <p>
              The client checks one DEX row with a tiny proof. It does not need
              your database, the full JSON response, or every row in the dataset.
            </p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onClientClaimChange(tamperClaim(selectedLeaf))}
          >
            Tamper test
          </button>
        </div>

        <section className={verification.valid ? "receipt-hero verified" : "receipt-hero rejected"}>
          <div>
            <span className={verification.valid ? "status good" : "status bad"}>{decision}</span>
            <h3>
              {verification.valid
                ? "This row is proven to be inside the sealed DEX dataset."
                : "This row does not match the sealed DEX dataset."}
            </h3>
            <p>
              ProofStream rebuilds the same Merkle root from the row and proof.
              Matching roots mean the receipt is genuine.
            </p>
          </div>

          <div className="receipt-proof-meter" aria-label="Proof size summary">
            <b>{rowsLength}</b>
            <span>rows sealed</span>
            <i />
            <b>{proof.siblings.length}</b>
            <span>hashes sent</span>
          </div>
        </section>

        <div className="receipt-explain-grid">
          {proofSummary.map((item, index) => (
            <article key={item.label}>
              <span>{index + 1}</span>
              <small>{item.label}</small>
              <b>{item.title}</b>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <section className="human-row-card" aria-label="Selected row details">
          <div>
            <p className="eyebrow">Selected DEX row</p>
            <h4>{row.pair}</h4>
          </div>
          <dl>
            <div>
              <dt>USD value</dt>
              <dd>{row.usd}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>{row.amount}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>{short(row.origin, 24)}</dd>
            </div>
            <div>
              <dt>Tx / block</dt>
              <dd>{short(row.tx, 24)} · {row.block}</dd>
            </div>
          </dl>
        </section>

        <section className="claim-card simplified-claim">
          <div>
            <p className="eyebrow">Try it yourself</p>
            <h4>Edit the row the client received</h4>
            <p>
              Change an amount, address, or token pair. A real receipt should
              reject any changed claim immediately.
            </p>
          </div>
          <textarea
            className="claim-box"
            id="client-claim"
            aria-label="Claim the client received"
            value={clientClaim}
            onChange={(event) => onClientClaimChange(event.target.value)}
            spellCheck={false}
          />
          <div className="claim-actions">
            <button type="button" onClick={() => onClientClaimChange(selectedLeaf)}>
              Restore real row
            </button>
            <button className="ghost-button" type="button" onClick={() => onClientClaimChange("")}>
              Clear claim
            </button>
          </div>
        </section>

        <details className="technical-details">
          <summary>Developer details: hashes and proof path</summary>
          <div className="term-list">
            <Result label="Public Merkle root" value={proof.root || verification.recomputedRoot} />
            <Result label="Client recomputed root" value={verification.recomputedRoot} />
            <Result label="Leaf hash" value={verification.leafHash} />
            <Result label="Selected dataset row" value={`#${selectedRow} ${proof.leaf}`} />
          </div>

          <div className="proof-list">
            <p className="eyebrow">Receipt helper hashes</p>
            {proof.siblings.map((step, index) => (
              <div className="proof-step" key={`${step.hash}-${index}`}>
                <span>{index + 1}</span>
                <b>{step.side} sibling</b>
                <code>{short(step.hash, 42)}</code>
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
    <article>
      <div>
        <b>{label}</b>
        <p>{explainTerm(label)}</p>
      </div>
      <code>{short(value)}</code>
    </article>
  );
}

function explainTerm(label: string) {
  if (label === "Public Merkle root") return "Fingerprint for the full dataset.";
  if (label === "Client recomputed root") return "Fingerprint rebuilt from the row and proof.";
  if (label === "Leaf hash") return "Fingerprint of the selected row.";
  return "The exact row included in the receipt.";
}
