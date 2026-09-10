export function short(value: string, size = 44) {
  if (value.length <= size) return value;
  return `${value.slice(0, size)}...`;
}

export function dexInitials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => !/^v\d+/i.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "DX";
}

export function sourceLabel(mode: "recent" | "pool" | "wallet") {
  if (mode === "wallet") return "Wallet swaps";
  if (mode === "pool") return "Pool swaps";
  return "Recent swaps";
}

export function tamperClaim(value: string) {
  if (!value) return "tampered:empty-claim";
  if (value.includes("100")) return value.replace("100", "999");
  return `${value} | tampered:true`;
}
