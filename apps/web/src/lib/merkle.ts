import { keccak_256 } from "@noble/hashes/sha3";
import { utf8ToBytes } from "@noble/hashes/utils";

export type ProofStep = {
  side: "Left" | "Right";
  hash: string;
};

export type BrowserProof = {
  valid: boolean;
  leaf: string;
  leafHash: string;
  root: string;
  recomputedRoot: string;
  siblings: ProofStep[];
};

export type VerificationResult = {
  valid: boolean;
  leafHash: string;
  recomputedRoot: string;
};

export function buildMerkleProof(rows: string[], selectedIndex: number): BrowserProof {
  if (!rows.length || selectedIndex < 0 || selectedIndex >= rows.length) {
    return emptyProof(selectedIndex);
  }

  const paddedLeafCount = nextPowerOfTwo(rows.length);
  const leaves = rows.map((row) => leafHash(row));

  while (leaves.length < paddedLeafCount) {
    leaves.push(emptyHash());
  }

  const levels: Uint8Array[][] = [leaves];
  while (levels.at(-1)!.length > 1) {
    const current = levels.at(-1)!;
    const next: Uint8Array[] = [];

    for (let index = 0; index < current.length; index += 2) {
      next.push(nodeHash(current[index], current[index + 1]));
    }

    levels.push(next);
  }

  const siblings: ProofStep[] = [];
  let cursor = selectedIndex;

  for (let level = 0; level < levels.length - 1; level += 1) {
    const isRight = cursor % 2 === 1;
    const siblingIndex = isRight ? cursor - 1 : cursor + 1;

    siblings.push({
      side: isRight ? "Left" : "Right",
      hash: toHex(levels[level][siblingIndex]),
    });

    cursor = Math.floor(cursor / 2);
  }

  const verification = verifyMerkleProof(rows[selectedIndex], toHex(levels.at(-1)![0]), siblings);
  const root = toHex(levels.at(-1)![0]);

  return {
    valid: verification.valid,
    leaf: rows[selectedIndex],
    leafHash: verification.leafHash,
    root,
    recomputedRoot: verification.recomputedRoot,
    siblings,
  };
}

export function verifyMerkleProof(
  row: string,
  expectedRoot: string,
  siblings: ProofStep[],
): VerificationResult {
  const recomputedRoot = recomputeRoot(row, siblings);

  return {
    valid: recomputedRoot === expectedRoot,
    leafHash: toHex(leafHash(row)),
    recomputedRoot,
  };
}

function recomputeRoot(row: string, siblings: ProofStep[]) {
  let current = leafHash(row);

  for (const sibling of siblings) {
    const siblingHash = fromHex(sibling.hash);
    current = sibling.side === "Left"
      ? nodeHash(siblingHash, current)
      : nodeHash(current, siblingHash);
  }

  return toHex(current);
}

function leafHash(row: string) {
  return keccak_256(new Uint8Array([0, ...utf8ToBytes(row)]));
}

function nodeHash(left: Uint8Array, right: Uint8Array) {
  return keccak_256(new Uint8Array([1, ...left, ...right]));
}

function emptyHash() {
  return keccak_256(new Uint8Array([0]));
}

function nextPowerOfTwo(value: number) {
  return 2 ** Math.ceil(Math.log2(Math.max(value, 1)));
}

function emptyProof(index: number): BrowserProof {
  return {
    valid: false,
    leaf: `No row at index ${index}`,
    leafHash: "0x",
    root: "0x",
    recomputedRoot: "0x",
    siblings: [],
  };
}

function toHex(bytes: Uint8Array) {
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function fromHex(hex: string) {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(clean.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}
