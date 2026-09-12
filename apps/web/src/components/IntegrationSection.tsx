import { useState, type CSSProperties } from "react";

type Integration = {
  name: string;
  domain?: string;
  ring: [number, number];
  scatter: [number, number];
};

const integrations: Integration[] = [
  { name: "Uniswap", domain: "uniswap.org", ring: [0, -320], scatter: [-350, -230] },
  { name: "PancakeSwap", domain: "pancakeswap.finance", ring: [145, -300], scatter: [338, -265] },
  { name: "Sushi", domain: "sushi.com", ring: [275, -245], scatter: [-152, -326] },
  { name: "Curve", domain: "curve.fi", ring: [355, -145], scatter: [382, 22] },
  { name: "Balancer", domain: "balancer.fi", ring: [390, -30], scatter: [230, 284] },
  { name: "1inch", domain: "1inch.com", ring: [370, 105], scatter: [-324, 242] },
  { name: "Aerodrome", domain: "aerodrome.finance", ring: [300, 220], scatter: [390, 216] },
  { name: "Velodrome", domain: "velodrome.finance", ring: [165, 290], scatter: [-240, 300] },
  { name: "QuickSwap", domain: "quickswap.exchange", ring: [0, 320], scatter: [82, 330] },
  { name: "Camelot", domain: "camelot.exchange", ring: [-165, 290], scatter: [-392, 42] },
  { name: "KyberSwap", domain: "kyberswap.com", ring: [-300, 220], scatter: [320, 302] },
  { name: "LFJ", domain: "lfj.gg", ring: [-370, 105], scatter: [-68, 296] },
  { name: "DODO", domain: "dodoex.io", ring: [-390, -30], scatter: [-386, -308] },
  { name: "Bancor", domain: "bancor.network", ring: [-355, -145], scatter: [386, -158] },
  { name: "SyncSwap", domain: "syncswap.xyz", ring: [-275, -245], scatter: [64, -338] },
  { name: "Any subgraph", ring: [-145, -300], scatter: [-282, 4] },
];

function protocolLogoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function DexOrbitLogo({ integration, index }: { integration: Integration; index: number }) {
  const [failed, setFailed] = useState(false);
  const style = {
    "--ring-x": `${integration.ring[0]}px`,
    "--ring-y": `${integration.ring[1]}px`,
    "--scatter-x": `${integration.scatter[0]}px`,
    "--scatter-y": `${integration.scatter[1]}px`,
    "--orbit-delay": `${index * 45}ms`,
  } as CSSProperties;

  return (
    <span
      className="dex-orbit-logo"
      style={style}
      data-name={integration.name}
      role="img"
      aria-label={integration.name}
    >
      {integration.domain && !failed ? (
        <img
          src={protocolLogoUrl(integration.domain)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <b>{integration.name === "Any subgraph" ? "+" : integration.name.slice(0, 2)}</b>
      )}
    </span>
  );
}

export function IntegrationSection() {
  return (
    <section className="section integrations-section" id="integrations">
      <div className="integrations-shell dex-orbit-shell" data-reveal>
        <div className="dex-orbit-field" aria-label="Supported indexed DEX data sources">
          <div className="dex-orbit-logos">
            {integrations.map((integration, index) => (
              <DexOrbitLogo integration={integration} index={index} key={integration.name} />
            ))}
          </div>

          <div className="dex-orbit-center">
            <p className="eyebrow">Bring the source you already use</p>
            <h2>One proof layer for indexed DEX data.</h2>
            <p>
              Start with a ready preset or connect any compatible subgraph.
              ProofStream turns the response into a receipt anyone can verify.
            </p>
            <a href="#/proof-lab">Explore live presets</a>
          </div>
        </div>

      </div>
    </section>
  );
}
