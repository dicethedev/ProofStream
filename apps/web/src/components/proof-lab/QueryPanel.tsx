import type { RefObject } from "react";
import {
  LuCircleCheck,
  LuDatabase,
  LuExternalLink,
  LuFileJson,
  LuInfo,
  LuKeyRound,
  LuPlay,
  LuRefreshCw,
  LuRows3,
} from "react-icons/lu";
import type { DexPreset } from "../../data/dexPresets";
import { SOURCE_OPTIONS } from "../../data/proofLabContent";
import type { GraphFetchMode } from "../../lib/graph";
import { queryTemplate } from "../../lib/graph";
import { DexPresetDropdown } from "./DexPresetDropdown";

type QueryPanelProps = {
  readonly apiKey: string;
  readonly consoleRef: RefObject<HTMLDivElement | null>;
  readonly endpoint: string;
  readonly jsonText: string;
  readonly loading: boolean;
  readonly message: string;
  readonly mode: GraphFetchMode;
  readonly pool: string;
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
  consoleRef,
  endpoint,
  jsonText,
  loading,
  message,
  mode,
  pool,
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
  const jsonSummary = summarizeJson(jsonText);

  return (
    <div className="tab-panel query-experience">
      <header className="query-experience-heading">
        <div>
          <p className="eyebrow">Choose your data</p>
          <h3>What activity do you want to inspect?</h3>
          <p>
            Start broad with recent swaps, or narrow the query to one pool or
            one transaction-origin wallet.
          </p>
        </div>
        <a href="https://thegraph.com/studio/apikeys/" target="_blank" rel="noreferrer">
          Get a Graph API key <LuExternalLink aria-hidden="true" />
        </a>
      </header>

      <div className="mode-row query-mode-cards" role="radiogroup" aria-label="The Graph query mode">
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
            <LuDatabase aria-hidden="true" />
            <span>{source.title}</span>
            <small>{source.description}</small>
          </button>
        ))}
      </div>

      <section className="query-source-setup">
        <div className="query-source-form">
          <header>
            <span><LuKeyRound aria-hidden="true" /></span>
            <div>
              <small>Data connection</small>
              <h3>Connect to The Graph</h3>
              <p>Your API key stays in this browser tab and is never stored.</p>
            </div>
          </header>

          <div className="query-primary-fields">
            <label htmlFor="api-key">
              <span>Graph Gateway API key</span>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(event) => onApiKeyChange(event.target.value)}
                placeholder="Paste your API key"
                autoComplete="off"
              />
            </label>

            <label htmlFor="dex-preset">
              <span>DEX data source</span>
              <DexPresetDropdown id="dex-preset" selectedPreset={selectedPreset} onChange={onPresetChange} />
            </label>
          </div>

          {(mode === "wallet" || mode === "pool") && (
            <div className="filter-row query-filter-row">
              {mode === "wallet" && (
                <label htmlFor="wallet">
                  <span>Wallet origin</span>
                  <input
                    id="wallet"
                    value={wallet}
                    onChange={(event) => onWalletChange(event.target.value)}
                    placeholder="Paste a 0x wallet address"
                  />
                  <small>The wallet that initiated the indexed transaction.</small>
                </label>
              )}

              {mode === "pool" && (
                <label htmlFor="pool">
                  <span>Pool address</span>
                  <input
                    id="pool"
                    value={pool}
                    onChange={(event) => {
                      onPoolChange(event.target.value);
                      onQueryTextChange(queryTemplate("pool", event.target.value));
                    }}
                    placeholder="Paste a 0x pool address"
                  />
                  <small>The liquidity pool whose swaps you want to inspect.</small>
                </label>
              )}
            </div>
          )}

          <details className="advanced-source-settings">
            <summary>Advanced source settings</summary>
            <div>
              <label htmlFor="subgraph-id">
                <span>Subgraph ID</span>
                <input
                  id="subgraph-id"
                  value={subgraphId}
                  onChange={(event) => onSubgraphIdChange(event.target.value)}
                  placeholder="Paste an ID from Graph Explorer"
                />
              </label>

              <div className="endpoint-preview">
                <span>Generated query URL</span>
                <code>{visibleEndpoint || "Choose a subgraph ID"}</code>
              </div>

              <label htmlFor="endpoint">
                <span>Direct endpoint override</span>
                <textarea
                  className="endpoint-input"
                  id="endpoint"
                  value={endpoint}
                  onChange={(event) => onEndpointChange(event.target.value)}
                  placeholder="https://gateway.thegraph.com/api/subgraphs/id/{subgraph-id}"
                  rows={2}
                  spellCheck={false}
                />
              </label>
            </div>
          </details>

          <button className="query-run-primary" type="button" onClick={onRun} disabled={loading}>
            <LuPlay aria-hidden="true" />
            {loading ? "Fetching live data..." : `Fetch ${SOURCE_OPTIONS.find((source) => source.mode === mode)?.title.toLowerCase()}`}
          </button>
        </div>

        <aside className="query-data-guide">
          <p className="eyebrow">What comes back?</p>
          <h3>A readable record for every DEX activity.</h3>
          <dl>
            <div><dt>Token pair</dt><dd>Which assets were exchanged.</dd></div>
            <div><dt>Amounts and USD value</dt><dd>How much moved and its indexed estimate.</dd></div>
            <div><dt>Wallet and pool</dt><dd>Who initiated it and where it happened.</dd></div>
            <div><dt>Transaction and block</dt><dd>Where the activity appears onchain.</dd></div>
          </dl>
        </aside>
      </section>

      <section className="query-response-section">
        <header>
          <div>
            <p className="eyebrow">Inspect the response</p>
            <h3>See the request and returned data side by side.</h3>
            <p>The left side is editable GraphQL. The right side is the JSON returned by The Graph.</p>
          </div>
          <span className={jsonSummary.valid ? "query-status valid" : "query-status invalid"}>
            {jsonSummary.valid ? <LuCircleCheck aria-hidden="true" /> : <LuInfo aria-hidden="true" />}
            {jsonSummary.valid ? `${jsonSummary.count} rows ready` : "JSON needs attention"}
          </span>
        </header>

        <div className="graph-console" ref={consoleRef}>
        <div className="console-pane">
          <div className="console-toolbar">
            <span><LuDatabase aria-hidden="true" /> GraphQL query</span>
            <button
              className="icon-button"
              type="button"
              onClick={() => onQueryTextChange(queryTemplate(mode, pool))}
              aria-label="Reset query"
            >
              <LuRefreshCw aria-hidden="true" /> Reset
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

        <button className="run-orb" type="button" onClick={onRun} disabled={loading} aria-label="Run GraphQL query">
          <LuPlay aria-hidden="true" />
        </button>

        <div className="console-pane">
          <div className="console-toolbar">
            <span><LuFileJson aria-hidden="true" /> The Graph JSON</span>
            <button className="icon-button" type="button" onClick={onUseJsonRows} aria-label="Convert JSON to readable rows">
              <LuRows3 aria-hidden="true" /> Use as dataset
            </button>
          </div>
          <div className="json-result-summary">
            <article>
              <span>Status</span>
              <b>{jsonSummary.valid ? "Readable JSON" : "Needs a fix"}</b>
            </article>
            <article>
              <span>Rows found</span>
              <b>{jsonSummary.count}</b>
            </article>
            <article>
              <span>Next step</span>
              <b>Build dataset</b>
            </article>
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

        <div className="query-response-message">
          <LuInfo aria-hidden="true" />
          <span>{message}</span>
          <button type="button" onClick={onUseJsonRows}>Continue with readable rows</button>
        </div>
      </section>

      <footer className="query-help-links">
        <a href="https://thegraph.com/explorer" target="_blank" rel="noreferrer">
          Find another subgraph <LuExternalLink aria-hidden="true" />
        </a>
        <span>Live data is supplied by The Graph and its indexers.</span>
      </footer>
    </div>
  );
}

function summarizeJson(jsonText: string) {
  try {
    const parsed = JSON.parse(jsonText) as { data?: { swaps?: unknown[] } };

    return {
      count: parsed.data?.swaps?.length ?? 0,
      valid: true,
    };
  } catch {
    return {
      count: 0,
      valid: false,
    };
  }
}
