import { useEffect, useState } from "react";
import type { DexPreset } from "../../data/dexPresets";
import { dexLogoUrl } from "../../data/dexPresets";
import type { GraphFetchMode } from "../../lib/graph";
import { dexInitials, short, sourceLabel } from "../../utils/text";

type ProofLabHeaderProps = {
  readonly loading: boolean;
  readonly mode: GraphFetchMode;
  readonly preset: DexPreset;
  readonly subgraphId: string;
  readonly onRun: () => void;
};

export function ProofLabHeader({ loading, mode, preset, subgraphId, onRun }: ProofLabHeaderProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logoUrl = dexLogoUrl(preset);

  useEffect(() => {
    setLogoFailed(false);
  }, [preset.id]);

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
          <p>
            <span className="live-dot" /> ProofStream source
          </p>
          <h3>{preset.name}</h3>
          <div className="subgraph-meta">
            <Meta label="Network" value={preset.network} />
            <Meta label="Mode" value={sourceLabel(mode)} />
            <Meta label="Subgraph ID" value={short(subgraphId || "custom", 24)} />
          </div>
        </div>
        <button className="run-query-top" type="button" onClick={onRun} disabled={loading}>
          {loading ? "Querying" : "Query"}
        </button>
      </div>

      <div className="index-status">
        <span className="sync-badge"><span /> Ready</span>
        <div />
        <small>
          <span className="realtime-icon" aria-hidden="true" />{" "}
          Realtime path: JSON data → human rows → cryptographic receipt
        </small>
      </div>
    </>
  );
}

function Meta({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
