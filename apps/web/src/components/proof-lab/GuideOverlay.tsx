import type { LabTab } from "../../data/proofLabContent";
import { LuArrowRight, LuLightbulb } from "react-icons/lu";

type GuideStep = {
  body: string;
  buttonLabel: string;
  title: string;
};

type GuideOverlayProps = {
  readonly activeTab: LabTab;
  readonly canUseRows: boolean;
  readonly loading: boolean;
  readonly step: number;
  readonly onNext: () => void;
};

const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Connect a source and fetch data",
    body: "Choose what you want to inspect, add your Graph API key, then run the query.",
    buttonLabel: "Find the query controls",
  },
  {
    title: "The response is ready to read",
    body: "Convert the JSON into activity cards before ProofStream seals the dataset.",
    buttonLabel: "Build readable dataset",
  },
  {
    title: "Choose the activity to prove",
    body: "Select one readable row. The client will receive that row and a small helper path.",
    buttonLabel: "Create its receipt",
  },
  {
    title: "Check the result yourself",
    body: "Review the receipt, then edit the claim to confirm that changed data is rejected.",
    buttonLabel: "Start another query",
  },
];

export function GuideOverlay({ activeTab, canUseRows, loading, step, onNext }: GuideOverlayProps) {
  const guideStep = GUIDE_STEPS[step] ?? GUIDE_STEPS[0];

  return (
    <aside className="guide-overlay workflow-guide" aria-label="ProofStream next step guide">
      <LuLightbulb aria-hidden="true" />
      <div>
        <span>Next action · {step + 1} of {GUIDE_STEPS.length}</span>
        <b>{guideStep.title}</b>
        <p>{guideStep.body}</p>
      </div>
      <button type="button" onClick={onNext} disabled={loading || (!canUseRows && activeTab !== "query")}>
        {loading ? "Working..." : guideStep.buttonLabel}
        {!loading ? <LuArrowRight aria-hidden="true" /> : null}
      </button>
    </aside>
  );
}
