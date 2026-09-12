import {
  LuBadgeCheck,
  LuBraces,
  LuCircleX,
  LuFingerprint,
  LuRefreshCw,
  LuRoute,
  LuShieldCheck,
} from "react-icons/lu";
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

  return (
    <div className="tab-panel receipt-experience">
      <header className="receipt-experience-heading">
        <div>
          <p className="eyebrow">Check the receipt</p>
          <h3>Does this activity belong to the sealed dataset?</h3>
          <p>
            The browser checks the selected row against the public dataset root.
            It does not need the full response or access to a backend database.
          </p>
        </div>
        <button type="button" onClick={() => onClientClaimChange(tamperClaim(selectedLeaf))}>
          <LuBraces aria-hidden="true" /> Try a changed claim
        </button>
      </header>

      <section className={verification.valid ? "receipt-verdict accepted" : "receipt-verdict rejected"}>
        <span className="receipt-verdict-icon">
          {verification.valid ? <LuBadgeCheck aria-hidden="true" /> : <LuCircleX aria-hidden="true" />}
        </span>
        <div>
          <small>Browser result</small>
          <h3>{decision}</h3>
          <p>
            {verification.valid
              ? "The activity matches the receipt and belongs to the exact dataset represented by this root."
              : "The activity no longer produces the expected root, so the browser refuses the claim."}
          </p>
        </div>
        <dl>
          <div><dt>Dataset</dt><dd>{rowsLength} activities</dd></div>
          <div><dt>Receipt size</dt><dd>{proof.siblings.length} helper hashes</dd></div>
          <div><dt>Checked</dt><dd>Row #{selectedRow}</dd></div>
        </dl>
      </section>

      <section className="receipt-checked-row" aria-label="Activity checked by the browser">
        <header>
          <div>
            <p className="eyebrow">Activity checked</p>
            <h4>{row.pair}</h4>
          </div>
          <span>Row #{selectedRow}</span>
        </header>
        <dl>
          <div><dt>Indexed USD value</dt><dd>{row.usd}</dd></div>
          <div><dt>Token amounts</dt><dd>{row.amount}</dd></div>
          <div><dt>Transaction origin</dt><dd>{short(row.origin, 26)}</dd></div>
          <div><dt>Transaction / block</dt><dd>{short(row.tx, 22)} · {row.block}</dd></div>
        </dl>
      </section>

      <section className="receipt-check-explainer">
        <header>
          <p className="eyebrow">What happened in the browser?</p>
          <h4>Three inputs produced one yes-or-no answer.</h4>
        </header>
        <div>
          <article>
            <LuBraces aria-hidden="true" />
            <b>The activity row</b>
            <p>The exact readable record the client wants to check.</p>
          </article>
          <article>
            <LuRoute aria-hidden="true" />
            <b>The helper hashes</b>
            <p>A small path that reconnects this row to the full dataset.</p>
          </article>
          <article>
            <LuFingerprint aria-hidden="true" />
            <b>The public root</b>
            <p>The expected fingerprint. A match means the row was not changed.</p>
          </article>
        </div>
      </section>

      <section className="receipt-tamper-lab">
        <div>
          <p className="eyebrow">Tamper test</p>
          <h4>Change the claim and watch verification fail.</h4>
          <p>
            Edit an amount, address, or token pair below. Restore the original
            row to make the receipt valid again.
          </p>
        </div>
        <textarea
          id="client-claim"
          aria-label="Activity claim received by the client"
          value={clientClaim}
          onChange={(event) => onClientClaimChange(event.target.value)}
          spellCheck={false}
        />
        <button type="button" onClick={() => onClientClaimChange(selectedLeaf)}>
          <LuRefreshCw aria-hidden="true" /> Restore original activity
        </button>
      </section>

      <aside className="receipt-scope-note">
        <LuShieldCheck aria-hidden="true" />
        <p>
          <b>What this proves:</b> this row belongs to the sealed response.
          It does not prove that the upstream indexer interpreted the blockchain correctly.
        </p>
      </aside>

      <details className="technical-details receipt-developer-details">
        <summary>Developer details: inspect roots and proof path</summary>
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
