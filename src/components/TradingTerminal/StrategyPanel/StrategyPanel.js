import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
import { useFormContext } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { useStoreUserDailyBalance } from "../../../hooks/useStoreUserSelector";
import {
  OutlinedInput,
  FormControlLabel,
  FormHelperText,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
} from "@material-ui/core";
import HelperLabel from "../HelperLabel/HelperLabel";
import usePositionSizeHandlers from "../../../hooks/usePositionSizeHandlers";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 */

/**
 * @typedef {Object} StrategyPanelProps
 * @property {MarketSymbol} symbolData
 * @property {number} leverage
 */

/**
 * Manual trading strategy panel component.
 *
 * @param {StrategyPanelProps} props Component props.
 * @returns {JSX.Element} Strategy panel element.
 */
const StrategyPanel = (props) => {
  const { symbolData, leverage } = props;
  const { errors, register, watch } = useFormContext();
  const { selectedExchange } = useStoreSettingsSelector();
  const dailyBalance = useStoreUserDailyBalance();
  const lastDayBalance = dailyBalance.balances[0] || null;
  const {
    positionSizeChange,
    priceChange,
    realInvestmentChange,
    unitsChange,
    validatePositionSize,
  } = usePositionSizeHandlers(symbolData, leverage);
  const intl = useIntl();

  const getQuoteBalance = () => {
    if (!lastDayBalance) {
      return 0;
    }

    const propertyKey = `totalFree${symbolData.quote}`;
    // @ts-ignore
    return lastDayBalance[propertyKey] || 0;
  };

  const getBaseBalance = () => {
    if (!lastDayBalance) {
      return 0;
    }

    const propertyKey = `totalFree${symbolData.base}`;
    // @ts-ignore
    return lastDayBalance[propertyKey] || 0;
  };

  const entryStrategyOptions = [
    { label: intl.formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: intl.formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop-limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.import" }), val: "import" },
  ];

  const [entryStrategy, setEntryStrategy] = useState(entryStrategyOptions[0].val);
  const entryType = watch("entryType");

  return (
    <Box className={"panel strategyPanel expanded"}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.strategy" />
          </Typography>
          <CustomSelect
            label=""
            onChange={setEntryStrategy}
            options={entryStrategyOptions}
            value={entryStrategy}
          />
        </Box>
      </Box>
      <Box className="panelContent" display="flex" flexDirection="row" flexWrap="wrap">
        {selectedExchange.exchangeType === "futures" && (
          <FormControl className="entryType">
            <RadioGroup aria-label="Entry Type" defaultValue={entryType} name="entryType">
              <FormControlLabel
                control={<Radio />}
                inputRef={register}
                label={<FormattedMessage id="col.side.long" />}
                value="LONG"
              />
              <FormControlLabel
                control={<Radio />}
                inputRef={register}
                label={<FormattedMessage id="col.side.short" />}
                value="SHORT"
              />
            </RadioGroup>
          </FormControl>
        )}
        {entryStrategy === "stop-limit" && (
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.stopprice" />
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" inputRef={register} name="stopPrice" />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
        )}
        {entryStrategy !== "market" && (
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.price" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="price"
                onChange={priceChange}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
            {errors.price && <span className="errorText">{errors.price.message}</span>}
          </FormControl>
        )}
        {selectedExchange.exchangeType === "futures" && (
          <FormControl>
            <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.realinvest" />
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="realInvestment"
                onChange={realInvestmentChange}
                placeholder={"0"}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
            <FormHelperText>
              <FormattedMessage id="terminal.available" /> {getQuoteBalance()}
            </FormHelperText>
          </FormControl>
        )}
        <FormControl>
          <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.position.size" />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              inputRef={register({
                required: "Position size is required.",
                validate: validatePositionSize,
              })}
              name="positionSize"
              onChange={positionSizeChange}
              placeholder={"0"}
            />
            <div className="currencyBox">{symbolData.quote}</div>
          </Box>
          <FormHelperText>
            <FormattedMessage id="terminal.available" /> {getQuoteBalance()}
          </FormHelperText>
          {errors.positionSize && <span className="errorText">{errors.positionSize.message}</span>}
        </FormControl>
        <FormControl>
          <HelperLabel descriptionId="terminal.stoploss.help" labelId="terminal.units" />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              inputRef={register}
              name="units"
              onChange={unitsChange}
              placeholder={"0"}
            />
            <div className="currencyBox">{symbolData.base}</div>
          </Box>
          <FormHelperText>
            <FormattedMessage id="terminal.available" /> {getBaseBalance()}
          </FormHelperText>
          {errors.units && <span className="errorText">{errors.units.message}</span>}
        </FormControl>
      </Box>
    </Box>
  );
};

export default React.memo(StrategyPanel);
