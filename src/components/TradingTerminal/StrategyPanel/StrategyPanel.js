import React, { useState } from "react";
import { Box } from "@material-ui/core";
import "./StrategyPanel.scss";
import CustomSelect from "../../CustomSelect";
import { useFormContext } from "react-hook-form";
import { useIntl, FormattedMessage } from "react-intl";
import {
  OutlinedInput,
  FormControlLabel,
  FormHelperText,
  FormControl,
  RadioGroup,
  Radio,
  Switch,
  Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";

const StrategyPanel = (props) => {
  const { disableExpand, symbolData } = props;
  const defaultExpand = !!disableExpand;
  const [expand, setExpand] = useState(defaultExpand);
  const expandClass = expand ? "expanded" : "collapsed";
  const { getValues, register, setValue } = useFormContext();
  const intl = useIntl();

  /**
   * Handle toggle switch action.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event Click event.
   * @returns {Void} None.
   */
  const handleToggle = (event) => {
    const targetElement = event.currentTarget;
    setExpand(targetElement.checked);
  };

  const entryStrategyOptions = [
    { label: intl.formatMessage({ id: "terminal.strategy.limit" }), val: "limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.market" }), val: "market" },
    { label: intl.formatMessage({ id: "terminal.strategy.stoplimit" }), val: "stop-limit" },
    { label: intl.formatMessage({ id: "terminal.strategy.import" }), val: "import" },
  ];

  const [entryStrategy, setEntryStrategy] = useState(entryStrategyOptions[0].val);

  const realInvestmentChange = () => {
    const draftPosition = getValues();
    const units = draftPosition.realInvestment / 2;
    setValue("units", units);
  };

  return (
    <Box className={`strategyPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!disableExpand && <Switch onChange={handleToggle} size="small" />}
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
      {expand && (
        <Box className="panelContent">
          <FormControl>
            <RadioGroup aria-label="Entry Type" className="entryType" name="entryType">
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
          {entryStrategy === "stop-limit" && (
            <FormControl>
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>
                  <FormattedMessage id="terminal.stopprice" />
                </FormHelperText>
                <Help />
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="stopPrice" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          {entryStrategy !== "market" && (
            <FormControl>
              <Box alignItems="center" className="help" display="flex">
                <FormHelperText>
                  <FormattedMessage id="terminal.price" />
                </FormHelperText>
                <Help />
              </Box>
              <Box alignItems="center" display="flex">
                <OutlinedInput className="outlineInput" inputRef={register} name="price" />
                <div className="currencyBox">{symbolData.quote}</div>
              </Box>
            </FormControl>
          )}
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>
                <FormattedMessage id="terminal.realinvest" />
              </FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput
                className="outlineInput"
                inputRef={register}
                name="realInvestment"
                onChange={realInvestmentChange}
              />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>
                <FormattedMessage id="terminal.position.size" />
              </FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" inputRef={register} name="positionSize" />
              <div className="currencyBox">{symbolData.quote}</div>
            </Box>
          </FormControl>
          <FormControl>
            <Box alignItems="center" className="help" display="flex">
              <FormHelperText>
                <FormattedMessage id="terminal.units" />
              </FormHelperText>
              <Help />
            </Box>
            <Box alignItems="center" display="flex">
              <OutlinedInput className="outlineInput" inputRef={register} name="units" />
              <div className="currencyBox">{symbolData.base}</div>
            </Box>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default StrategyPanel;
