import { useEffect, useMemo, useState } from "react";
import { DEX_PRESETS } from "../data/dexPresets";
import {
  DEFAULT_STABLE_POOL,
  SAMPLE_ROWS,
  type LabTab,
} from "../data/proofLabContent";
import {
  fetchGraphEvents,
  graphEndpointTemplate,
  normalizeGraphRows,
  queryTemplate,
  type GraphFetchMode,
  type GraphResponse,
} from "../lib/graph";
import { buildMerkleProof, verifyMerkleProof } from "../lib/merkle";
import { sourceLabel } from "../utils/text";
import { DatasetPanel } from "./proof-lab/DatasetPanel";
import { IntroModal } from "./proof-lab/IntroModal";
import { ProofLabHeader } from "./proof-lab/ProofLabHeader";
import { ProofLabTabs } from "./proof-lab/ProofLabTabs";
import { QueryPanel } from "./proof-lab/QueryPanel";
import { ReceiptPanel } from "./proof-lab/ReceiptPanel";

const DEFAULT_PRESET = DEX_PRESETS[0];
const CUSTOM_PRESET_ID = "custom";
const DEFAULT_SUBGRAPH_ID = import.meta.env.VITE_DEFAULT_SUBGRAPH_ID ?? DEFAULT_PRESET.subgraphId;

export function ProofLab() {
  const [rowsText, setRowsText] = useState(SAMPLE_ROWS);
  const [selectedRow, setSelectedRow] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState(() => graphEndpointTemplate(DEFAULT_SUBGRAPH_ID));
  const [presetId, setPresetId] = useState(DEFAULT_PRESET.id);
  const [subgraphId, setSubgraphId] = useState(DEFAULT_SUBGRAPH_ID);
  const [wallet, setWallet] = useState(import.meta.env.VITE_DEFAULT_WALLET ?? "");
  const [pool, setPool] = useState(import.meta.env.VITE_DEFAULT_POOL ?? DEFAULT_STABLE_POOL);
  const [mode, setMode] = useState<GraphFetchMode>("recent");
  const [queryText, setQueryText] = useState(() => queryTemplate("recent", DEFAULT_STABLE_POOL));
  const [jsonText, setJsonText] = useState(sampleJson());
  const [activeTab, setActiveTab] = useState<LabTab>("query");
  const [clientClaim, setClientClaim] = useState("tx:alice->bob:100");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Edit rows or fetch live data, then generate a proof.");
  const [showIntro, setShowIntro] = useState(true);

  const rows = useMemo(
    () => rowsText.split("\n").map((row) => row.trim()).filter(Boolean),
    [rowsText],
  );

  const proof = useMemo(() => buildMerkleProof(rows, selectedRow), [rows, selectedRow]);
  const verification = useMemo(
    () => verifyMerkleProof(clientClaim, proof.root, proof.siblings),
    [clientClaim, proof.root, proof.siblings],
  );
  const selectedLeaf = rows[selectedRow] ?? "";
  const selectedPreset = DEX_PRESETS.find((preset) => preset.id === presetId) ?? DEFAULT_PRESET;
  const visibleEndpoint = endpoint || graphEndpointTemplate(subgraphId);

  useEffect(() => {
    setClientClaim(selectedLeaf);
  }, [selectedLeaf]);

  async function loadGraphData() {
    setLoading(true);
    setMessage(`Fetching ${sourceLabel(mode).toLowerCase()} from The Graph...`);

    try {
      const result = await fetchGraphEvents({
        apiKey,
        endpoint,
        mode,
        pool,
        query: queryText,
        subgraphId,
        wallet,
      });

      setRowsText(result.rows.join("\n"));
      setJsonText(formatJson(result.json));
      if (result.suggestedPool) {
        setPool(result.suggestedPool);
      }
      if (result.suggestedWallet) {
        setWallet(result.suggestedWallet);
      }
      setSelectedRow(0);
      setActiveTab("query");
      setMessage(
        `Loaded ${result.rows.length} ${sourceLabel(mode).toLowerCase()}. Pool and wallet filters were filled from the first row.`,
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      setMessage(`${detail} The demo rows are still editable, so you can keep testing proofs.`);
    } finally {
      setLoading(false);
    }
  }

  function useJsonAsRows() {
    try {
      const rowsFromJson = normalizeGraphRows(JSON.parse(jsonText) as GraphResponse);

      if (!rowsFromJson.length) {
        setMessage("That JSON has no swaps array to convert. Keep editing or run a query first.");
        return;
      }

      setRowsText(rowsFromJson.join("\n"));
      setSelectedRow(0);
      setActiveTab("dataset");
      setMessage(`Converted ${rowsFromJson.length} JSON swaps into receipt rows.`);
    } catch {
      setMessage("The JSON is not valid yet. Fix it, then convert again.");
    }
  }

  function selectPreset(nextPresetId: string) {
    const nextPreset = DEX_PRESETS.find((preset) => preset.id === nextPresetId) ?? DEFAULT_PRESET;

    setPresetId(nextPreset.id);
    setSubgraphId(nextPreset.subgraphId);
    setEndpoint(graphEndpointTemplate(nextPreset.subgraphId));
  }

  function updateSubgraphId(value: string) {
    setSubgraphId(value);
    setEndpoint(graphEndpointTemplate(value));
    setPresetId(CUSTOM_PRESET_ID);
  }

  return (
    <section className="section" id="lab">
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      <div className="section-heading">
        <p className="eyebrow">Live proof playground</p>
        <h2>Verify DEX activity with simple proof receipts.</h2>
        <p>
          Fetch swaps, pick one row, then watch the browser verify it using only
          the row, a Merkle root, and a small proof. No database trust required.
        </p>
      </div>

      <div className="graph-explorer">
        <ProofLabHeader
          loading={loading}
          mode={mode}
          preset={selectedPreset}
          subgraphId={subgraphId}
          onRun={loadGraphData}
        />

        <ProofLabTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "query" && (
          <QueryPanel
            apiKey={apiKey}
            endpoint={endpoint}
            jsonText={jsonText}
            loading={loading}
            mode={mode}
            pool={pool}
            presetId={presetId}
            queryText={queryText}
            selectedPreset={selectedPreset}
            subgraphId={subgraphId}
            visibleEndpoint={visibleEndpoint}
            wallet={wallet}
            onApiKeyChange={setApiKey}
            onEndpointChange={setEndpoint}
            onJsonTextChange={setJsonText}
            onModeChange={setMode}
            onPoolChange={setPool}
            onPresetChange={selectPreset}
            onQueryTextChange={setQueryText}
            onRun={loadGraphData}
            onSubgraphIdChange={updateSubgraphId}
            onUseJsonRows={useJsonAsRows}
            onWalletChange={setWallet}
          />
        )}

        {activeTab === "dataset" && (
          <DatasetPanel
            message={message}
            rows={rows}
            rowsText={rowsText}
            selectedRow={selectedRow}
            onRowsTextChange={setRowsText}
            onSelectedRowChange={setSelectedRow}
            onUseJsonRows={useJsonAsRows}
          />
        )}

        {activeTab === "receipt" && (
          <ReceiptPanel
            clientClaim={clientClaim}
            proof={proof}
            rowsLength={rows.length}
            selectedLeaf={selectedLeaf}
            selectedRow={selectedRow}
            verification={verification}
            onClientClaimChange={setClientClaim}
          />
        )}
      </div>
    </section>
  );
}

function formatJson(value: GraphResponse) {
  return JSON.stringify(value, null, 2);
}

function sampleJson() {
  return formatJson({
    data: {
      swaps: [
        {
          id: "sample-swap-0",
          sender: "0xserver",
          recipient: "0xclient",
          origin: "0xwallet",
          amount0: "100",
          amount1: "-99.8",
          amountUSD: "100.00",
          pool: {
            id: "0x7858e59e0c01ea06df3af3d20ac7b0003275d4bf",
          },
          transaction: {
            id: "0xtxhash",
            blockNumber: "25947441",
          },
          token0: { symbol: "USDC" },
          token1: { symbol: "USDT" },
        },
      ],
    },
  });
}
