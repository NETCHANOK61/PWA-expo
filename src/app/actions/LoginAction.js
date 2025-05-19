import { ACTION_LOGIN, ACTION_FAILED } from "../Constants";
import axios from "axios";
import url from "./UrlAction";
import { StackActions } from "@react-navigation/native";

import {
  setStorage,
  setRememberLogin,
  removeRemem,
  getToken,
  setCheckEmployee,
  removeCheckEmployee,
} from "../utils/Storage";

export const setStateToLogin = (payload) => ({
  type: ACTION_LOGIN,
  payload,
});

export const setStateToFailed = () => ({
  type: ACTION_FAILED,
});

export const login = (
  username,
  password,
  props,
  checked,
  hideLoading,
  showalert,
  togleCheckEmployee
) => {
  return async (dispatch) => {
    try {
      const reqdata = `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(
        password
      )}&grant_type=password&isemployee=${
        togleCheckEmployee == true ? false : true
      }&appversion=v.1.0.41`;

      await loaddata(reqdata)
        .then(async (res) => {
          //console.log('USER DATA', res.data)
          dispatch(setStateToLogin(res.data));
          setStorage(JSON.stringify(setStore(res.data)));
          if (checked) {
            await setRememberLogin({ username, password });
            await setCheckEmployee(togleCheckEmployee == true ? "1" : null);
          } else {
            await removeRemem();
            await setCheckEmployee(togleCheckEmployee == true ? "1" : null);
          }
          hideLoading();
          if (res.data.role_name == "ว่าง" || res.data.role_name == "ตรวจสอบ") {
            showalert("ALERT_LOGIN_FAILED2");
            dispatch(setStateToFailed());
          } else if (res.data.user_active == "false") {
            showalert("USER_NOT_ACTIVE");
            dispatch(setStateToFailed());
          } else if (res.data.user_expire == "true") {
            showalert("EXPIRE_PASSWORD");
            dispatch(setStateToFailed());
          } else {
            props.navigation.dispatch(StackActions.replace("Success"));
          }
        })
        .catch((error) => {
          hideLoading();
          // console.log("e->", error.response)
          if (error.response.status == 400) {
            setTimeout(() => {
              showalert("ALERT_LOGIN_FAILED");
            }, 500);
          } else if (error.response.status == 500) {
            setTimeout(() => {
              showalert("ALERT_LOGIN_FAILED2");
            }, 500);
          }
          dispatch(setStateToFailed());
        });
    } catch (error) {
      console.log(error);
      dispatch(setStateToFailed());
    }
  };
};

const loaddata = (reqdata) => {
  // console.log(reqdata);
  // console.log(url.getToken);
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json",
      },
      method: "post",
      url: `${url.getToken}`,
      data: reqdata,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const autoloaddata = (reqdata) => {
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json",
      },
      method: "post",
      url: `${url.getToken}`,
      data: reqdata,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const resetPassword = async (username, password) => {
  const token = await getToken().then((data) => {
    return data;
  });
  const reqdata = {
    UserName: username,
    PassWord: password,
    IsPwaEmployee: false,
  };
  // console.log(token);
  // console.log(reqdata);
  // console.log(url.resetPassword);
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        "Content-type": "Application/json",
        Accept: "Application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "post",
      url: `${url.resetPassword}`,
      data: reqdata,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const setStore = (_data) => {
  return {
    token: _data.access_token,
    username: _data.user_name,
    account_id: _data.account_id,
    first_name: _data.first_name,
    last_name: _data.last_name,
    expire: _data.expire,
    role_name: _data.role_name,
    ww_code: _data.ww_code,
    ba: _data.ba,
    num_of_work: _data.num_of_work,
    position: _data.position,
  };
};
