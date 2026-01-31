import axios from 'axios';
import {
  ACTION_SAVE_LOCATION_POINT_NORMAL_SUCCESS,
  ACTION_SAVE_LOCATION_POINT_NORMAL_FAILED,
  ACTION_GETREPAIRWORKBYID_SUCCESS,
  ACTION_GETREPAIRWORKBYID_FAILED,
} from '../../Constants';
import { checkedToken } from '../../utils/Service';
import { getToken } from '../../utils/Storage';
import url from '../UrlAction';

export const setStateSaveLocationPointNormalSuccess = payload => ({
  type: ACTION_SAVE_LOCATION_POINT_NORMAL_SUCCESS,
  payload,
});

export const setStateSaveLocationPointNormalFailed = () => ({
  type: ACTION_SAVE_LOCATION_POINT_NORMAL_FAILED,
});

export const setStateLocationTest = payload => ({
  type: ACTION_TEST_LOCATION,
  payload,
});

export const setStateGetRepairWorkByIdSuccess = payload => ({
  type: ACTION_GETREPAIRWORKBYID_SUCCESS,
  payload,
});

export const setStateGetRepairWorkByIdFailed = () => ({
  type: ACTION_GETREPAIRWORKBYID_FAILED,
});

export const saveLocationPointNormal = (props, location, capture, mapSnap, callBackAlert) => {
  return async dispatch => {
    try {
      const req = {
        RWId: props.route.params.rwId,
        Latitude: `${location.lat}`,
        Longtitude: `${location.lng}`,
        RWCode: props.route.params.rwCode,
        Files: [
          {
            FileName: 'image1.png',
            No: '6',
            OrderNo: '1',
            Comment: 'แผนที่จุดซ่อม',
            Base64File: capture,
          },
        ],
        MapSnap : mapSnap.toString(),
        SnapPipeStatus: mapSnap.toString(),
      };
      await serviveAxios('POST', req, url.updateRepairWorkSurvey)
        .then(async res => {
          dispatch(setStateSaveLocationPointNormalSuccess(res.data));
          callBackAlert('ALERT_INSERT_SUCCESS');

          await callServive(
            url.GetRepairWorkByID + '/' + props.route.params.rwId,
          )
            .then(async res => {
              dispatch(setStateGetRepairWorkByIdSuccess(res));
              //saveLocationCapture(req2);
            })
            .catch(error => {
              console.log(error);
              dispatch(setStateGetRepairWorkByIdFailed());
            });
        })
        .catch(error => {
          console.log(error);
          dispatch(setStateSaveLocationPointNormalFailed());
          callBackAlert('ALERT_INSERT_FAILED');
          checkedToken(error, props);
        });
    } catch (error) {
      console.log(error);
    }
  };
};

const saveLocationCapture = async _obj => {
  await serviveAxios('POST', _obj, url.capturePoi)
    .then(res => {
      //console.log('saveLocationCapture : ', res);
      // console.log('saveLocationCapture : ', 'Save Location Capture Success');
    })
    .catch(error => {
      console.log(error);
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
