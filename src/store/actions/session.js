import { unsetSelectedExchange } from "./settings";
import { unsetUserExchanges, setUserExchanges, setUserData } from "./user";
import { unsetProvider } from "./views";
import { showErrorAlert, ask2FA } from "./ui";
import { isEmpty } from "lodash";
import { navigate } from "@reach/router";
import tradeApi from "../../services/tradeApiClient";

export const START_TRADE_API_SESSION = "START_TRADE_API_SESSION";
export const END_TRADE_API_SESSION = "END_TRADE_API_SESSION";

/**
 * @typedef {import("../../services/tradeApiClient.types").UserLoginPayload} UserLoginPayload
 * @typedef {import("../../services/tradeApiClient.types").UserRegisterPayload} UserRegisterPayload
 * @typedef {import("../../services/tradeApiClient.types").UserLoginResponse} UserLoginResponse
 * @typedef {import("../../services/tradeApiClient.types").TwoFAPayload} TwoFAPayload
 * @typedef {import('../../store/store').AppThunk} AppThunk
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @param {UserLoginPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading
 * @returns {AppThunk} return action object.
 */
export const startTradeApiSession = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userLogin(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);
      check2FA(responseData, dispatch);
      setLoading(false);
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * @returns {AppThunk}
 */
export const endTradeApiSession = () => {
  return async (dispatch) => {
    try {
      const action = {
        type: END_TRADE_API_SESSION,
      };

      dispatch(action);
      dispatch(unsetSelectedExchange());
      dispatch(unsetUserExchanges());
      dispatch(unsetProvider());
    } catch (e) {
      dispatch(showErrorAlert(e));
    }
  };
};

/**
 * Set user session.
 *
 * @param {UserRegisterPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading
 * @returns {AppThunk} Thunk action function.
 */
export const registerUser = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.userRegister(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);
      setLoading(false);
      check2FA(responseData, dispatch);
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 * Set user session.
 *
 * @param {TwoFAPayload} payload User login payload.
 * @param {React.SetStateAction<*>} setLoading
 * @returns {AppThunk} Thunk action function.
 */
export const authenticate2FA = (payload, setLoading) => {
  return async (dispatch) => {
    try {
      const responseData = await tradeApi.verify2FA(payload);
      const action = {
        type: START_TRADE_API_SESSION,
        payload: responseData,
      };

      dispatch(action);
      loadAppUserData(payload.token, dispatch);
      setLoading(false);
      dispatch(ask2FA(false));
    } catch (e) {
      dispatch(showErrorAlert(e));
      setLoading(false);
    }
  };
};

/**
 *
 * @param {String} token
 * @param {*} dispatch
 */
const loadAppUserData = (token, dispatch) => {
  if (!isEmpty(token)) {
    const authorizationPayload = {
      token: token,
    };

    dispatch(setUserExchanges(authorizationPayload));
    dispatch(setUserData(authorizationPayload));
    navigate("/dashboard/positions");
  }
};

/**
 *
 * @param {UserLoginResponse} response
 * @param {*} dispatch
 */
const check2FA = (response, dispatch) => {
  if (response.ask2FA) {
    dispatch(ask2FA(true));
  } else {
    loadAppUserData(response.token, dispatch);
  }
};
