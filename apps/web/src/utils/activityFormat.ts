export type FormattedTokenAmounts = {
  detail: string;
  display: string;
  value0: string;
  value1: string;
};

export function formatPairLabel(pair: string) {
  return pair.replace("/", " ↔ ");
}

export function formatUsd(value: string) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value === "unknown" ? "USD unavailable" : value;

  const absolute = Math.abs(numeric);
  const maximumFractionDigits = absolute > 0 && absolute < 0.01 ? 6 : 2;
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: absolute >= 0.01 ? 2 : 0,
    notation: absolute >= 1_000_000 ? "compact" : "standard",
    style: "currency",
  }).format(absolute);
}

export function exactUsdLabel(value: string) {
  return isNumeric(value) ? `$${stripSign(value)} USD` : value;
}

export function formatTokenAmounts({
  amount,
  decimals0,
  decimals1,
  name0,
  name1,
  rawUnits,
  symbol0,
  symbol1,
}: {
  readonly amount: string;
  readonly decimals0?: number;
  readonly decimals1?: number;
  readonly name0?: string;
  readonly name1?: string;
  readonly rawUnits: boolean;
  readonly symbol0: string;
  readonly symbol1: string;
}): FormattedTokenAmounts {
  const [source0 = "unknown", source1 = "unknown"] = amount.split("/");
  const value0 = normalizeTokenAmount(source0, rawUnits ? decimals0 : undefined);
  const value1 = normalizeTokenAmount(source1, rawUnits ? decimals1 : undefined);

  return {
    detail: [
      `${name0 ?? symbol0}: ${value0} ${symbol0}`,
      `${name1 ?? symbol1}: ${value1} ${symbol1}`,
      rawUnits ? `Source units: ${source0} / ${source1}` : "",
    ].filter(Boolean).join("\n"),
    display: `${formatTokenNumber(value0)} ${symbol0} ↔ ${formatTokenNumber(value1)} ${symbol1}`,
    value0,
    value1,
  };
}

function formatTokenNumber(value: string) {
  const numeric = Math.abs(Number(value));
  if (!Number.isFinite(numeric)) return value;
  if (numeric === 0) return "0";
  if (numeric < 0.000001) return numeric.toExponential(2);

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: numeric < 1 ? 6 : 4,
    notation: numeric >= 1_000_000 ? "compact" : "standard",
  }).format(numeric);
}

function normalizeTokenAmount(value: string, decimals?: number) {
  const trimmed = stripSign(value);
  if (decimals === undefined || trimmed.includes(".") || !/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  const padded = trimmed.padStart(decimals + 1, "0");
  const integer = padded.slice(0, -decimals) || "0";
  const fraction = decimals === 0 ? "" : padded.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${integer}.${fraction}` : integer;
}

function stripSign(value: string) {
  return value.trim().replace(/^[+-]/, "");
}

function isNumeric(value: string) {
  return value.trim() !== "" && Number.isFinite(Number(value));
}
