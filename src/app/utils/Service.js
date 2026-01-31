import { getToken } from './Storage';
import url from '../actions/UrlAction';
import { Alert } from 'react-native';

export const getSizeOfPipes = key => {
  return new Promise(async resolve => {
    await serviveFetch('GET', url.getSizeOfPipes + '/' + key).then(data => {
      resolve(data);
    });
  });
};

export const serviveFetch = async (_act, _url) => {
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

export const checkedToken = (error, props) => {
  //console.log(error);
  if (error.response.status == 404 || error.response.status == 401) {
    Alert.alert('', 'Token หมดอายุกรุณาเข้าสู่ระบบใหม่อีกครั้ง', [
      {
        text: 'ตกลง',
        onPress: () => {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
              },
            ],
          });
        },
      },
    ]);
  }
};
