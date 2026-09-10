type DatasetPanelProps = {
  message: string;
  rowsLength: number;
  rowsText: string;
  selectedRow: number;
  onRowsTextChange: (value: string) => void;
  onSelectedRowChange: (value: number) => void;
  onUseJsonRows: () => void;
};

export function DatasetPanel({
  message,
  rowsLength,
  rowsText,
  selectedRow,
  onRowsTextChange,
  onSelectedRowChange,
  onUseJsonRows,
}: DatasetPanelProps) {
  return (
    <div className="tab-panel single-tab-panel">
      <div className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Dataset</p>
            <h3>Rows ProofStream will seal</h3>
          </div>
          <button className="ghost-button" type="button" onClick={onUseJsonRows}>
            Use JSON rows
          </button>
        </div>

        <label htmlFor="rows">Rows to commit</label>
        <textarea
          id="rows"
          value={rowsText}
          onChange={(event) => onRowsTextChange(event.target.value)}
        />

        <label htmlFor="row">Which row should the client check?</label>
        <input
          id="row"
          type="number"
          min={0}
          max={Math.max(rowsLength - 1, 0)}
          value={selectedRow}
          onChange={(event) => onSelectedRowChange(Number(event.target.value))}
        />
        <p className="hint">{message}</p>
      </div>
    </div>
  );
}
