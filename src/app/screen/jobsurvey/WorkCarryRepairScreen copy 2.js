import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { CheckBox } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Select,
  VStack,
  CheckIcon,
  NativeBaseProvider,
  HStack,
  Icon,
} from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
// import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
import textsty from "../../styles/TextStyle";
import othersty from "../../styles/OtherStyle";
import WorkCarryRepairStyle from "../../styles/WorkCarryRepairStyle";
import Awesome from "../../components/awesomealert/Awesome";

import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
// import { ScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  formateDateyyyymmdd,
  formatDate,
  dateNowTh,
  timeNow,
  convertDateServiceToDateTh,
  convertTimeNowFormate,
  stringTime,
  dateViewShort,
} from "../../utils/Date";
import { getSizeOfPipes } from "../../utils/Service";
import * as workCarryRepairAction from "../../actions/jobsurvey/WorkCarryRepairAction";
import * as workRepairAction from "../../actions/workrepair/WorkRepairAction";
import {
  checkPermissionsAccept,
  requestPermissionsAccept,
} from "../../utils/permissionsDevice";

const InputNormal = ({ hint, onChangeText, val, color, dis, typeOfInput }) => {
  return (
    <TextInput
      inputMode={typeOfInput}
      style={[
        WorkCarryRepairStyle.textinput,
        { borderColor: color, color: "black" },
      ]}
      onChangeText={onChangeText}
      value={val}
      placeholder={hint}
      placeholderTextColor="#9e9e9e"
      editable={dis}
    />
  );
};

export default function WorkCarryRepairScreen(props) {
  console.log(props.getLeakwounds);
  const dispatch = useDispatch();

  const workCarrayRepairReducer = useSelector(
    (state) => state.workCarrayRepairReducer
  );

  const saveLocationPointNormalReducer = useSelector(
    (state) => state.saveLocationPointNormalReducer
  );

  const workRepairDetailReducer = useSelector(
    (state) => state.workRepairDetailReducer
  );

  const [date, setDate] = useState(new Date());
  const [visibleDateFrom, setVisibleDateFrom] = useState(false);
  const [visibleDateTo, setVisibleDateTo] = useState(false);
  const [visibleDateTextTure, setVisibleDateTextTure] = useState(false);
  const [visibleTimeFrom, setVisibleTimeFrom] = useState(false);
  const [visibleTimeTo, setVisibleTimeTo] = useState(false);
  const [visibleTimeTextTure, setVisibleTimeTextTure] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [checked, toggleChecked] = useState(false);
  const [checkedLat, toggleCheckedLat] = useState(false);

  const [toggleCheckedSizePipe, setToggleCheckedSizePipe] = useState(false);
  const [brokenAppearance, setBrokenAppearance] = useState("");
  const [holeDepth, setHoleDepth] = useState("");
  const [holeLength, setHoleLength] = useState("");
  const [holeWidth, setHoleWidth] = useState("");
  const [arrPipeSize, setArrPipeSize] = useState([]);
  const [arrProcessGIS, setArrProcessGIS] = useState([]);

  // Begin New Picker DateTime
  const [show, setShow] = useState(false);
  const [customPickerdateTime, setCustomPickerdateTime] = useState({
    mode: "date",
    onChang: () => {},
  });
  // End New Picker DateTime

  const [dateTime, setDateTime] = useState({
    dateForm: "",
    dateTo: "",
    dateTextTure: "",
    timeFrom: "",
    timeTo: "",
    timeTextTrue: "",
  });

  const [pickerdVal, setPickerdVal] = useState({
    empoyees: "",
    serfaces: "",
    tpyofpipes: "",
    sizeofpipes: "",
    processpipes: "",
    leakwound: "",
    leakwound_s: "",
  });

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

  // spiner load
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [isLoaddingSave, setIsLoaddingSave] = useState(false);

  const init = async () => {
    setVisibleLoading(true);
    loadDataSetView();
    loadDataPinLocationPip();
    pickerProcess();
    let checkPermissions = await checkPermissionsAccept();
    if (checkPermissions != true) {
      await requestPermissionsAccept();
    }
  };
  useEffect(() => {
    init();
  }, []);

  const loadDataSetView = () => {
    if (props.data.process == null) {
      setViewTime();
    } else {
      if (workCarrayRepairReducer.rememViewWorkCarray.sts == "1") {
        setDateTime((current) => ({
          ...current,
          dateForm:
            props.data.process.fromProcessDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.fromProcessDate),
          dateTo:
            props.data.process.toProcessDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.toProcessDate),
          dateTextTure:
            props.data.process.surfaceFixedDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.surfaceFixedDate),
          timeFrom:
            props.data.process.fromProcessTime == ""
              ? timeNow()
              : props.data.process.fromProcessTime,
          timeTo:
            props.data.process.toProcessTime == ""
              ? timeNow()
              : props.data.process.toProcessTime,
          timeTextTrue:
            props.data.process.surfaceFixedTime == ""
              ? timeNow()
              : props.data.process.surfaceFixedTime,
        }));

        const obj = {
          sts: "2",
          dateForm:
            props.data.process.fromProcessDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.fromProcessDate),
          dateTo:
            props.data.process.toProcessDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.toProcessDate),
          dateTextTure:
            props.data.process.surfaceFixedDate == ""
              ? dateNowTh()
              : convertDateServiceToDateTh(props.data.process.surfaceFixedDate),
          timeFrom:
            props.data.process.fromProcessTime == ""
              ? timeNow()
              : props.data.process.fromProcessTime,
          timeTo:
            props.data.process.toProcessTime == ""
              ? timeNow()
              : props.data.process.toProcessTime,
          timeTextTrue:
            props.data.process.surfaceFixedTime == ""
              ? timeNow()
              : props.data.process.surfaceFixedTime,
        };

        dispatch(workCarryRepairAction.rememViewWorkCarryRepair(obj));
      } else {
        setViewTime();
      }

      setBrokenAppearance(
        props.data.process.brokenAppearance == ""
          ? ""
          : props.data.process.brokenAppearance
      );

      toggleChecked(
        props.data.process.isNotGIS == "0" || props.data.process.isNotGIS == ""
          ? false
          : true
      );
      loadData_saveSizeHole();
      loadData_savePickerVal();
    }
    setVisibleLoading(false);
  };

  const setViewTime = () => {
    setDateTime((current) => ({
      ...current,
      dateForm: workCarrayRepairReducer.rememViewWorkCarray.dateForm,
      dateTo: workCarrayRepairReducer.rememViewWorkCarray.dateTo,
      dateTextTure: workCarrayRepairReducer.rememViewWorkCarray.dateTextTure,
      timeFrom: workCarrayRepairReducer.rememViewWorkCarray.timeFrom,
      timeTo: workCarrayRepairReducer.rememViewWorkCarray.timeTo,
      timeTextTrue: workCarrayRepairReducer.rememViewWorkCarray.timeTextTrue,
    }));
  };

  const loadData_savePickerVal = () => {
    let leakWound_id = "99";
    if (props.data.process.leakWound_id) {
      leakWound_id = props.data.process.leakWound_id.toString();
    }

    setPickerdVal((_state) => ({
      ..._state,
      tpyofpipes: props.data.process.piplineType,
      sizeofpipes: props.data.process.piplineSize,
      serfaces: props.data.process.surfaceAppearance,
      empoyees: props.data.process.repaireAccountId,
      processpipes: props.data.process.isNotGIS,
      leakwound: leakWound_id,
    }));
    sizeofpipe(props.data.process.piplineType);
  };

  const loadDataPinLocationPip = () => {
    toggleCheckedLat(
      workRepairDetailReducer.dataArray.survey.latitude == "" &&
        workRepairDetailReducer.dataArray.survey.latitude == ""
        ? true
        : false
    );
    if (saveLocationPointNormalReducer.dataObj != null) {
      setPickerdVal((_state) => ({
        ..._state,
        tpyofpipes: saveLocationPointNormalReducer.dataObj.piplineType,
        sizeofpipes: saveLocationPointNormalReducer.dataObj.piplineSize,
        processpipes:
          saveLocationPointNormalReducer.dataObj.piplineType != null ||
          saveLocationPointNormalReducer.dataObj.piplineSize != null
            ? "0"
            : "",
      }));
      sizeofpipe(saveLocationPointNormalReducer.dataObj.piplineType);
    }
  };

  const loadData_saveSizeHole = () => {
    setHoleWidth(
      props.data.process.holeWidth == "" ? "" : props.data.process.holeWidth
    );
    setHoleLength(
      props.data.process.holeLength == "" ? "" : props.data.process.holeLength
    );
    setHoleDepth(
      props.data.process.holeDepth == "" ? "" : props.data.process.holeDepth
    );
  };

  // Start Picker
  const setPickerData = (nme, label) => {
    setPickerdVal((_state) => ({
      ..._state,
      [nme]: label,
    }));

    if (nme == "tpyofpipes") {
      sizeofpipe(label);
      setPickerdVal((_state) => ({ ..._state, sizeofpipes: "" }));
    }
    if (nme == "processpipes") {
      if (label == 0) {
        if (
          workRepairDetailReducer.dataArray.survey.pipe_id == "" ||
          workRepairDetailReducer.dataArray.survey.piplineSize == "" ||
          workRepairDetailReducer.dataArray.survey.piplineType == ""
        ) {
          settingAlert("ALERT_WARNING_LOCATION");
        }
        toggleChecked(false);
      } else {
        toggleChecked(true);
      }
      // setPickerdVal(_state => ({
      //   ..._state, tpyofpipes: '', sizeofpipes: ''
      // }));
      setToggleCheckedSizePipe(false);
    }

    if (nme == "leakwound") {
      let _filterLeakwound = props.getLeakwounds.filter(
        (x) => x.value === label
      );
      setPickerdVal((_state) => ({
        ..._state,
        leakwound_s: truncateText(_filterLeakwound[0].label, 20),
      }));
      setBrokenAppearance(_filterLeakwound[0].label);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const setSateDataParams = (key, value) => {
    setDateTime((currentState) => ({ ...currentState, [key]: value }));
    const obj = {
      sts: "2",
      dateForm:
        key == "dateForm"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.dateForm,
      dateTo:
        key == "dateTo"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.dateTo,
      dateTextTure:
        key == "dateTextTure"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.dateTextTure,
      timeFrom:
        key == "timeFrom"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.timeFrom,
      timeTo:
        key == "timeTo"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.timeTo,
      timeTextTrue:
        key == "timeTextTrue"
          ? value
          : workCarrayRepairReducer.rememViewWorkCarray.timeTextTrue,
    };

    dispatch(workCarryRepairAction.rememViewWorkCarryRepair(obj));
  };

  const sizeofpipe = async (value) => {
    let arrr1 = [];
    if (value != "") {
      await getSizeOfPipes(value).then((data) => {
        data.pipelineSizes.map((l, i) => {
          arrr1.push(l);
        });
        if (data.pipelineSizes.length > 0) {
          setToggleCheckedSizePipe(true);
        } else {
          setToggleCheckedSizePipe(false);
        }
      });
    }
    setArrPipeSize(arrr1);
  };

  const pickerProcess = () => {
    let pickerProcessArrr = [];
    if (workRepairDetailReducer.radioPipe == "1") {
      pickerProcessArrr.push(
        { label: "ตรงกับหน้างาน", value: "0" },
        { label: "ไม่ตรงกับหน้างาน", value: "1" }
      );
    } else if (workRepairDetailReducer.radioPipe == "2") {
      pickerProcessArrr.push(
        { label: "ไม่มีท่อในระบบ (ท่อจำหน่าย)", value: "2" },
        { label: "ไม่มีท่อในระบบ (ท่อบริการ/ขามาตร)", value: "3" }
      );
    } else {
      pickerProcessArrr.push(
        { label: "ตรงกับหน้างาน", value: "0" },
        { label: "ไม่ตรงกับหน้างาน", value: "1" },
        { label: "ไม่มีท่อในระบบ (ท่อจำหน่าย)", value: "2" },
        { label: "ไม่มีท่อในระบบ (ท่อบริการ/ขามาตร)", value: "3" }
      );
    }
    setArrProcessGIS(pickerProcessArrr);
  };

  // End Picker

  // Start Date For ios
  const onDismissDate_From = useCallback(() => {
    setVisibleDateFrom(false);
  }, [setVisibleDateFrom]);

  const onDismissDate_To = useCallback(() => {
    setVisibleDateTo(false);
  }, [setVisibleDateTo]);

  const onDismissDate_TextTure = useCallback(() => {
    setVisibleDateTextTure(false);
  }, [setVisibleDateTextTure]);

  const onConfirmDate_Form = useCallback(
    (params) => {
      setVisibleDateFrom(false);
      setDate(params);
      setSateDataParams("dateForm", formatDate(params));
    },
    [setVisibleDateFrom, setDate]
  );

  const onConfirmDate_To = useCallback(
    (params) => {
      setVisibleDateTo(false);
      setDate(params);
      setSateDataParams("dateTo", formatDate(params));
    },
    [(setVisibleDateTo, setDate)]
  );

  const onConfirmDate_TextTure = useCallback(
    (params) => {
      setVisibleDateTextTure(false);
      setDate(params);
      setSateDataParams("dateTextTure", formatDate(params));
    },
    [(setVisibleDateTo, setDate)]
  );

  // End Date

  // Start Time For ios
  const onDismissTime_From = useCallback(() => {
    setVisibleTimeFrom(false);
  }, [setVisibleTimeFrom]);

  const onDismissTime_To = useCallback(() => {
    setVisibleTimeTo(false);
  }, [setVisibleTimeTo]);

  const onDismissTime_TextTure = useCallback(() => {
    setVisibleTimeTextTure(false);
  }, [setVisibleTimeTextTure]);

  const setTime = (param) => {
    // Extract hours and minutes from param (assuming it's a Date object or similar)
    const hours = param.getHours();
    const minutes = param.getMinutes();

    // Format the time string (e.g., "HH:mm")
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  const onConfirmTime_From = useCallback(
    (param) => {
      setVisibleTimeFrom(false);
      setSateDataParams("timeFrom", setTime(param));
    },
    [setVisibleTimeFrom]
  );

  const onConfirmTime_To = useCallback(
    (param) => {
      setVisibleTimeTo(false);
      setSateDataParams("timeTo", setTime(param));
    },
    [setVisibleTimeTo]
  );

  const onConfirmTime_TextTure = useCallback(
    (param) => {
      setVisibleTimeTextTure(false);
      setSateDataParams("timeTextTrue", setTime(param));
    },
    [setVisibleTimeTextTure]
  );
  // End Time

  const DatePicker_recive = ({ con, dis, vis }) => {
    return (
      <DateTimePickerModal
        isVisible={vis}
        mode="date"
        onConfirm={con}
        onCancel={dis}
        locale="th_TH"
      />
    );
  };

  const TimePicker_recive = ({ con, dis, vis }) => {
    return (
      <DateTimePickerModal
        isVisible={vis}
        mode="time"
        onConfirm={con}
        onCancel={dis}
        locale="th_TH"
      />
    );
  };

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

  const settingAlert = (key) => {
    setIsLoaddingSave(false);
    switch (key) {
      case "ALERT_CLOSE_WORK_REPAIR":
        setStateAlert(
          2,
          true,
          true,
          "คุณต้องการปิดงานซ่อมหรือไม่",
          "ตกลง",
          "ยกเลิก",
          () => {
            if (pickerdVal.processpipes == "") {
              settingAlert("ALERT_WARNING_STATUS_GIS");
              return;
            } else {
              if (pickerdVal.processpipes == "0") {
                if (
                  pickerdVal.tpyofpipes == "" ||
                  pickerdVal.sizeofpipes == ""
                ) {
                  settingAlert("ALERT_WARNING_LOCATION");
                  return;
                }
              } else {
                if (pickerdVal.tpyofpipes == "") {
                  settingAlert("ALERT_WARNING_PIPETYPE");
                  return;
                } else {
                  if (arrPipeSize.length != "") {
                    if (pickerdVal.sizeofpipes == "") {
                      settingAlert("ALERT_WARNING_PIPESIZE");
                      return;
                    }
                  }
                }
              }
            }
            if (pickerdVal.leakwound == "" || pickerdVal.leakwound == "99") {
              settingAlert("ALERT_WARNING_LEAKWOUND");
              return;
            }
            setVisibleAlert(false);
            setTimeout(() => {
              setIsLoaddingSave(true);
              saveWork(1);
            }, 500);
          },
          () => {
            setVisibleAlert(false);
          }
        );
        break;
      case "ALERT_CONFIRM_SAVE_RESULT":
        setStateAlert(
          2,
          true,
          true,
          "คุณต้องการบันทึกผลหรือไม่",
          "ตกลง",
          "ยกเลิก",
          () => {
            if (pickerdVal.processpipes == "") {
              settingAlert("ALERT_WARNING_STATUS_GIS");
              return;
            } else {
              if (pickerdVal.processpipes == "0") {
                if (
                  pickerdVal.tpyofpipes == "" ||
                  pickerdVal.sizeofpipes == ""
                ) {
                  settingAlert("ALERT_WARNING_LOCATION");
                  return;
                }
              } else {
                if (pickerdVal.tpyofpipes == "") {
                  settingAlert("ALERT_WARNING_PIPETYPE");
                  return;
                } else {
                  if (arrPipeSize.length != "") {
                    if (pickerdVal.sizeofpipes == "") {
                      settingAlert("ALERT_WARNING_PIPESIZE");
                      return;
                    }
                  }
                }
              }
            }
            if (pickerdVal.leakwound == "" || pickerdVal.leakwound == "99") {
              settingAlert("ALERT_WARNING_LEAKWOUND");
              return;
            }
            setVisibleAlert(false);
            setTimeout(() => {
              setIsLoaddingSave(true);
              saveWork(2);
            }, 500);
          },
          () => {
            setVisibleAlert(false);
          }
        );
        break;

      case "ALERT_INSERT_SUCCESS":
        //console.log("TEST_______");
        setStateAlert(
          1,
          true,
          false,
          "บันทึกข้อมูลเรียบร้อย",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
            dispatch(workCarryRepairAction.loadSurvey(props.data.rwId));
          },
          () => {}
        );
        break;

      case "ALERT_INSERT_CLOSEJOB_SUCCESS":
        setStateAlert(
          1,
          true,
          false,
          "บันทึกข้อมูลเรียบร้อย",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
            dispatch(workRepairAction.loadDataWitchPost(props));
            setTimeout(() => {
              props.navigation.goBack();
              props.navigation.jumpTo("WorkRepair", {
                owner: "WorkRepair",
              });
            }, 1000);
          },
          () => {}
        );
        break;

      case "ALERT_INSERT_FAILED":
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

      case "ALERT_VERIFY":
        setStateAlert(
          3,
          true,
          false,
          "กรุณาระบุข้อมูล",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;

      case "ALERT_WARNING_LOCATION":
        setStateAlert(
          3,
          true,
          false,
          "กรุณากลับไปลงจุดซ่อมใหม่",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      case "ALERT_WARNING_PIPETYPE":
        setStateAlert(
          3,
          true,
          false,
          "กรุณาระบุข้อมูลชนิดท่อ",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      case "ALERT_WARNING_PIPESIZE":
        setStateAlert(
          3,
          true,
          false,
          "กรุณาระบุข้อมูลขนาดของท่อ",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      case "ALERT_WARNING_LEAKWOUND":
        setStateAlert(
          3,
          true,
          false,
          "กรุณาระบุข้อมูลสาเหตุการแตกรั่ว",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      case "ALERT_WARNING_STATUS_GIS":
        setStateAlert(
          3,
          true,
          false,
          "กรุณาระบุสถานะลงจุดซ่อม (GIS)",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {}
        );
        break;
      default:
        break;
    }
    setVisibleAlert(true);
  };

  const saveRepairWork = () => {
    const params = {
      RWId: props.data.rwId,
      FromProcessDate: formateDateyyyymmdd(dateTime.dateForm),
      FromProcessTime: dateTime.timeFrom,
      ToProcessDate: formateDateyyyymmdd(dateTime.dateTo),
      ToProcessTime: dateTime.timeTo,
      SurfaceFixedDate: formateDateyyyymmdd(dateTime.dateTextTure),
      SurfaceFixedTime: dateTime.timeTextTrue,
      RepaireAccountId: pickerdVal.empoyees,

      BrokenAppearance: brokenAppearance,
      LeakWound_id: pickerdVal.leakwound,

      SurfaceAppearance: pickerdVal.serfaces,
      // PiplineSize: checked == true ? pickerdVal.sizeofpipes : '',
      // PiplineType: checked == true ? pickerdVal.tpyofpipes : '',
      PiplineSize: pickerdVal.sizeofpipes,
      PiplineType: pickerdVal.tpyofpipes,
      IsNotGIS: pickerdVal.processpipes, //checked == true ? '1' : '0',
      HoleWidth: holeWidth,
      HoleLength: holeLength,
      HoleDepth: holeDepth,
    };
    //console.log("saveRepairWork : ", params);
    dispatch(workCarryRepairAction.saveRepairWork(params, settingAlert, props));
  };

  const saveCloseRepairWork = () => {
    const params = {
      RWId: props.data.rwId,
      FromProcessDate: formateDateyyyymmdd(dateTime.dateForm),
      FromProcessTime: dateTime.timeFrom,
      ToProcessDate: formateDateyyyymmdd(dateTime.dateTo),
      ToProcessTime: dateTime.timeTo,
      SurfaceFixedDate: formateDateyyyymmdd(dateTime.dateTextTure),
      SurfaceFixedTime: dateTime.timeTextTrue,
      RepaireAccountId: pickerdVal.empoyees,

      BrokenAppearance: brokenAppearance,
      LeakWound_id: pickerdVal.leakwound,

      SurfaceAppearance: pickerdVal.serfaces,
      // PiplineSize: checked == true ? pickerdVal.sizeofpipes : '',
      // PiplineType: checked == true ? pickerdVal.tpyofpipes : '',
      PiplineSize: pickerdVal.sizeofpipes,
      PiplineType: pickerdVal.tpyofpipes,
      IsNotGIS: pickerdVal.processpipes, //checked == true ? '1' : '0',
      HoleWidth: holeWidth,
      HoleLength: holeLength,
      HoleDepth: holeDepth,
    };
    dispatch(
      workCarryRepairAction.saveRepairWork(
        params,
        "",
        props,
        "C",
        saveBeforeclose
      )
    );
  };

  const saveBeforeclose = (key) => {
    switch (key) {
      case "S":
        dispatch(
          workCarryRepairAction.saveCloseRepairWork(props, settingAlert)
        );
        break;
      default:
        break;
    }
  };

  const saveWork = (key) => {
    setTimeout(() => {
      switch (key) {
        case 1:
          saveCloseRepairWork();
          break;
        case 2:
          saveRepairWork();
          break;
        default:
          break;
      }
    }, 500);
  };

  const handleTypePipe = () => {
    let _filter = "";
    if (props.data.process != null) {
      if (props.data.process.piplineType != "") {
        _filter = props.getTypeOfPipes.filter((val) => {
          return val.value == props.data.process.piplineType;
        });
      } else {
        _filter = "";
      }
    } else {
      _filter = "";
    }

    return _filter;
  };

  const handleLeakWoundId = () => {
    let dataSelect;
    if (pickerdVal.leakwound) {
      let _filter = props.getLeakwounds.filter(
        (x) => x.value === pickerdVal.leakwound
      );
      if (_filter.length != 0) {
        dataSelect = _filter;
      } else {
        dataSelect = "";
      }
    } else {
      dataSelect = "";
    }
    return dataSelect;
  };

  const handleSurfaceAppearance = () => {
    let _filter = "";

    if (props.data.process != null) {
      if (props.data.process.surfaceAppearance != "") {
        if (props.data.process.surfaceAppearance == "0") {
          _filter = "";
        } else {
          _filter = props.getSerfaces.filter((val) => {
            return val.value == props.data.process.surfaceAppearance;
          });
        }
      } else {
        _filter = "";
      }
    } else {
      _filter = "";
    }

    return _filter;
  };

  const handleSizePipe = () => {
    let _r = "";
    if (props.data.process != null) {
      _r = props.data.process.piplineSize;
    }
    return _r;
  };

  const handleProcessPipes = () => {
    let _r = "";
    if (props.data.process != null) {
      _r = props.data.process.isNotGIS;
    }
    return _r;
  };

  // Begin For Android
  const timePicker_A = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("timeFrom", convertTimeNowFormate(currentDate));
    },
    [setSateDataParams]
  );

  const timePicker_B = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("timeTo", convertTimeNowFormate(currentDate));
    },
    [setSateDataParams]
  );

  const timePicker_C = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("timeTextTrue", convertTimeNowFormate(currentDate));
    },
    [setSateDataParams]
  );

  const datePicker_A = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("dateForm", dateViewShort(currentDate));
    },
    [setSateDataParams]
  );

  const datePicker_B = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("dateTo", dateViewShort(currentDate));
    },
    [setSateDataParams]
  );

  const datePicker_C = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setSateDataParams("dateTextTure", dateViewShort(currentDate));
    },
    [setSateDataParams]
  );

  // End For Android

  const DateTimePickker = () => {
    return (
      <DateTimePickerModal
        testID="dateTimePicker"
        locale="th-TH"
        value={date}
        mode={customPickerdateTime.mode}
        is24Hour={true}
        display="default"
        onChange={customPickerdateTime.onChang}
      />
    );
  };

  const showTimePiker = (key) => {
    switch (key) {
      case 1:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "time",
          onChang: timePicker_A,
        }));

        break;
      case 2:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "time",
          onChang: timePicker_B,
        }));
        break;
      case 3:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "time",
          onChang: timePicker_C,
        }));
        break;

      case 4:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "date",
          onChang: datePicker_A,
        }));
        break;

      case 5:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "date",
          onChang: datePicker_B,
        }));
        break;

      case 6:
        setShow(true);
        setCustomPickerdateTime((current) => ({
          ...current,
          mode: "date",
          onChang: datePicker_C,
        }));
        break;

      default:
        break;
    }
  };

  const handleRepaireAccountId = () => {
    let _filter = "";
    if (props.data.process != null) {
      if (props.data.process.repaireAccountId != "") {
        _filter = props.empoyees.filter((val) => {
          return val.value == props.data.process.repaireAccountId;
        });
      } else {
        _filter = "";
      }
    } else {
      _filter = "";
    }
    return _filter;
  };

  const disSizePipe = () => {
    let _dis = false;
    if (toggleCheckedSizePipe == true && checked == true) {
      _dis = false;
    } else {
      _dis = true;
    }

    return _dis;
  };

  const disProcesspipes = () => {
    let _dis = false;
    if (
      workRepairDetailReducer.dataArray.survey.latitude == "" &&
      workRepairDetailReducer.dataArray.survey.latitude == ""
    ) {
      _dis = true;
    } else {
      _dis = false;
    }

    return _dis;
  };

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const optionData = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  return (
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>
        <NativeBaseProvider>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginVertical: 10,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={textsty.text_normal_bold}>จาก</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={textsty.text_normal_bold}>เวลา</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <TouchableOpacity onPress={() => setVisibleDateFrom(true)}>
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.dateForm}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="calendar-month"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleDateFrom && (
                      <DatePicker_recive
                        con={onConfirmDate_Form}
                        dis={onDismissDate_From}
                        vis={visibleDateFrom}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleTimeFrom(true);
                      }}
                    >
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.timeFrom}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="clock-time-three"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleTimeFrom && (
                      <TimePicker_recive
                        con={onConfirmTime_From}
                        dis={onDismissTime_From}
                        vis={visibleTimeFrom}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginVertical: 10 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={textsty.text_normal_bold}>ถึง</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={textsty.text_normal_bold}>เวลา</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <TouchableOpacity onPress={() => setVisibleDateTo(true)}>
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.dateTo}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="calendar-month"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleDateTo && (
                      <DatePicker_recive
                        con={onConfirmDate_To}
                        dis={onDismissDate_To}
                        vis={visibleDateTo}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleTimeTo(true);
                      }}
                    >
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.timeTo}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="clock-time-three"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleTimeTo && (
                      <TimePicker_recive
                        con={onConfirmTime_To}
                        dis={onDismissTime_To}
                        vis={visibleTimeTo}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <Text style={textsty.text_normal_bold}>ซ่อมพื้นผิว</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={textsty.text_normal_bold}>เวลา</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <TouchableOpacity
                      onPress={() => setVisibleDateTextTure(true)}
                    >
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.dateTextTure}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="calendar-month"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleDateTextTure && (
                      <DatePicker_recive
                        con={onConfirmDate_TextTure}
                        dis={onDismissDate_TextTure}
                        vis={visibleDateTextTure}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleTimeTextTure(true);
                      }}
                    >
                      <InputNormal
                        hint="วันที่"
                        val={dateTime.timeTextTrue}
                        color="#283593"
                        dis={false}
                      />
                      <View style={WorkCarryRepairStyle.iconDate}>
                        <MaterialCommunityIcons
                          name="clock-time-three"
                          size={30}
                          color="#283593"
                        />
                      </View>
                    </TouchableOpacity>
                    {visibleTimeTextTure && (
                      <TimePicker_recive
                        con={onConfirmTime_TextTure}
                        dis={onDismissTime_TextTure}
                        vis={visibleTimeTextTure}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={{ height: 30 }} />
            <View style={othersty.liner} />
          </View>
          <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                }}
              >
                <Text style={textsty.text_normal_bold}>ผู้ซ่อม</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={props.empoyees}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "เลือกผู้ซ่อม" : "..."}
                  searchPlaceholder="ค้นหา..."
                  value={pickerdVal.empoyees}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    // setValue(item.value);
                    setPickerData("empoyees", item.value);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
                <Text style={textsty.text_normal_bold}>ลักษณะการแตก (รูปแบบแผล)</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={props.getLeakwounds}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "เลือกลักษณะการแตก" : "..."}
                  searchPlaceholder="ค้นหา..."
                  value={pickerdVal.leakwound}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    // setValue(item.value);
                    setPickerData("leakwound", item.value);
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
                {/* <HStack alignItems="center" mt={1}>
                  <Text style={[textsty.text_normal_bold]}>
                    ลักษณะการแตก (รูปแบบแผล)
                  </Text>
                  <Text style={[textsty.text_request]}>*</Text>
                </HStack> */}
                <VStack alignItems="center" space={4}>
                  <Select
                    key={"select2"}
                    // selectedValue={pickerdVal.leakwound}
                    selectedValue={(() => {
                      const selectedItem = props.getLeakwounds.find(
                        (item) => item.value === pickerdVal.leakwound
                      );
                      const label = selectedItem ? selectedItem.label : "";
                      return label.length > 10
                        ? label.substring(0, 10) + "..."
                        : label;
                    })()}
                    width="100%"
                    // boxSize={0.035 * viewportHeight}
                    _ios={{ boxSize: 0.04 * viewportHeight }}
                    _android={{ boxSize: 0.04 * viewportHeight }}
                    paddingTop={0}
                    paddingBottom={0}
                    paddingLeft={2}
                    borderColor="black"
                    fontSize={0.02 * viewportHeight}
                    fontFamily="Prompt-Regular"
                    accessibilityLabel="เลือกลักษณะการแตก"
                    placeholder="เลือกลักษณะการแตก"
                    onValueChange={(itemValue) =>
                      setPickerData("leakwound", itemValue)
                    }
                    _selectedItem={{
                      bg: "#2c689e",
                      endIcon: <CheckIcon size={4} />,
                    }}
                  >
                    {props.getLeakwounds.map((val, index) => (
                      <Select.Item
                        key={index}
                        label={val.label}
                        value={val.value}
                      />
                    ))}
                  </Select>
                </VStack>

                <View style={WorkCarryRepairStyle.space} />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <HStack alignItems="center">
                      <Text style={textsty.text_normal_bold}>ชนิดของท่อ</Text>
                      <Text style={[textsty.text_request]}>*</Text>
                    </HStack>
                  </View>
                  <View style={{ flex: 1 }}>
                    <HStack alignItems="center">
                      <Text style={textsty.text_normal_bold}>ขนาดของท่อ</Text>
                      <Text style={[textsty.text_request]}>*</Text>
                    </HStack>
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <VStack alignItems="center" space={4}>
                      <Select
                        key={"select3"}
                        selectedValue={pickerdVal.tpyofpipes}
                        width="100%"
                        _ios={{ boxSize: 0.04 * viewportHeight }}
                        _android={{ boxSize: 0.04 * viewportHeight }}
                        paddingTop={0}
                        paddingBottom={0}
                        paddingLeft={2}
                        borderColor="black"
                        fontSize={0.02 * viewportHeight}
                        fontFamily="Prompt-Regular"
                        accessibilityLabel="เลือกชนิดของท่อ"
                        placeholder="เลือกชนิดของท่อ"
                        selectedVal={handleTypePipe()}
                        isDisabled={!checked}
                        onValueChange={(itemValue) =>
                          setPickerData("tpyofpipes", itemValue)
                        }
                        _selectedItem={{
                          bg: "#2c689e",
                          endIcon: <CheckIcon size={4} />,
                        }}
                      >
                        {props.getTypeOfPipes.map((val, index) => (
                          <Select.Item
                            key={index}
                            label={val.label}
                            value={val.value}
                          />
                        ))}
                      </Select>
                    </VStack>
                  </View>

                  <View style={{ flex: 1 }}>
                    <VStack alignItems="center" space={4}>
                      <Select
                        key={"select4"}
                        selectedValue={pickerdVal.sizeofpipes}
                        width="100%"
                        _ios={{ boxSize: 0.04 * viewportHeight }}
                        _android={{ boxSize: 0.04 * viewportHeight }}
                        paddingTop={0}
                        paddingBottom={0}
                        paddingLeft={2}
                        borderColor="black"
                        fontSize={0.02 * viewportHeight}
                        fontFamily="Prompt-Regular"
                        accessibilityLabel="เลือกขนาด"
                        placeholder="เลือกขนาด"
                        selectedVal={handleSizePipe()}
                        isDisabled={disSizePipe()}
                        onValueChange={(itemValue) =>
                          setPickerData("sizeofpipes", itemValue)
                        }
                        _selectedItem={{
                          bg: "#2c689e",
                          endIcon: <CheckIcon size={4} />,
                        }}
                      >
                        {arrPipeSize.map((val, index) => (
                          <Select.Item key={index} label={val} value={val} />
                        ))}
                      </Select>
                    </VStack>
                  </View>
                </View>
                <View style={WorkCarryRepairStyle.space} />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 2, marginRight: 5 }}>
                    <HStack alignItems="center">
                      <Text style={textsty.text_normal_bold}>
                        สถานะลงจุดซ่อม (GIS)
                      </Text>
                      <Text style={[textsty.text_request]}>*</Text>
                      {checkedLat ? (
                        <Text style={textsty.text_normal_bold}>
                          กรุณาลงจุดซ่อม
                        </Text>
                      ) : null}
                    </HStack>
                  </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                  <VStack alignItems="center" space={4}>
                    <Select
                      key={"select5"}
                      selectedValue={pickerdVal.processpipes}
                      width="100%"
                      _ios={{ boxSize: 0.04 * viewportHeight }}
                      _android={{ boxSize: 0.04 * viewportHeight }}
                      paddingTop={0}
                      paddingBottom={0}
                      paddingLeft={2}
                      borderColor="black"
                      fontSize={0.02 * viewportHeight}
                      fontFamily="Prompt-Regular"
                      accessibilityLabel="เลือกสถานะลงจุดซ่อม(GIS)"
                      placeholder="เลือกสถานะลงจุดซ่อม(GIS)"
                      selectedVal={handleProcessPipes()}
                      isDisabled={disProcesspipes()}
                      onValueChange={(itemValue) =>
                        setPickerData("processpipes", itemValue)
                      }
                      _selectedItem={{
                        bg: "#2c689e",
                        endIcon: <CheckIcon size={4} />,
                      }}
                    >
                      {arrProcessGIS.map((val, index) => (
                        <Select.Item
                          key={index}
                          label={val.label}
                          value={val.value}
                        />
                      ))}
                    </Select>
                  </VStack>
                  {/* <View style={{ alignItems: 'center' }}>
                      <CheckBox
                        containerStyle={{
                          borderColor: 'transparent',
                          backgroundColor: 'transparent',
                          paddingRight: 0,
                        }}
                        checked={checked}
                        onPress={() => {
                          toggleChecked(!checked);
                          setToggleCheckedSizePipe(false);
                        }}
                      />
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={textsty.text_normal_bold}>
                        GIS ไม่ตรงกับหน้างาน
                      </Text>
                    </View> */}
                </View>
                <View style={WorkCarryRepairStyle.space} />
                <Text style={textsty.text_normal_bold}>ลักษณะพื้นผิว</Text>
                <VStack alignItems="center" space={4}>
                  <Select
                    key={"select6"}
                    selectedValue={pickerdVal.serfaces}
                    width="100%"
                    _ios={{ boxSize: 0.04 * viewportHeight }}
                    _android={{ boxSize: 0.04 * viewportHeight }}
                    paddingTop={0}
                    paddingBottom={0}
                    paddingLeft={2}
                    borderColor="black"
                    fontSize={0.02 * viewportHeight}
                    fontFamily="Prompt-Regular"
                    accessibilityLabel="ลักษณะพื้นผิว"
                    placeholder="ลักษณะพื้นผิว"
                    selectedVal={handleSurfaceAppearance()}
                    onValueChange={(itemValue) =>
                      setPickerData("serfaces", itemValue)
                    }
                    _selectedItem={{
                      bg: "#2c689e",
                      endIcon: <CheckIcon size={4} />,
                    }}
                  >
                    {props.getSerfaces.map((val, index) => (
                      <Select.Item
                        key={index}
                        label={val.label}
                        value={val.value}
                      />
                    ))}
                  </Select>
                </VStack>
                <View style={WorkCarryRepairStyle.space} />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 2, marginRight: 5 }}>
                    <Text style={textsty.text_normal_bold}>
                      ขนาดหลุม (เมตร)
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 2, marginRight: 5 }}>
                    <InputNormal
                      typeOfInput="decimal"
                      hint="กว้าง"
                      onChangeText={(text) => setHoleWidth(text)}
                      val={holeWidth}
                      color="#2c689e"
                    />
                  </View>
                  <View style={{ flex: 2, marginRight: 5 }}>
                    <InputNormal
                      typeOfInput="decimal"
                      hint="ยาว"
                      onChangeText={(text) => setHoleLength(text)}
                      val={holeLength}
                      color="#2c689e"
                    />
                  </View>
                  <View style={{ flex: 2, marginRight: 5 }}>
                    <InputNormal
                      typeOfInput="decimal"
                      hint="ลึก"
                      onChangeText={(text) => setHoleDepth(text)}
                      val={holeDepth}
                      color="#2c689e"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ height: 10 }} />
          <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#f57c00",
                height: 35,
                borderRadius: 10,
                borderColor: "#f57c00",
                marginTop: 20,
                borderWidth: 1,
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                settingAlert("ALERT_CLOSE_WORK_REPAIR");
              }}
            >
              <Text style={[textsty.text_normal_bold, { color: "white" }]}>
                ปิดงานซ่อม
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#2c689e",
                height: 35,
                borderRadius: 10,
                borderColor: "#2c689e",
                marginTop: 20,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                settingAlert("ALERT_CONFIRM_SAVE_RESULT");
              }}
            >
              <Text style={[textsty.text_normal_bold, { color: "white" }]}>
                บันทึกผล
              </Text>
            </TouchableOpacity>
          </View>
        </NativeBaseProvider>
        <LoadingSpinner
          visible={visibleLoading}
          textContent="กำลังโหลด"
          animation={"fade"}
          color={"#0000ff"}
        />
        <LoadingSpinner
          visible={isLoaddingSave}
          textContent="กำลังบันทึก"
          animation={"fade"}
          color={"#0000ff"}
        />
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
        {show && <DateTimePickker />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
