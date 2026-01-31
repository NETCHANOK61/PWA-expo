import axios from 'axios';
import {
  ACTION_RECEIVEREPAIR_DETAIL_SUCCESS,
  ACTION_RECEIVEREPAIR_DETAIL_FAILED,
  ACTION_RECEIVEREPAIR_CREATE_REPAIR_WORK_SUCCESS,
  ACTION_RECEIVEREPAIR_CREATE_REPAIR_WORK_FAILED,
  ACTION_GETREPAIRWORKBYID_SUCCESS,
  ACTION_GETREPAIRWORKBYID_FAILED,
  ACTION_REJECT_SUCCESS,
  ACTION_REJECT_FAILED,
  ACTION_GET_INCIDENT_REJECT_TYPE_SUCCESS,
  ACTION_GET_INCIDENT_REJECT_TYPE_FAILED,
} from '../../Constants';
import url from '../UrlAction';
import { getToken } from '../../utils/Storage';
import { dateNowEn, timeNow } from '../../utils/Date';
import { checkedToken } from '../../utils/Service';

export const setStateReceiveRepairDetailSuccess = payload => ({
  type: ACTION_RECEIVEREPAIR_DETAIL_SUCCESS,
  payload,
});

export const setStateReceiveRepairDetailFailed = () => ({
  type: ACTION_RECEIVEREPAIR_DETAIL_FAILED,
});

export const setStateCreateReceiveRepairSuccess = payload => ({
  type: ACTION_RECEIVEREPAIR_CREATE_REPAIR_WORK_SUCCESS,
  payload,
});

export const setStateCreateReceiveRepairFailed = () => ({
  type: ACTION_RECEIVEREPAIR_CREATE_REPAIR_WORK_FAILED,
});

export const setStateGetRepairWorkByIdSuccess = payload => ({
  type: ACTION_GETREPAIRWORKBYID_SUCCESS,
  payload,
});
export const setStateGetRepairWorkByIdFailed = () => ({
  type: ACTION_GETREPAIRWORKBYID_FAILED,
});

export const setStateRejectSuccess = () => ({
  type: ACTION_REJECT_SUCCESS,
});

export const setStateRejectFailed = () => ({
  type: ACTION_REJECT_FAILED,
});

export const setStateGetIncidentRejectTypeSuccess = payload => ({
  type: ACTION_GET_INCIDENT_REJECT_TYPE_SUCCESS,
  payload,
});

export const setStateGetIncidentRejectTypeFailed = () => ({
  type: ACTION_GET_INCIDENT_REJECT_TYPE_FAILED,
});

export const setReceiveRepairDetail = (key, props) => {
  return async dispatch => {
    try {
      let req = {
        IncidentIds: [`'${key}'`],
      };
      await loaddata('POST', req, url.getIncidentByIds)
        .then(async res => {
          //console.log('==========>', res);
          dispatch(setStateReceiveRepairDetailSuccess(res.data));
          // props.navigation.navigate('RecevieRepairScreen');
          props.navigation.navigate('DetailReceiveScreen');
        })
        .catch(error => {
          console.log(error);
          checkedToken(error, props);
          dispatch(setStateReceiveRepairDetailFailed());
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createRepairWork = (info, account_id, props, alert) => {
  return async dispatch => {
    try {
      const req = {
        RWId: null,
        RWCode: null,
        ReceiveDate: dateNowEn(),
        ReceiveTime: timeNow(),
        RequestType: info.pwaIncidentTypeID,
        RequestCategory: info.pwaIncidentGroupID,
        RequestCategorySubject: info.caseTitle,
        InformDate: dateNowEn(),
        InformTime: timeNow(),
        ReceiverID: account_id,
        SLA: true,
        Reason: '',
        ProcessStage: '5',
        CreatedBy: '',
        UpdatedBy: '',
        location: info.pwsIncidentAddress,
        Incidents: [
          {
            PwaIncidentID: info.pwaIncidentID,
          },
        ],
      };

      await loaddata('POST', req, url.createRepairWork)
        .then(async res => {
          dispatch(setStateCreateReceiveRepairSuccess(res.data));
          await callServive(url.GetRepairWorkByID + '/' + res.data.rwId)
            .then(async res => {
              console.log("OK");
              dispatch(setStateGetRepairWorkByIdSuccess(res));
              alert('ALERT_ACCEPT_SUCCESS', res.rwCode);
            })
            .catch(error => {
              console.log("Error 1", error);
              alert('ALERT_INSERT_FAILED', '');
              dispatch(setStateGetRepairWorkByIdFailed());
            });
        })
        .catch(error => {
          console.log("Error 2", error);
          alert('ALERT_ACCEPT_FAILED', error.response.data);
        });
    } catch (error) {
      console.error(error);
    }
    return false;
  };
};

export const reJect = (insiId, reReason, remark, callBack, props) => {
  return async dispatch => {
    try {
      const req = {
        PwaIncidentID: insiId,
        RejectReasonID: parseInt(reReason),
        RejectReason: remark,
      };

      await loaddata('POST', req, url.reject)
        .then(async res => {
          dispatch(setStateRejectSuccess());
          callBack('ALERT_REJECT_SUCCESS', '');
        })
        .catch(error => {
          callBack('ALERT_INSERT_FAILED', '');
          checkedToken(error, props);
          dispatch(setStateRejectSuccess());
        });
    } catch (error) {
      console.error(error);
    }
  };
};

export const getIncidentRejectType = () => {
  return async dispatch => {
    await callServive(url.GetIncidentRejectType)
      .then(async res => {
        //console.log('=====>', res);
        dispatch(setStateGetIncidentRejectTypeSuccess(res.data));
      })
      .catch(error => {
        console.log('=====>', error);
        dispatch(setStateGetIncidentRejectTypeFailed());
      });
  };
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

const loaddata = async (_act, req, _url) => {
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
