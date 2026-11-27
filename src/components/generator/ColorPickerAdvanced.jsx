// src/components/generator/ColorPickerAdvanced.jsx
import React, { useEffect, useId, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import "./ColorPickerAdvanced.css";

const ColorPickerAdvanced = ({ label, color, onChange, presets = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const id = useId();

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setIsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="color-field" ref={rootRef}>
      <span className="field-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        className="color-trigger"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-value`}
        aria-expanded={isOpen}
        aria-controls={`${id}-pop`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="color-chip" style={{ backgroundColor: color }} aria-hidden="true" />
        <span className="color-hex mono" id={`${id}-value`}>
          {color.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="color-popover" id={`${id}-pop`} role="dialog" aria-label={label}>
          <HexColorPicker color={color} onChange={onChange} />
          <label className="color-hex-row">
            <span>Hex</span>
            <HexColorInput
              className="input mono"
              color={color}
              onChange={onChange}
              prefixed
              aria-label={`${label} em hexadecimal`}
            />
          </label>
          {presets.length > 0 && (
            <div className="color-presets" role="group" aria-label="Cores sugeridas">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="color-preset"
                  style={{ backgroundColor: preset }}
                  aria-label={preset}
                  aria-pressed={preset.toLowerCase() === color.toLowerCase()}
                  onClick={() => onChange(preset)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPickerAdvanced;
