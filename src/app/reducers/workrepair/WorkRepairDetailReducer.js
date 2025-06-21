import {
  ACTION_TITLE_NO,
  ACTION_GETREPAIRWORKBYID_SUCCESS,
  ACTION_GETREPAIRWORKBYID_FAILED,
  ACTION_TEST_LOCATION,
  ACTION_RADIO_PIPE,
} from "../../Constants";
const initialState = {
  dataArray: { survey: {} },
  isError: false,
  no: "",
  location: "",
  radioPipe: "0",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_GETREPAIRWORKBYID_SUCCESS:
      return { ...state, dataArray: payload, isError: false };

    case ACTION_GETREPAIRWORKBYID_FAILED:
      return { ...state, dataArray: null, isError: true };

    case ACTION_TITLE_NO:
      return { ...state, no: payload };

    case ACTION_TEST_LOCATION:
      return { ...state, location: payload };

    case ACTION_RADIO_PIPE:
      return { ...state, radioPipe: payload };
    default:
      return state;
  }
};
