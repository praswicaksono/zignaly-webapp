import { assign } from "lodash";
import initialState from "../store/initialState";
import { GET_PROVIDER } from "../store/actions/views";

/**
 * @typedef {Object} ActionObject
 * @property {String} type
 * @property {Object} payload
 */

/**
 * @param {*} state
 * @param {ActionObject} action
 */

const views = (state, action) => {
  const newState = assign({}, initialState.views, state);

  switch (action.type) {
    case GET_PROVIDER:
      newState.provider = action.payload;
      break;

    default:
      break;
  }

  return newState;
};

export default views;