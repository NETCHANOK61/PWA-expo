import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Radio, Box, NativeBaseProvider } from "native-base";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
import MapJs from "./Map";
import Awesome from "../../../components/awesomealert/Awesome";
import LoadingSpinner from "../../../components/loading-spinner/loading-spinner";
import ViewShot from "react-native-view-shot";
import {
  setLocationSave,
  getLocationSave,
  setMapSnapValue,
  getValueMapSnap,
  removeValueMapSnap,
} from "../../../utils/Storage";
import { getProfile } from "../../../utils/Storage";
import * as saveLocationPointNormalAction from "../../../actions/jobsurvey/SaveLocationPointNormalAction";
import { setStateRadioPipe } from "../../../actions/workrepair/WorkRepairDetailAction";
import * as workRepairAction from "../../../actions/workrepair/WorkRepairAction";
import {
  checkLocationAccept,
  requestLocationAccept,
} from "../../../utils/permissionsDevice";
import { Ionicons } from "@expo/vector-icons";
import store from "../../../store/store";

export default function Savelocation(props) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const viewShot = useRef(null);

  const [onclicksearch, setOnClickSearch] = useState(false);

  const [pointlatitude, setPointlatitude] = useState("");
  const [pointlongitude, setPointlongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // const [state, setState] = useState({ addmarker: false });
  const [count, setCount] = useState(0);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [valueMapSnap, setValueMapSnap] = useState("");
  const [customAlert, setCustomAlert] = useState({
    titleIcon: 0,
    showConfirmButton: false,
    showCancelButton: false,
    textBody: "",
    confirmText: "",
    cancelText: "",
    onConfirmPress: () => {},
    onCancelPress: () => {},
  });
  const [wwCode, setWwCode] = useState("");
  const [visibleLoading, setVisibleLoading] = useState(false);
  const workRepairDetailReducer = useSelector(
    (state) => state.workRepairDetailReducer
  );


  const init = async (isFocused) => {
    let checkPermissions = await checkLocationAccept();
    if (checkPermissions != true) {
      await requestLocationAccept();
    }
    setNavigationOption();
    const profile = await getProfile().then((data) => {
      return data;
    });

    setWwCode(profile.ww_code);
    if (isFocused) {
      handlerCaseLocation();
    }
    return () => {
      setCount(0);
    };
  };
  useEffect(() => {
    init(isFocused);
  }, [isFocused]);

  const setStateAlert = (
    _titleIcon,
    _showConfirmButton,
    _showCancelButton,
    _textBody,
    _confirmText,
    _cancelText,
    _onConfirmPress,
    _onCancelPress
  ) => {
    setCustomAlert((state) => ({
      ...state,
      titleIcon: _titleIcon,
      showConfirmButton: _showConfirmButton,
      showCancelButton: _showCancelButton,
      textBody: _textBody,
      confirmText: _confirmText,
      cancelText: _cancelText,
      onConfirmPress: _onConfirmPress,
      onCancelPress: _onCancelPress,
    }));
  };

  const handlerCaseLocation = () => {
    //console.log('pipe_id', workRepairDetailReducer.dataArray.survey.pipe_id);
    //  setMapSnapValue('1');
    //  setValueMapSnap('1');
    // console.log("pipe_id",workRepairDetailReducer.dataArray)
    if (workRepairDetailReducer.dataArray.survey != null) {
      if (
        workRepairDetailReducer.dataArray.survey.latitude &&
        workRepairDetailReducer.dataArray.survey.longtitude
      ) {
        if (workRepairDetailReducer.dataArray.survey.pipe_id == "") {
          setMapSnapValue("2");
          setValueMapSnap("2");
          dispatch(setStateRadioPipe("2"));
        } else {
          setMapSnapValue("1");
          setValueMapSnap("1");
          dispatch(setStateRadioPipe("1"));
        }
      } else {
        setMapSnapValue("1");
        setValueMapSnap("1");
        dispatch(setStateRadioPipe("1"));
      }

      setPointlatitude(
        toFixed(workRepairDetailReducer.dataArray.survey.latitude, 6)
      );
      setPointlongitude(
        toFixed(workRepairDetailReducer.dataArray.survey.longtitude, 6)
      );
    } else {
      setPointlatitude(
        toFixed(
          props.route.params.data.incidents[0].caseLatitude == "" ||
            props.route.params.data.incidents[0].caseLatitude == null
            ? ""
            : props.route.params.data.incidents[0].caseLatitude,
          6
        )
      );
      setPointlongitude(
        toFixed(
          props.route.params.data.incidents[0].caseLongtitude == "" ||
            props.route.params.data.incidents[0].caseLongtitude == null
            ? ""
            : props.route.params.data.incidents[0].caseLongtitude,
          6
        )
      );
    }
  };

  const settingAlert = (key) => {
    setVisibleLoading(false);
    setVisibleAlert(true);
    switch (key) {
      case "ALERT_CONFIRM_SAVE_LOCATION":
        setStateAlert(
          2,
          true,
          true,
          "บันทึกลงจุดซ่อมหรือไม่",
          "ตกลง",
          "ยกเลิก",
          () => {
            setVisibleAlert(false);
            setTimeout(() => {
              setVisibleLoading(true);
              savePoint();
            }, 500);
          },
          () => {
            setVisibleAlert(false);
          }
        );
        break;

      case "ALERT_INSERT_SUCCESS":
        setStateAlert(
          1,
          true,
          false,
          "บันทึกข้อมูลเรียบร้อย",
          "ตกลง",
          "",
          () => {
            // setVisibleAlert(false);
            // // ✅ เพิ่ม dispatch โหลดข้อมูลใหม่
            // dispatch(workRepairAction.loadDataWitchPost(props));

            // setTimeout(() => {
            //   props.navigation.goBack();
            // }, 800);

            dispatch(
              workRepairAction.loadDataWitchPost(props, () => {
                const rwId = props.route.params.data.rwId;
                const list = store.getState().workRepairReducer.dataArray;
                const item = list.find((e) => e.rwId === rwId);
                // console.log("list", list);
                // console.log("looking for rwId:", rwId);
                // console.log(
                //   "all rwId in list:",
                //   list.map((e) => e.rwId)
                // );
                if (item) {
                  dispatch({
                    type: "ACTION_GETREPAIRWORKBYID_SUCCESS",
                    payload: item,
                  });
                }

                // กลับหน้าก่อนหน้าหรือทำอะไรก็ได้
                setVisibleAlert(false);
                props.navigation.goBack();
              })
            );
          },
          () => {}
        );
        break;
      case "ALERT_INSERT_FAILED":
        setVisibleLoading(false);
        setStateAlert(
          4,
          true,
          false,
          "ไม่สามารถบันทึกข้อมูลได้",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      // case 'INSERT_SUCCESS_RELOAD_MAP':
      //   setVisibleLoading(false);
      //   setVisibleAlert(false);
      //   setOnClickSearch(true);
      //   setLatitude(16.436837);
      //   setLongitude(102.846239);
      //   setCount(count + 1);
      //   // setPointlatitude(toFixed(16.436837, 6));
      //   // setPointlongitude(toFixed(102.846239, 6));
      //   // setLatitude(16.436837);
      //   // setLongitude(102.846239);
      //   break;
      default:
        break;
    }
  };

  const handleSetMapParameter = async (value, _latitude, _longitude) => {
    setPointlatitude(toFixed(_latitude, 6));
    setPointlongitude(toFixed(_longitude, 6));
    setLatitude(_latitude);
    setLongitude(_longitude);
    // setState(_state => ({ ..._state, addmarker: value }));

    await setLocationSave(JSON.stringify({ lat: _latitude, lng: _longitude }));
  };

  // const setPoint = useCallback(() => {
  //   setOnClickSearch(true);
  //   setLatitude(pointlatitude);
  //   setLongitude(pointlongitude);
  //   setCount(count + 1);
  // }, [count]);

  const setPoint = () => {
    setOnClickSearch(true);
    setLatitude(pointlatitude);
    setLongitude(pointlongitude);
    setCount(count + 1);
  };

  const capture = async () => {
    const base64_viewshot = await viewShot.current.capture().then((data) => {
      // console.log("do something with ", data);
      return data;
    });
    return base64_viewshot;
  };

  const savePoint = async () => {
    const _getlocat = await getLocationSave().then((data) => {
      return data;
    });
    const _mapSnap = await getValueMapSnap();
    const _viewShot = await capture();

    // console.log("_mapSnap",_mapSnap)
    dispatch(setStateRadioPipe(_mapSnap));

    dispatch(
      saveLocationPointNormalAction.saveLocationPointNormal(
        props,
        _getlocat,
        _viewShot,
        _mapSnap,
        settingAlert
      )
    );
  };

  const setNavigationOption = () => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.1}
          onPress={() => {
            settingAlert("ALERT_CONFIRM_SAVE_LOCATION");
          }}
          style={{ padding: 10 }}
        >
          <MaterialCommunityIcons
            name="content-save"
            size={25}
            color="#2c689e"
            style={{
              height: 24,
              width: 24,
            }}
          />
        </TouchableOpacity>
      ),
    });
  };

  const handleLatSurvey = () => {
    return workRepairDetailReducer.dataArray.survey != null
      ? workRepairDetailReducer.dataArray.survey.latitude
      : "";
  };

  const handleLntSurvey = () => {
    return workRepairDetailReducer.dataArray.survey != null
      ? workRepairDetailReducer.dataArray.survey.longtitude
      : "";
  };

  const toFixed = (num, pre) => {
    num *= Math.pow(10, pre);
    num =
      (Math.round(num, pre) + (num - Math.round(num, pre) >= 0.5 ? 1 : 0)) /
      Math.pow(10, pre);
    return num.toFixed(pre);
  };

  const onClickRadioValueMapSnap = (value) => {
    setValueMapSnap(value);
    setMapSnapValue(value);
    // dispatch(setStateRadioPipe(value));
  };

  return (
    <NativeBaseProvider>
      <Box flex={1}>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          <TouchableOpacity onPress={() => setPoint()} style={{ width: "13%" }}>
            <Ionicons name="search-circle-sharp" size={50} color="#2c689e" />
          </TouchableOpacity>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: "80%" }}
          >
            <TextInput
              keyboardAppearance="dark"
              returnKeyType="done"
              placeholder="ละติจูด"
              value={"" + pointlatitude}
              keyboardType="numeric"
              style={{
                backgroundColor: "#ffffff",
                width: "50%",
                textAlign: "center",
                height: 0.035 * viewportHeight,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#9d9d9d",
                fontSize: 16,
                color: "#000000",
                padding: 0,
                height: 40,
              }}
              onChangeText={(value) => {
                setPointlatitude(value);
              }}
              maxLength={9}
            />
            <View style={{ width: "2%" }} />
            <TextInput
              keyboardAppearance="dark"
              returnKeyType="done"
              placeholder="ลองจิจูด"
              keyboardType="numeric"
              value={"" + pointlongitude}
              style={{
                backgroundColor: "#ffffff",
                width: "50%",
                textAlign: "center",
                height: 0.035 * viewportHeight,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#9d9d9d",
                fontSize: 16,
                color: "#000000",
                padding: 0,
                height: 40,
              }}
              onChangeText={(value) => {
                setPointlongitude(value);
              }}
              maxLength={10}
            />
          </View>
        </View>
        <View style={{ width: "100%" }}>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="MapSnap"
            value={valueMapSnap}
            onChange={onClickRadioValueMapSnap}
          >
            <Box
              flexDirection={"row"}
              alignItems={"center"}
              w={"100%"}
              justifyContent={"center"}
            >
              <Radio value="1" my={1}>
                มีเส้นท่อ
              </Radio>
              <Radio value="2" my={1} ml={3}>
                ไม่มีเส้นท่อ
              </Radio>
            </Box>
          </Radio.Group>
        </View>
        <ViewShot
          style={{ height: viewportHeight }}
          options={{ format: "jpg", quality: 0.9, result: "base64" }}
          ref={viewShot}
        >
          <MapJs
            ww_code={wwCode}
            searchClick={onclicksearch}
            callbackSearchClick={() => {
              setOnClickSearch(false);
            }}
            pointlatitude={pointlatitude}
            pointlongitude={pointlongitude}
            latitude={latitude}
            longitude={longitude}
            latSurvey={handleLatSurvey()}
            lngSurvey={handleLntSurvey()}
            caseLoacation={{
              caseLat: props.route.params.data.incidents[0].caseLatitude,
              castLng: props.route.params.data.incidents[0].caseLongtitude,
            }}
            onClickSave={(value, _latitude, _longitude) => {
              handleSetMapParameter(value, _latitude, _longitude);
            }}
          />
        </ViewShot>
        <Awesome
          visible={visibleAlert}
          titleIcon={customAlert.titleIcon}
          showConfirmButton={customAlert.showConfirmButton}
          showCancelButton={customAlert.showCancelButton}
          textBody={customAlert.textBody}
          confirmText={customAlert.confirmText}
          cancelText={customAlert.cancelText}
          onConfirmPress={customAlert.onConfirmPress}
          onCancelPress={customAlert.onCancelPress}
        />
        <LoadingSpinner
          visible={visibleLoading}
          textContent="กำลังบันทึก"
          animation={"fade"}
          color={"#0000ff"}
        />
      </Box>
    </NativeBaseProvider>
  );
}
