import { ACTION_LOGIN, ACTION_FAILED, ACTION_LOGOUT } from "../Constants";

const initialState = {
  dataObject: {},
  dataError: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_LOGIN:
      return { ...state, dataObject: payload, dataError: false };
    case ACTION_FAILED:
      return { ...state, dataObject: {}, dataError: true };
    case ACTION_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
