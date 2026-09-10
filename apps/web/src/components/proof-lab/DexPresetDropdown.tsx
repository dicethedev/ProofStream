import { useEffect, useRef, useState } from "react";
import type { DexPreset } from "../../data/dexPresets";
import { DEX_PRESETS, dexLogoUrl } from "../../data/dexPresets";
import { dexInitials } from "../../utils/text";

type DexPresetDropdownProps = {
  readonly id?: string;
  readonly selectedPreset: DexPreset;
  readonly onChange: (presetId: string) => void;
};

export function DexPresetDropdown({ id, selectedPreset, onChange }: DexPresetDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const readyPresets = DEX_PRESETS.filter((preset) => !preset.custom);
  const customPreset = DEX_PRESETS.find((preset) => preset.custom);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function choosePreset(presetId: string) {
    onChange(presetId);
    setOpen(false);
  }

  return (
    <div className="dex-dropdown" ref={dropdownRef}>
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
              <PresetIcon preset={preset} />
              <span>
                <b>{preset.name}</b>
                <small>{preset.network}</small>
                <em>{preset.description}</em>
              </span>
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
              <PresetIcon preset={customPreset} />
              <span>
                <b>{customPreset.name}</b>
                <small>Paste your own subgraph ID</small>
                <em>{customPreset.description}</em>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PresetIcon({ preset }: { readonly preset: DexPreset }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = dexLogoUrl(preset);

  useEffect(() => {
    setFailed(false);
  }, [preset.id]);

  return (
    <span className="dex-option-icon" aria-hidden="true">
      {logoUrl && !failed ? (
        <img src={logoUrl} alt="" onError={() => setFailed(true)} />
      ) : (
        dexInitials(preset.name)
      )}
    </span>
  );
}
