import React, { useState, useEffect } from "react";
import CustomFilters from "../../CustomFilters";
import CustomSelect from "../../CustomSelect";

/**
 * @typedef {Object} PositionFiltersPropTypes
 * @property {Function} onChange Callback that delegate filters changes to caller.
 * @property {Function} onClose Callback that delegate filters toggle state to caller.
 */

/**
 * Provides filters for filtering positions.
 *
 * @param {PositionFiltersPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const PositionFilters = ({ onChange, onClose }) => {
  const types = ["All types", "type 1"];
  const mdas = ["MDA"];
  const traders = ["All Traders"];

  const [type, setType] = useState(types[0]);
  const [mda, setMDA] = useState(mdas[0]);
  const [trader, setTrader] = useState(traders[0]);

  const clearFilters = () => {
    setType("");
    setMDA("");
    setTrader("");
  };

  useEffect(() => {
    onChange(type, mda, trader);
  }, [type, mda, trader, onChange]);

  return (
    <CustomFilters onClear={clearFilters} onClose={onClose} title="Filters">
      <CustomSelect label="" onChange={setType} options={types} value={type} />
      <CustomSelect label="" onChange={setMDA} options={mdas} value={mda} />
      <CustomSelect label="" onChange={setTrader} options={traders} value={trader} />
    </CustomFilters>
  );
};

export default PositionFilters;
