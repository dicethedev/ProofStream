import type { LabTab } from "../../data/proofLabContent";
import { LAB_TABS } from "../../data/proofLabContent";

type ProofLabTabsProps = {
  activeTab: LabTab;
  onChange: (tab: LabTab) => void;
};

export function ProofLabTabs({ activeTab, onChange }: Readonly<ProofLabTabsProps>) {
  return (
    <div className="explorer-tabs" aria-label="ProofStream sections">
      {LAB_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? "active" : undefined}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
