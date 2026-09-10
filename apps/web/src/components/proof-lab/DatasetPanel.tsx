import { parseReceiptRows } from "../../utils/receiptRows";
import { short } from "../../utils/text";

type DatasetPanelProps = {
  readonly message: string;
  readonly rows: string[];
  readonly rowsText: string;
  readonly selectedRow: number;
  readonly onRowsTextChange: (value: string) => void;
  readonly onSelectedRowChange: (value: number) => void;
  readonly onUseJsonRows: () => void;
};

export function DatasetPanel({
  message,
  rows,
  rowsText,
  selectedRow,
  onRowsTextChange,
  onSelectedRowChange,
  onUseJsonRows,
}: DatasetPanelProps) {
  const parsedRows = parseReceiptRows(rows);

  return (
    <div className="tab-panel single-tab-panel">
      <div className="panel dataset-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Dataset</p>
            <h3>Rows ProofStream will seal into one root</h3>
            <p>
              Each card is one DEX event from the JSON result. ProofStream hashes
              these rows into one Merkle root, then proves only the row you pick.
            </p>
          </div>
          <button className="ghost-button" type="button" onClick={onUseJsonRows}>
            Use JSON rows
          </button>
        </div>

        <div className="dataset-summary" aria-label="Dataset summary">
          <article>
            <span>Rows sealed</span>
            <b>{rows.length}</b>
            <p>Total rows that become the dataset fingerprint.</p>
          </article>
          <article>
            <span>Proof target</span>
            <b>Row #{Math.min(selectedRow, Math.max(rows.length - 1, 0))}</b>
            <p>The one row the client will verify.</p>
          </article>
          <article>
            <span>Dataset shape</span>
            <b>Merkle root</b>
            <p>One public fingerprint for the full list.</p>
          </article>
        </div>

        <div className="dataset-table" aria-label="Readable DEX rows">
          {parsedRows.map((row, index) => (
            <button
              key={`${row.raw}-${index}`}
              type="button"
              className={index === selectedRow ? "dataset-row active" : "dataset-row"}
              onClick={() => onSelectedRowChange(index)}
            >
              <span className="row-index">#{index}</span>
              <span>
                <small>Pair</small>
                <b>{row.pair}</b>
              </span>
              <span>
                <small>USD</small>
                <b>{row.usd}</b>
              </span>
              <span>
                <small>Origin</small>
                <code>{short(row.origin, 18)}</code>
              </span>
              <span>
                <small>Tx / block</small>
                <code>{short(row.tx, 18)} · {row.block}</code>
              </span>
            </button>
          ))}
        </div>

        <label htmlFor="row">Which row should the client check?</label>
        <input
          id="row"
          type="number"
          min={0}
          max={Math.max(rows.length - 1, 0)}
          value={selectedRow}
          onChange={(event) => onSelectedRowChange(Number(event.target.value))}
        />

        <details className="raw-dataset-editor">
          <summary>Edit raw receipt rows</summary>
          <p>
            One line equals one receipt row. You can change names, amounts, tx
            hashes, or paste your own rows, then open the Receipt tab to verify.
          </p>
          <textarea
            id="rows"
            value={rowsText}
            onChange={(event) => onRowsTextChange(event.target.value)}
            spellCheck={false}
          />
        </details>

        <p className="hint">{message}</p>
      </div>
    </div>
  );
}
