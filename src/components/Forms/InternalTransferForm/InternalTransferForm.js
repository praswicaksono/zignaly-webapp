import React, { useState } from "react";
import "./InternalTransferForm.scss";
import { Box, TextField, InputAdornment, Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
} from "@material-ui/lab";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { useStoreUserData } from "../../../hooks/useStoreUserSelector";
import { showSuccessAlert, showErrorAlert } from "../../../store/actions/ui";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import CustomSelect from "components/CustomSelect";
import useEffectSkipFirst from "hooks/useEffectSkipFirst";
import useAssetsAndBalance from "hooks/useAssetsAndBalance";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {import("../../../services/tradeApiClient.types").InternalTransferPayload} InternalTransferPayload
 * @typedef {Object} DefaultProps
 * @property {ExchangeConnectionEntity} selectedExchange
 */
/**
 * About us compoennt for CT profile.
 *
 * @returns {JSX.Element} Component JSX.
 */
const InternalTransferForm = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const storeUserData = useStoreUserData();
  const { errors, handleSubmit, control, watch, setValue } = useForm({ mode: "onChange" });
  const dispatch = useDispatch();
  const accounts = storeUserData.exchanges
    .filter((item) => item.isBrokerAccount)
    .map((i) => ({ val: i.internalId, label: i.internalName }));
  const [fromAccountList, setFromAccountList] = useState(accounts);
  const [toAccountList, setToAccountList] = useState(
    accounts.length > 1 ? accounts.filter((a) => a.val !== accounts[0].val) : [],
  );
  const selectedAsset = watch("asset", "BTC");
  const selectedToAccount = watch("internalIdDest", toAccountList[0].val);
  const selectedFromAccount = watch("internalIdSrc", fromAccountList[0].val);
  const selectedFromAccountObject = storeUserData.exchanges.find(
    (item) => item.internalId === selectedFromAccount,
  );

  const [assetsOptions, setAssetsOptions] = useState([]);
  const { assets, loading: assetsLoading } = useAssetsAndBalance(
    selectedFromAccountObject.internalId,
  );

  useEffectSkipFirst(() => {
    if (assets && selectedFromAccountObject) {
      const list = Object.keys(assets[selectedFromAccountObject.exchangeType]);
      setAssetsOptions(list);
      if (!list.includes(selectedAsset)) {
        setValue("asset", list[0]);
      }
    }
  }, [assets, selectedFromAccountObject]);

  useEffectSkipFirst(() => {
    if (selectedFromAccount) {
      const list = accounts.filter((a) => a.val !== selectedFromAccount);
      setToAccountList(list);
    }
  }, [selectedFromAccount]);

  useEffectSkipFirst(() => {
    if (selectedToAccount) {
      const list = accounts.filter((a) => a.val !== selectedToAccount);
      setFromAccountList(list);
    }
  }, [selectedToAccount]);

  /**
   * Function to submit edit form.
   *
   * @param {InternalTransferPayload} data Form data received at submit.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    setLoading(true);
    tradeApi
      .performInternalTransfer(data)
      .then(() => {
        dispatch(showSuccessAlert("alert.profileedit.title", "alert.profileedit.body"));
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const switchFromAndToAccount = () => {
    setValue("internalIdDest", selectedFromAccount);
    setValue("internalIdSrc", selectedToAccount);
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="flex-start"
        className="internalTransferForm"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h3">
          <FormattedMessage id="transfer.internal.form.title" />
        </Typography>
        <Timeline className="timeline">
          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <TimelineDot className="fromAccountStepLabel" />
              <TimelineConnector className="timelineConnector" />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox">
                <Controller
                  control={control}
                  defaultValue={fromAccountList.length ? fromAccountList[0].val : ""}
                  name="internalIdSrc"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({ id: "transfer.internal.form.from" })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={fromAccountList}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <span className="pointer" onClick={switchFromAndToAccount}>
                <SyncAltIcon className="transferIcon" />
              </span>
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox" />
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineSeparator>
              <TimelineConnector className="timelineConnector" />
              <TimelineDot className="toAccountStepLabel" />
            </TimelineSeparator>
            <TimelineContent className="timelineContent">
              <Box className="inputBox">
                <Controller
                  control={control}
                  defaultValue={toAccountList.length > 1 ? toAccountList[1].val : ""}
                  name="internalIdDest"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({
                        id: "transfer.internal.form.to",
                      })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={toAccountList}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          {errors.internalIdDest && (
            <span className="errorText">
              <FormattedMessage id="transfer.internal.error1" />
            </span>
          )}

          <TimelineItem className="timelineItem">
            <TimelineContent className="timelineContent">
              <Box className="inputBox search">
                <Controller
                  control={control}
                  defaultValue="BTC"
                  name="asset"
                  render={({ onChange, value }) => (
                    <CustomSelect
                      label={intl.formatMessage({ id: "transfer.internal.coin" })}
                      labelPlacement="top"
                      onChange={(/** @type {string} **/ v) => {
                        onChange(v);
                      }}
                      options={assetsOptions}
                      search={true}
                      value={value}
                    />
                  )}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem className="timelineItem">
            <TimelineContent className="timelineContent">
              <Box className="inputBox textField" display="flex" flexDirection="column">
                <Box
                  alignItems="center"
                  className="labelBox"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <label className="customLabel">
                    <FormattedMessage id="transfer.internal.amount" />
                  </label>
                  <label className="customLabel">
                    {assets ? assets[selectedFromAccountObject.exchangeType][selectedAsset] : 0}{" "}
                    <FormattedMessage id="transfer.internal.available" />
                  </label>
                </Box>
                <Controller
                  as={
                    <TextField
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <FormattedMessage id="transfer.internal.max" />
                          </InputAdornment>
                        ),
                      }}
                      className={`customInput ${errors.amount ? "error" : ""}`}
                      error={Boolean(errors.amount)}
                      fullWidth
                      variant="outlined"
                    />
                  }
                  control={control}
                  defaultValue={0}
                  name="amount"
                  rules={{
                    required: true,
                    max: assets ? assets[selectedFromAccountObject.exchangeType][selectedAsset] : 0,
                  }}
                />
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <Box className="formAction" display="flex" flexDirection="row" justifyContent="center">
          <CustomButton
            className="submitButton"
            disabled={Boolean(Object.keys(errors).length) || loading || assetsLoading}
            loading={loading}
            type="submit"
          >
            <FormattedMessage id="accounts.transfer" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default InternalTransferForm;