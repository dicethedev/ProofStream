import {
  LuArrowRight,
  LuCircleCheck,
  LuFingerprint,
  LuListChecks,
  LuRefreshCw,
  LuRows3,
} from "react-icons/lu";
import { parseReceiptRows } from "../../utils/receiptRows";
import { short } from "../../utils/text";
import { formatPairLabel, IndexedUsdValue, TokenAmountValue } from "./ActivityValue";
import { TokenPairAvatar } from "./TokenPairAvatar";

type DatasetPanelProps = {
  readonly message: string;
  readonly network: string;
  readonly rows: string[];
  readonly rowsText: string;
  readonly schema: "sushiswap-v3" | "uniswap-v3";
  readonly selectedRow: number;
  readonly onOpenReceipt: () => void;
  readonly onRowsTextChange: (value: string) => void;
  readonly onSelectedRowChange: (value: number) => void;
  readonly onUseJsonRows: () => void;
};

export function DatasetPanel({
  message,
  network,
  rows,
  rowsText,
  schema,
  selectedRow,
  onOpenReceipt,
  onRowsTextChange,
  onSelectedRowChange,
  onUseJsonRows,
}: DatasetPanelProps) {
  const parsedRows = parseReceiptRows(rows);
  const safeSelectedRow = Math.min(selectedRow, Math.max(rows.length - 1, 0));

  return (
    <div className="tab-panel dataset-experience">
      <header className="dataset-experience-heading">
        <div>
          <p className="eyebrow">Read the dataset</p>
          <h3>Choose the activity you want to prove.</h3>
          <p>
            Every card below came from one JSON object. Pick a card to create a
            receipt for that exact activity.
          </p>
        </div>
        <button type="button" onClick={onUseJsonRows}>
          <LuRefreshCw aria-hidden="true" /> Refresh from JSON
        </button>
      </header>

      <section className="dataset-plain-guide">
        <LuFingerprint aria-hidden="true" />
        <div>
          <b>One list, one tamper-evident fingerprint</b>
          <p>
            ProofStream hashes all {rows.length} activities into one Merkle root.
            If any row changes, that fingerprint changes too.
          </p>
        </div>
      </section>

      <div className="dataset-summary-v2" aria-label="Dataset summary">
        <article>
          <LuRows3 aria-hidden="true" />
          <span><b>{rows.length}</b> readable activities</span>
        </article>
        <article>
          <LuListChecks aria-hidden="true" />
          <span><b>Row #{safeSelectedRow}</b> selected for proof</span>
        </article>
        <article>
          <LuFingerprint aria-hidden="true" />
          <span><b>One root</b> represents the full list</span>
        </article>
      </div>

      {parsedRows.length > 0 ? (
        <div className="dataset-activity-list" aria-label="Readable DEX activities">
          {parsedRows.map((row, index) => {
            const selected = index === safeSelectedRow;

            return (
              <button
                key={`${row.raw}-${index}`}
                type="button"
                className={selected ? "dataset-activity selected" : "dataset-activity"}
                aria-pressed={selected}
                onClick={() => onSelectedRowChange(index)}
              >
                <span className="dataset-activity-choice">
                  {selected ? <LuCircleCheck aria-hidden="true" /> : <i />}
                  <small>{selected ? "Selected for receipt" : `Activity ${index + 1}`}</small>
                </span>
                <span className="dataset-activity-pair">
                  <small>Token pair</small>
                  <span className="dataset-activity-pair-name">
                    <TokenPairAvatar
                      network={network}
                      token0Address={row.token0Address}
                      token0Symbol={row.token0Symbol}
                      token1Address={row.token1Address}
                      token1Symbol={row.token1Symbol}
                    />
                    <b>{formatPairLabel(row.pair)}</b>
                  </span>
                  <TokenAmountValue
                    amount={row.amount}
                    network={network}
                    rawUnits={schema === "sushiswap-v3"}
                    token0Address={row.token0Address}
                    token0Symbol={row.token0Symbol}
                    token1Address={row.token1Address}
                    token1Symbol={row.token1Symbol}
                  />
                </span>
                <span>
                  <small>Indexed value</small>
                  <IndexedUsdValue value={row.usd} />
                </span>
                <span>
                  <small>Transaction origin</small>
                  <code>{short(row.origin, 20)}</code>
                </span>
                <span>
                  <small>Transaction / block</small>
                  <code>{short(row.tx, 16)} · {row.block}</code>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="dataset-empty-state">
          <LuRows3 aria-hidden="true" />
          <h4>No readable activities yet</h4>
          <p>Return to Query, fetch data, then convert the JSON response into rows.</p>
        </div>
      )}

      <div className="dataset-next-action">
        <div>
          <small>Next step</small>
          <b>Create a receipt for row #{safeSelectedRow}</b>
          <p>The client will receive this row and only the hashes needed to check it.</p>
        </div>
        <button type="button" onClick={onOpenReceipt} disabled={rows.length === 0}>
          Create proof receipt <LuArrowRight aria-hidden="true" />
        </button>
      </div>

      <details className="raw-dataset-editor">
        <summary>Advanced: edit the normalized receipt rows</summary>
        <p>
          One line is one activity. Editing a line lets you test how a changed
          dataset produces a different fingerprint.
        </p>
        <textarea
          id="rows"
          value={rowsText}
          onChange={(event) => onRowsTextChange(event.target.value)}
          spellCheck={false}
        />
      </details>

      <p className="dataset-message"><LuCircleCheck aria-hidden="true" /> {message}</p>
    </div>
  );
}
