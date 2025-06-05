import {
  ACTION_GET_INCIDENT_SEARCH_SUCCESS,
  ACTION_GET_INCIDENT_SEARCH_FAILED,
  ACTION_SET_SEARCH_PARAMS,
  ACTION_RESET_RECEIVE_REPAIR
} from "../../Constants";

const initialState = {
  dataObject: null,
  isError: false,
  searchParams: {
    FromDate: "",
    ToDate: "",
    IncidentNo: "",
    CustomerName: "",
    Telephone: "",
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GET_INCIDENT_SEARCH_SUCCESS:
      return { ...state, dataObject: payload, isError: false };

    case ACTION_GET_INCIDENT_SEARCH_FAILED:
      return { ...state, dataObject: null, isError: true };

    case ACTION_SET_SEARCH_PARAMS:
      return { ...state, searchParams: payload };

    case ACTION_RESET_RECEIVE_REPAIR:
      return { ...initialState };

    default:
      return state;
  }
};
