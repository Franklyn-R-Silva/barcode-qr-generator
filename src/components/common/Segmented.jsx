import React from "react";
import "./Segmented.css";

/**
 * Segmented control built on native radio buttons, so arrow keys,
 * focus and screen readers work without extra code.
 */
const Segmented = ({
  legend,
  hideLegend = false,
  name,
  options,
  value,
  onChange,
  size = "md",
}) => (
  <fieldset className={`segmented segmented-${size}`}>
    <legend className={hideLegend ? "visually-hidden" : "field-label"}>
      {legend}
    </legend>
    <div className="segmented-track">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`segmented-option ${value === opt.value ? "is-on" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.icon}
          <span>{opt.label}</span>
          {opt.hint && <small>{opt.hint}</small>}
        </label>
      ))}
    </div>
  </fieldset>
);

export default Segmented;
