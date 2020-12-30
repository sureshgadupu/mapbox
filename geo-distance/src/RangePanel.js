import React from "react";

export const RangePanel = ({ range, onRangeChange }) => {
  return (
    <div className="control-panel">
      <div key={"radius"} className="input">
        <label>Range (KMs) : {range}</label>
        <input
          type="range"
          value={range}
          min={100}
          max={1000}
          step={50}
          onChange={(evt) => onRangeChange(evt.target.value)}
        />
      </div>
    </div>
  );
};
