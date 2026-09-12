import type { LabTab } from "../../data/proofLabContent";
import { LAB_TABS } from "../../data/proofLabContent";
import { LuDatabase, LuReceiptText, LuRows3 } from "react-icons/lu";

type ProofLabTabsProps = {
  activeTab: LabTab;
  onChange: (tab: LabTab) => void;
};

export function ProofLabTabs({ activeTab, onChange }: Readonly<ProofLabTabsProps>) {
  const details: Record<LabTab, { description: string; Icon: typeof LuDatabase }> = {
    query: { description: "Choose and fetch data", Icon: LuDatabase },
    dataset: { description: "Read and select a row", Icon: LuRows3 },
    receipt: { description: "Check the proof", Icon: LuReceiptText },
  };

  return (
    <div className="explorer-tabs" role="tablist" aria-label="ProofStream workflow">
      {LAB_TABS.map((tab) => {
        const TabIcon = details[tab.id].Icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : undefined}
            onClick={() => onChange(tab.id)}
          >
            <TabIcon aria-hidden="true" />
            <span>
              <b>{tab.label}</b>
              <small>{details[tab.id].description}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
