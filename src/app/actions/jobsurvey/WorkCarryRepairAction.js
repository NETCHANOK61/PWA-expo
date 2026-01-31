import axios from 'axios';
import {
  ACTION_LIST_PIKCER,
  ACTION_GET_SIZE_OF_PIPES,
  ACTION_GET_REQUEST_CATEGORY,
  ACTION_UPDATE_REPAIRWORK_PROCESS,
  ACTION_UPDATE_REPAIRWORK_CLOSEJOB,
  ACTION_GETREPAIRWORKBYID_SUCCESS,
  ACTION_GETREPAIRWORKBYID_FAILED,
  ACTION_REMEM_WORKCARRYREPAIR,
  ACTION_SAVE_LOCATION_POINT_NORMAL_FAILED,
} from '../../Constants';
import url from '../UrlAction';
import { getToken } from '../../utils/Storage';
import { checkedToken } from '../../utils/Service';

export const setStateListPiker = payload => ({
  type: ACTION_LIST_PIKCER,
  payload,
});

export const setStateGetSizeOfPipes = payload => ({
  type: ACTION_GET_SIZE_OF_PIPES,
  payload,
});

export const setStateSaveLocationPointNormalFailed = () => ({
  type: ACTION_SAVE_LOCATION_POINT_NORMAL_FAILED,
});

export const setStateGetRequstCategory = payload => ({
  type: ACTION_GET_REQUEST_CATEGORY,
  payload,
});

export const setStateUpdateRepairWorkProcess = payload => ({
  type: ACTION_UPDATE_REPAIRWORK_PROCESS,
  payload,
});

export const setStateUpdateRepairCloseJob = payload => ({
  type: ACTION_UPDATE_REPAIRWORK_CLOSEJOB,
  payload,
});

export const setStateGetRepairWorkByIdSuccess = payload => ({
  type: ACTION_GETREPAIRWORKBYID_SUCCESS,
  payload,
});

export const setStateGetRepairWorkByIdFailed = () => ({
  type: ACTION_GETREPAIRWORKBYID_FAILED,
});

export const setStateRemem = payload => ({
  type: ACTION_REMEM_WORKCARRYREPAIR,
  payload,
});

export const rememViewWorkCarryRepair = obj => {
  return dispatch => {
    dispatch(setStateRemem(obj));
  };
};

export const loadPiker = (brokenAppearanceText) => {
  // console.log("loadPiker", brokenAppearanceText)
  return async dispatch => {
    try {
      Promise.all([
        serviveFetch('GET', url.getEmployees),
        serviveFetch('GET', url.getSerfaces),
        serviveFetch('GET', url.getTypeOfPipes),
        serviveFetch('GET', url.getRequestType),
        serviveFetch('GET', url.getRequestCategorySubject),
        serviveFetch('GET', url.getLeakWounds + '?brokenAppearance=' + brokenAppearanceText),
      ]).then(
        ([
          dataEmployees,
          getSerfaces,
          getTypeOfPipes,
          getRequestType,
          getRequestCategorySubject,
          getLeakWounds,
        ]) => {
          const data_list = {
            dataEmployees,
            getSerfaces,
            getTypeOfPipes,
            getRequestType,
            getRequestCategorySubject,
            getLeakWounds
          };
          // console.log(data_list.getLeakWounds)
          dispatch(setStateListPiker(data_list));
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
};

export const getSizeOfPipes = key => {
  return async dispatch => {
    try {
      await serviveFetch('GET', url.getSizeOfPipes + '/' + key).then(data => {
        dispatch(setStateGetSizeOfPipes(data));
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getRequstCategory = () => {
  return async dispatch => {
    try {
      await serviveFetch('GET', url.getRequestCategory).then(data => {
        dispatch(setStateGetRequstCategory(data));
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const saveRepairWork = (obj, callBackAlert, props,typeClose,callBackClose) => {
  return async dispatch => {
    try {
      const req = { ...obj };
      await serviveAxios('POST', req, url.updateRepairWorkProcess)
        .then(async req => {
          if(typeClose == 'C'){
            req.data == true
            ? callBackClose('S')
            : callBackClose('F');
          }else{
            req.data == true
            ? callBackAlert('ALERT_INSERT_SUCCESS')
            : callBackAlert('ALERT_INSERT_FAILED');
          }
          // console.log("KSSN ::::: ", req.data);
          dispatch(setStateSaveLocationPointNormalFailed());
          // dispatch(setStateUpdateRepairWorkProcess(req.data));
        })
        .catch(err => {
          console.log(err);
          checkedToken(error, props);
          callBackAlert('ALERT_INSERT_FAILED');
        });
    } catch (error) {
      console.error(error);
    }
  };
};


export const loadSurvey = rwId => {
  return async dispatch => {
    try {
      await callServive(url.GetRepairWorkByID + '/' + rwId)
        .then(async res => {
          // console.log('callServive', res);
          dispatch(setStateGetRepairWorkByIdSuccess(res));
        })
        .catch(error => {
          console.log(error);
          dispatch(setStateGetRepairWorkByIdFailed());
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const saveCloseRepairWork = (props, callBackAlert) => {
  return async dispatch => {
    try {
      const req = { RWId: props.data.rwId };
      await serviveAxios('POST', req, url.updateRepairWorkCloseJob)
        .then(req => {
          // setTimeout(() => {
          //   dispatch(setStateUpdateRepairCloseJob(req.data));
          // }, 1000);
          setTimeout(() => {
            req.data == true
              ? callBackAlert('ALERT_INSERT_CLOSEJOB_SUCCESS')
              : callBackAlert('ALERT_INSERT_FAILED');
          }, 1000);
        })
        .catch(error => {
          console.log(error);
          checkedToken(error, props);
          callBackAlert('ALERT_INSERT_FAILED');
        });
    } catch (error) {
      console.log(error);
    }
  };
};

const serviveFetch = async (_act, _url) => {
  const token = await getToken().then(data => {
    return data;
  });
  return new Promise(resolve => {
    fetch(_url, {
      method: _act,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      resolve(res.json());
    });
  });
};

const serviveAxios = async (_act, req, _url) => {
  const token = await getToken().then(data => {
    return data;
  });

  return new Promise((resolve, reject) => {
    axios({
      method: _act,
      url: _url,
      headers: {
        Authorization: `Bearer ${token}`,
        responseType: 'json',
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

const callServive = async _url => {
  const token = await getToken().then(data => {
    return data;
  });
  return new Promise((resolve, reject) => {
    fetch(`${_url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      resolve(res.json());
    });
  });
};
