import {
  JSON_FEED_FETCHING,
  JSON_FEED_SUCCESS,
  JSON_FEED_FAILED,
  ACTION_RESET_RECEIVE_REPAIR,
} from "../../Constants";

const initialState = {
  dataArray: [],
  isFetching: false,
  isError: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_RESET_RECEIVE_REPAIR:
      return { ...initialState };
    case JSON_FEED_FETCHING:
      return {
        ...state,
        dataArray: [],
        isFetching: true,
        isError: false,
      };

    case JSON_FEED_SUCCESS:
      return {
        ...state,
        dataArray: payload,
        isFetching: false,
        isError: false,
      };
    case JSON_FEED_FAILED:
      return {
        ...state,
        dataArray: [],
        isFetching: false,
        isError: true,
      };
    default:
      return state;
  }
};
