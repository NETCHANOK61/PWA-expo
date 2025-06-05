import axios from 'axios';
import moment from 'moment';
import {
  ACTION_JSON_WORKREPAIR_FETCHING,
  ACTION_JSON_WORKREPAIR_SUCCESS,
  ACTION_JSON_WORKREPAIR_FAILED,
  SET_WORK_REPAIR_SEARCH_PARAMS
} from '../../Constants';
import url from '../UrlAction';
import { getToken } from '../../utils/Storage';
import { convertFormateEn3 } from '../../utils/Date';
import { checkedToken } from '../../utils/Service';
import { Alert } from 'react-native';

export const setStateWorkRepairFetching = () => ({
  type: ACTION_JSON_WORKREPAIR_FETCHING,
});

export const setStateWorkRepairSuccess = payload => ({
  type: ACTION_JSON_WORKREPAIR_SUCCESS,
  payload,
});

export const setStateWorkRepairFailed = () => ({
  type: type,
});

export const setWorkRepairSearchParams = (payload) => ({
  type: SET_WORK_REPAIR_SEARCH_PARAMS,
  payload,
});

// export const loadDataWitchPost = (props, callback) => {
//   let date = new Date();
//   let inform_Date_Start = date.setDate(date.getDate() - 3);
//   return async dispatch => {
//     try {
//       dispatch(setStateWorkRepairFetching());
//       const req = {
//         rwCode: '',
//         customerName: '',
//         telephone: '',
//         informDateStart: moment(inform_Date_Start).format('YYYYMMDD'),
//         informDateEnd: '',
//         status: '',
//         pageInfo: {
//           recordCount: 0,
//           pageSize: 1000,
//           pageCount: 0,
//           currentPage: 0,
//         },
//       };
//       //console.log(req);
//       await callApi(req)
//         .then(async res => {
//           dispatch(setStateWorkRepairSuccess(res.data.result));
//           if (callback) callback(); // ✅ เรียก callback เมื่อเสร็จ
//         })
//         .catch(error => {
//           // console.log(error);
//           checkedToken(error, props);
//           dispatch(setStateWorkRepairFailed());
//         });
//     } catch (error) {
//       dispatch(setStateWorkRepairFailed());
//     }
//   };
// };
export const loadDataWitchPost = (searchParams = {}, props, callback) => {
  return async dispatch => {
    try {
      dispatch(setStateWorkRepairFetching());

      const date = new Date();
      const defaultStartDate = moment(date.setDate(date.getDate() - 3)).format('YYYYMMDD');

      const req = {
        rwCode: searchParams.IncidentNo || '',
        customerName: searchParams.CustomerName || '',
        telephone: searchParams.Telephone || '',
        informDateStart: searchParams.FromDate || defaultStartDate,
        informDateEnd: searchParams.ToDate || '',
        status: '',
        pageInfo: {
          recordCount: 0,
          pageSize: 1000,
          pageCount: 0,
          currentPage: 0,
        },
      };

      const res = await callApi(req);
      dispatch(setStateWorkRepairSuccess(res.data.result));
      dispatch(setWorkRepairSearchParams(searchParams));
      if (callback) callback();
    } catch (error) {
      checkedToken(error, props);
      dispatch(setStateWorkRepairFailed());
    }
  };
};

export const loadDataWitchPostFilter = (
  tel = '',
  cusname = '',
  no = '',
  receivedcasedate = '',
  completedCaseDate = '',
  props,
  callback,
) => {
  return async dispatch => {
    try {
      let req = {
        rwCode: no,
        customerName: cusname,
        telephone: tel,
        informDateStart:
        receivedcasedate == '' ? '' : receivedcasedate,
        informDateEnd:
        completedCaseDate == '' ? '' : completedCaseDate,
        status: '',
        pageInfo: {
          recordCount: 0,
          pageSize: 1000,
          pageCount: 0,
          currentPage: 0,
        },
      };
      await callApi(req)
        .then(async res => {
          // console.log("✅ API response", res.data.result);
          if (res.data.result.length > 0) {
            dispatch(setStateWorkRepairSuccess(res.data.result));
            callback(1);
          } else {
            callback(0);
          }
        })
        .catch(error => {
          dispatch(setStateWorkRepairFailed());
          checkedToken(error, props);
        });
    } catch (error) {
      dispatch(setStateWorkRepairFailed());
    }
  };
};

const callApi = async req => {
  const token = await getToken().then(data => {
    return data;
  });
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${url.serchRepairWork}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: req,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};
