import type { DexPreset } from "../../data/dexPresets";
import { SOURCE_OPTIONS } from "../../data/proofLabContent";
import type { GraphFetchMode } from "../../lib/graph";
import { queryTemplate } from "../../lib/graph";
import { DexPresetDropdown } from "./DexPresetDropdown";

type QueryPanelProps = {
  readonly apiKey: string;
  readonly endpoint: string;
  readonly jsonText: string;
  readonly loading: boolean;
  readonly mode: GraphFetchMode;
  readonly pool: string;
  readonly presetId: string;
  readonly queryText: string;
  readonly selectedPreset: DexPreset;
  readonly subgraphId: string;
  readonly visibleEndpoint: string;
  readonly wallet: string;
  readonly onApiKeyChange: (value: string) => void;
  readonly onEndpointChange: (value: string) => void;
  readonly onJsonTextChange: (value: string) => void;
  readonly onModeChange: (mode: GraphFetchMode) => void;
  readonly onPoolChange: (value: string) => void;
  readonly onPresetChange: (presetId: string) => void;
  readonly onQueryTextChange: (value: string) => void;
  readonly onRun: () => void;
  readonly onSubgraphIdChange: (value: string) => void;
  readonly onUseJsonRows: () => void;
  readonly onWalletChange: (value: string) => void;
};

export function QueryPanel({
  apiKey,
  endpoint,
  jsonText,
  loading,
  mode,
  pool,
  presetId,
  queryText,
  selectedPreset,
  subgraphId,
  visibleEndpoint,
  wallet,
  onApiKeyChange,
  onEndpointChange,
  onJsonTextChange,
  onModeChange,
  onPoolChange,
  onPresetChange,
  onQueryTextChange,
  onRun,
  onSubgraphIdChange,
  onUseJsonRows,
  onWalletChange,
}: QueryPanelProps) {
  return (
    <div className="tab-panel">
      <div className="query-quickstart">
        <div>
          <h3>Query quick start</h3>
          <p>
            Paste your Graph API key, choose a DEX preset, and run a swaps query.
            ProofStream turns the response into rows you can prove.
          </p>
          <p className="query-format">
            <b>Query URL format</b>
            <code>{"{base_url}/subgraphs/id/{subgraph_id}"}</code>
          </p>
        </div>

        <div className="quick-fields">
          <label htmlFor="api-key">API key</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            placeholder="Paste your Graph Gateway API key"
          />

          <label htmlFor="dex-preset">DEX preset</label>
          <DexPresetDropdown id="dex-preset" selectedPreset={selectedPreset} onChange={onPresetChange} />

          <label htmlFor="subgraph-id">Subgraph ID</label>
          <input
            id="subgraph-id"
            value={subgraphId}
            onChange={(event) => onSubgraphIdChange(event.target.value)}
            placeholder="Paste subgraph ID from Graph Explorer"
          />

          <div className="endpoint-preview">
            <span>Query URL</span>
            <code>{visibleEndpoint || "Choose a subgraph ID"}</code>
          </div>

          <details className="advanced-endpoint">
            <summary>Advanced endpoint override</summary>
            <label htmlFor="endpoint">Direct Graph endpoint</label>
            <textarea
              className="endpoint-input"
              id="endpoint"
              value={endpoint}
              onChange={(event) => onEndpointChange(event.target.value)}
              placeholder="https://gateway.thegraph.com/api/subgraphs/id/{subgraph-id}"
              rows={2}
              spellCheck={false}
            />
          </details>
        </div>
      </div>

      <div className="mode-row" role="radiogroup" aria-label="The Graph query mode">
        {SOURCE_OPTIONS.map((source) => (
          <button
            className={mode === source.mode ? "mode-pill active" : "mode-pill"}
            key={source.mode}
            type="button"
            role="radio"
            aria-checked={mode === source.mode}
            onClick={() => {
              onModeChange(source.mode);
              onQueryTextChange(queryTemplate(source.mode, pool));
            }}
          >
            <span>{source.title}</span>
            <small>{source.description}</small>
          </button>
        ))}
      </div>

      {(mode === "wallet" || mode === "pool") && (
        <div className="filter-row">
          {mode === "wallet" && (
            <label htmlFor="wallet">
                Wallet origin{" "}
              <input
                id="wallet"
                value={wallet}
                onChange={(event) => onWalletChange(event.target.value)}
                placeholder="0x..."
              />
            </label>
          )}

          {mode === "pool" && (
            <label htmlFor="pool">
              Pool address{" "}
              <input
                id="pool"
                value={pool}
                onChange={(event) => {
                  onPoolChange(event.target.value);
                  onQueryTextChange(queryTemplate("pool", event.target.value));
                }}
                placeholder="0x..."
              />
            </label>
          )}
        </div>
      )}

      <div className="graph-console">
        <div className="console-pane">
          <div className="console-toolbar">
            <span>GraphQL</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => onQueryTextChange(queryTemplate(mode, pool))}
              aria-label="Reset query"
            >
              ↺
            </button>
          </div>
          <textarea
            className="code-editor"
            id="graph-query"
            aria-label="Editable GraphQL query"
            value={queryText}
            onChange={(event) => onQueryTextChange(event.target.value)}
            spellCheck={false}
          />
        </div>

        <button className="run-orb" type="button" onClick={onRun} disabled={loading}>
          {loading ? "…" : "▶"}
        </button>

        <div className="console-pane">
          <div className="console-toolbar">
            <span>JSON result</span>
            <button className="icon-button" type="button" onClick={onUseJsonRows} aria-label="Convert JSON to rows">
              ⇣
            </button>
          </div>
          <textarea
            className="json-panel"
            id="json-output"
            aria-label="Editable JSON response from The Graph"
            value={jsonText}
            onChange={(event) => onJsonTextChange(event.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="documentation-cards">
        <a href="https://thegraph.com/studio/apikeys/" target="_blank" rel="noreferrer">
          <b>Get a Graph API key</b>
          <span>Create or manage Gateway keys in Studio.</span>
        </a>
        <a href="https://thegraph.com/explorer" target="_blank" rel="noreferrer">
          <b>Find another DEX</b>
          <span>Search Graph Explorer and paste a compatible subgraph ID.</span>
        </a>
        <article>
          <b>What data is fetched?</b>
          <span>Recent swaps: token pair, origin wallet, amounts, USD value, tx, and block.</span>
        </article>
      </div>
    </div>
  );
}
