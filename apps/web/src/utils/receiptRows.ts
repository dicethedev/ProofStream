export type ReceiptRow = {
  amount: string;
  block: string;
  origin: string;
  pair: string;
  raw: string;
  tx: string;
  usd: string;
};

const EMPTY_VALUE = "unknown";

export function parseReceiptRow(raw: string): ReceiptRow {
  const fields = Object.fromEntries(
    raw
      .split("|")
      .map((part) => part.trim())
      .map((part) => {
        const separator = part.indexOf(":");

        if (separator === -1) return [part, ""];

        return [part.slice(0, separator), part.slice(separator + 1)];
      }),
  );

  return {
    amount: fields.amount || EMPTY_VALUE,
    block: fields.block || EMPTY_VALUE,
    origin: fields.origin || EMPTY_VALUE,
    pair: fields.swap || fields.tx || "row",
    raw,
    tx: fields.tx || EMPTY_VALUE,
    usd: fields.usd || EMPTY_VALUE,
  };
}

export function parseReceiptRows(rows: string[]) {
  return rows.map(parseReceiptRow);
}
