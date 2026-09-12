import { useEffect, useState } from "react";
import {
  LuArrowRight,
  LuCheck,
  LuCircleCheck,
  LuCopy,
  LuExternalLink,
  LuFileJson,
  LuPlay,
  LuReceiptText,
  LuRows3,
} from "react-icons/lu";
import type { DexPreset } from "../../data/dexPresets";
import { dexLogoUrl } from "../../data/dexPresets";
import type { GraphFetchMode } from "../../lib/graph";
import { copyToClipboard } from "../../utils/clipboard";
import { dexInitials, short, sourceLabel } from "../../utils/text";

type ProofLabHeaderProps = {
  readonly loading: boolean;
  readonly mode: GraphFetchMode;
  readonly preset: DexPreset;
  readonly rowCount: number;
  readonly subgraphId: string;
  readonly onRun: () => void;
};

export function ProofLabHeader({
  loading,
  mode,
  preset,
  rowCount,
  subgraphId,
  onRun,
}: ProofLabHeaderProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const logoUrl = dexLogoUrl(preset);
  const explorerUrl = subgraphId
    ? `https://thegraph.com/explorer/subgraphs/${encodeURIComponent(subgraphId)}`
    : "";

  useEffect(() => {
    setLogoFailed(false);
  }, [preset.id]);

  useEffect(() => {
    setCopied(false);
  }, [subgraphId]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copySubgraphId() {
    if (!subgraphId) return;
    await copyToClipboard(subgraphId);
    setCopied(true);
  }

  return (
    <>
      <div className="subgraph-header">
        <div className="subgraph-logo" aria-label={`${preset.name} logo`}>
          {logoUrl && !logoFailed ? (
            <img src={logoUrl} alt="" onError={() => setLogoFailed(true)} />
          ) : (
            dexInitials(preset.name)
          )}
        </div>
        <div className="subgraph-title">
          <span className="source-kicker">Selected data source</span>
          <h3>{preset.name}</h3>
          <div className="subgraph-meta">
            <Meta label="Network" value={preset.network} />
            <Meta label="Mode" value={sourceLabel(mode)} />
            <div className="subgraph-id-meta">
              <span>Subgraph ID</span>
              <div className="subgraph-id-value">
                <code title={subgraphId}>{short(subgraphId || "custom", 24)}</code>
                <button
                  type="button"
                  onClick={copySubgraphId}
                  disabled={!subgraphId}
                  aria-label={copied ? "Subgraph ID copied" : "Copy Subgraph ID"}
                  title={copied ? "Copied" : "Copy Subgraph ID"}
                >
                  {copied ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
                </button>
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open this subgraph in The Graph Explorer"
                    title="Open in The Graph Explorer"
                  >
                    <LuExternalLink aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="source-run-area">
          <span><LuCircleCheck aria-hidden="true" /> Ready to query</span>
          <button
            className="run-query-top"
            type="button"
            onClick={onRun}
            disabled={loading}
          >
            <LuPlay aria-hidden="true" /> {loading ? "Fetching data" : "Run query"}
          </button>
        </div>
      </div>

      <div className="index-status">
        <span className="source-row-count">
          {rowCount} {rowCount === 1 ? "row" : "rows"} in the current dataset
        </span>
        <div
          className="realtime-pipeline"
          aria-label="Data-to-proof workflow"
        >
          <b><LuFileJson aria-hidden="true" /> Raw JSON</b>
          <i aria-hidden="true">
            <LuArrowRight />
          </i>
          <b><LuRows3 aria-hidden="true" /> Readable rows</b>
          <i aria-hidden="true">
            <LuArrowRight />
          </i>
          <b><LuReceiptText aria-hidden="true" /> Proof receipt</b>
        </div>
      </div>
    </>
  );
}

function Meta({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
