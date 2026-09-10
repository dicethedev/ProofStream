import { useState } from "react";
import { DEX_PRESETS } from "../../data/dexPresets";
import type { DexPreset } from "../../data/dexPresets";

type DexPresetDropdownProps = {
  readonly id?: string;
  readonly selectedPreset: DexPreset;
  readonly onChange: (presetId: string) => void;
};

export function DexPresetDropdown({ id, selectedPreset, onChange }: DexPresetDropdownProps) {
  const [open, setOpen] = useState(false);
  const readyPresets = DEX_PRESETS.filter((preset) => !preset.custom);
  const customPreset = DEX_PRESETS.find((preset) => preset.custom);

  function choosePreset(presetId: string) {
    onChange(presetId);
    setOpen(false);
  }

  return (
    <div className="dex-dropdown">
      <button
        id={id}
        className="dex-dropdown-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <b>{selectedPreset.name}</b>
          <small>{selectedPreset.network}</small>
        </span>
        <i aria-hidden="true" />
      </button>

      {open && (
        <div className="dex-dropdown-menu" role="listbox" aria-label="DEX preset">
          <p>Ready-to-query DEX presets</p>
          {readyPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={selectedPreset.id === preset.id}
              className={selectedPreset.id === preset.id ? "active" : undefined}
              onClick={() => choosePreset(preset.id)}
            >
              <span>
                <b>{preset.name}</b>
                <small>{preset.network}</small>
              </span>
              <em>{preset.description}</em>
            </button>
          ))}

          {customPreset && (
            <button
              type="button"
              role="option"
              aria-selected={selectedPreset.id === customPreset.id}
              className={`custom-option${selectedPreset.id === customPreset.id ? " active" : ""}`}
              onClick={() => choosePreset(customPreset.id)}
            >
              <span>
                <b>{customPreset.name}</b>
                <small>Paste your own subgraph ID</small>
              </span>
              <em>{customPreset.description}</em>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
