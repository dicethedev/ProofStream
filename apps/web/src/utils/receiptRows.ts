export type ReceiptRow = {
  amount: string;
  block: string;
  origin: string;
  pair: string;
  raw: string;
  token0Address: string;
  token0Symbol: string;
  token1Address: string;
  token1Symbol: string;
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
  const pair = fields.swap || fields.tx || "row";
  const [token0Symbol = "?", token1Symbol = "?"] = pair.split("/");

  return {
    amount: fields.amount || EMPTY_VALUE,
    block: fields.block || EMPTY_VALUE,
    origin: fields.origin || EMPTY_VALUE,
    pair,
    raw,
    token0Address: fields.token0 || "",
    token0Symbol,
    token1Address: fields.token1 || "",
    token1Symbol,
    tx: fields.tx || EMPTY_VALUE,
    usd: fields.usd || EMPTY_VALUE,
  };
}

export function parseReceiptRows(rows: string[]) {
  return rows.map(parseReceiptRow);
}
