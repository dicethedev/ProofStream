import { useMemo, useState } from "react";
import { fetchGraphEvents } from "../lib/graph";
import { buildMerkleProof } from "../lib/merkle";

const SAMPLE_ROWS = [
  "tx:alice->bob:100",
  "tx:bob->carol:50",
  "tx:carol->dave:25",
  "tx:dave->erin:10",
].join("\n");

export function ProofLab() {
  const [rowsText, setRowsText] = useState(SAMPLE_ROWS);
  const [selectedRow, setSelectedRow] = useState(0);
  const [wallet, setWallet] = useState(import.meta.env.VITE_DEFAULT_WALLET ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Edit rows or fetch live data, then generate a proof.");

  const rows = useMemo(
    () => rowsText.split("\n").map((row) => row.trim()).filter(Boolean),
    [rowsText],
  );

  const proof = useMemo(() => buildMerkleProof(rows, selectedRow), [rows, selectedRow]);

  async function loadGraphData() {
    setLoading(true);
    setMessage("Fetching live indexed rows from The Graph...");

    try {
      const events = await fetchGraphEvents(wallet);
      setRowsText(events.join("\n"));
      setSelectedRow(0);
      setMessage(`Loaded ${events.length} live rows. Now generate or inspect a proof.`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      setMessage(`${detail} Using editable demo rows for now.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" id="lab">
      <div className="section-heading">
        <p className="eyebrow">Live proof lab</p>
        <h2>Edit records. Pick a row. Verify the receipt.</h2>
        <p>
          The browser rebuilds the Merkle root from only the selected row and
          its sibling hashes. That is the light-client story in one screen.
        </p>
      </div>

      <div className="lab-grid">
        <div className="panel">
          <label htmlFor="wallet">Wallet or address to query</label>
          <div className="inline-form">
            <input
              id="wallet"
              value={wallet}
              onChange={(event) => setWallet(event.target.value)}
              placeholder="0x..."
            />
            <button type="button" onClick={loadGraphData} disabled={loading}>
              {loading ? "Loading" : "Fetch The Graph"}
            </button>
          </div>

          <label htmlFor="rows">Transactions or indexed rows</label>
          <textarea
            id="rows"
            value={rowsText}
            onChange={(event) => setRowsText(event.target.value)}
          />

          <label htmlFor="row">Which row should the client check?</label>
          <input
            id="row"
            type="number"
            min={0}
            max={Math.max(rows.length - 1, 0)}
            value={selectedRow}
            onChange={(event) => setSelectedRow(Number(event.target.value))}
          />
          <p className="hint">{message}</p>
        </div>

        <div className="panel result-panel">
          <div className="status-row">
            <span className={proof.valid ? "status good" : "status bad"}>
              {proof.valid ? "Verified" : "Invalid row"}
            </span>
            <span>{rows.length} rows</span>
            <span>{proof.siblings.length} proof hashes</span>
          </div>

          <Result label="Checked row" value={`#${selectedRow} ${proof.leaf}`} />
          <Result label="Merkle root" value={proof.root} />
          <Result label="Client recomputed" value={proof.recomputedRoot} />
          <Result label="Leaf hash" value={proof.leafHash} />

          <div className="proof-list">
            <p className="eyebrow">Tiny proof sent to the client</p>
            {proof.siblings.map((step, index) => (
              <div className="proof-step" key={`${step.hash}-${index}`}>
                <span>{index + 1}</span>
                <b>{step.side} sibling</b>
                <code>{short(step.hash, 36)}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="result">
      <span>{label}</span>
      <code>{short(value)}</code>
    </div>
  );
}

function short(value: string, size = 44) {
  if (value.length <= size) return value;
  return `${value.slice(0, size)}...`;
}
