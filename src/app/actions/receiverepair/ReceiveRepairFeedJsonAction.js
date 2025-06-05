import axios from "axios";
import moment from "moment";
import {
  JSON_FEED_FETCHING,
  JSON_FEED_SUCCESS,
  JSON_FEED_FAILED,
  SET_WORK_REPAIR_SEARCH_PARAMS,
} from "../../Constants";
import url from "../UrlAction";
import { getToken, getProfile } from "../../utils/Storage";
import { convertFormateEn } from "../../utils/Date";
import { checkedToken } from "../../utils/Service";

export const setStateToFetching = () => ({
  type: JSON_FEED_FETCHING,
});

export const setStateToSuccess = (payload) => ({
  type: JSON_FEED_SUCCESS,
  payload,
});

export const setStateToFailed = () => ({
  type: JSON_FEED_FAILED,
});

export const setWorkRepairSearchParams = (payload) => ({
  type: SET_WORK_REPAIR_SEARCH_PARAMS,
  payload,
});

export const loadDataWitchPost = (searchParams = {}, props, callback) => {
  return async (dispatch) => {
    try {
      dispatch(setStateToFetching());
      const profile = await getProfile();

      const date = new Date();
      const defaultStartDate = moment(date.setDate(date.getDate() - 3)).format(
        "YYYYMMDD"
      );

      let req = {
        IncidentNo: searchParams.IncidentNo || null,
        CustomerName: searchParams.CustomerName || null,
        ProcessStage: "2,3",
        BranchNo: profile?.ba,
        IncidentAddress: null,
        RequestCategorySubject: null,
        IncidentCaseDetail: null,
        FromDate: searchParams.FromDate || defaultStartDate,
        ToDate: searchParams.ToDate || "",
        Contact: {
          Telephone: searchParams.Telephone || "",
        },
        PageInfo: {
          pageSize: 1000,
          currentPage: 1,
        },
      };

      const res = await loaddata(req);
      dispatch(setStateToSuccess(res.data.result));
      dispatch(
        setWorkRepairSearchParams({
          ...searchParams,
          FromDate: req.FromDate,
          ToDate: req.ToDate,
        })
      );
      if (callback) callback();
    } catch (error) {
      checkedToken(error, props);
      dispatch(setStateToFailed());
    }
  };
  // let date = new Date();
  // let from_Date = date.setDate(date.getDate() - 3);
  // return async dispatch => {
  //   try {
  //     dispatch(setStateToFetching());
  //     const profile = await getProfile().then(data => {
  //       return data;
  //     });

  //     let req = {
  //       IncidentNo: null,
  //       CustomerName: null,
  //       ProcessStage: '2,3',
  //       BranchNo: profile.ba,
  //       IncidentAddress: null,
  //       RequestCategorySubject: null,
  //       IncidentCaseDetail: null,
  //       FromDate: moment(from_Date).format('YYYYMMDD'),
  //       ToDate: '',
  //       Contact: {
  //         Telephone: '',
  //       },
  //       PageInfo: {
  //         pageSize: 1000,
  //         currentPage: 1,
  //       },
  //     };
  //     // console.log(req);
  //     await loaddata(req)
  //       .then(async res => {
  //         dispatch(setStateToSuccess(res.data.result));
  //         // console.log("res", res.data.result);
  //       })
  //       .catch(error => {
  //         checkedToken(error, props);
  //         dispatch(setStateToFailed());
  //       });
  //   } catch (error) {
  //     dispatch(setStateToFailed());
  //   }
  // };
};

export const loadDataWitchPostFilter = (
  tel = "",
  cusname = "",
  no = "",
  receivedcasedate = "",
  completedCaseDate = "",
  props,
  callback
) => {
  return async (dispatch) => {
    // console.log("receivedcasedate", receivedcasedate)
    // console.log("completedCaseDate", completedCaseDate)
    try {
      const profile = await getProfile().then((data) => {
        return data;
      });
      let req = {
        IncidentNo: no,
        CustomerName: cusname,
        ProcessStage: "2,3",
        BranchNo: profile.ba,
        IncidentAddress: null,
        RequestCategorySubject: null,
        IncidentCaseDetail: null,
        FromDate: receivedcasedate,
        ToDate: completedCaseDate,
        Contact: {
          Telephone: tel,
        },
        PageInfo: {
          pageSize: 1000,
          currentPage: 1,
        },
      };
      // console.log("req", req)
      await loaddata(req)
        .then(async (res) => {
          if (res.data.result.length > 0) {
            dispatch(setStateToSuccess(res.data.result));
            // console.log("res", res.data.result);
            callback(1);
          } else {
            callback(0);
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(setStateToFailed());
          checkedToken(error, props);
        });
    } catch (error) {
      dispatch(setStateToFailed());
    }
  };
};

const loaddata = async (req) => {
  const token = await getToken().then((data) => {
    return data;
  });
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `${url.getIncidents}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: req,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
