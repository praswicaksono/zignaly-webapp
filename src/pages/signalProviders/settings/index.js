import React, { useState, useEffect } from "react";
import "./settings.scss";
import { Box, CircularProgress } from "@material-ui/core";
import tradeApi from "../../../services/tradeApiClient";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";
import ProviderSettingsForm from "../../../components/Forms/ProviderSettingsForm";
import { creatEmptySettingsEntity } from "../../../services/tradeApiClient.types";
import useQuoteAssets from "../../../hooks/useQuoteAssets";
import { isEmpty } from "lodash";

const SignalProvidersSettings = () => {
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const storeViews = useStoreViewsSelector();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const emptySettings = creatEmptySettingsEntity();
  const [settings, setSettings] = useState(emptySettings);
  const quotes = useQuoteAssets();

  const loadSettings = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };
    tradeApi
      .providerExchangeSettingsGet(payload)
      .then((response) => {
        setSettings(response);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(loadSettings, []);

  useEffect(() => {
    if (settings.name && !isEmpty(quotes)) {
      setLoading(false);
    }
  }, [settings, quotes]);

  return (
    <Box className="profileSettingsPage">
      {loading && (
        <Box
          alignItems="center"
          bgcolor="grid.main"
          className="loadingBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      {!loading && <ProviderSettingsForm quotes={quotes} settings={settings} />}
    </Box>
  );
};

export default SignalProvidersSettings;