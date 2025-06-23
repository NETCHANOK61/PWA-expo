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
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NativeBaseProvider, HStack } from "native-base";

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
import workRepairDetailStyle from "../../styles/WorkRepairDetailStyle";

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

  const [leakwoundisFocus, setLeakwoundIsFocus] = useState(false);
  const [empoyeesisFocus, setEmpoyeesIsFocus] = useState(false);
  const [tpyofpipesisFocus, setTpyofpipesisFocus] = useState(false);
  const [sizeofpipesisFocus, setSizeofpipesisFocus] = useState(false);
  const [processGISisFocus, setProcessGISisFocus] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

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

  // const init = async () => {
  //   // ✅ เคลียร์ state เดิมก่อนโหลดข้อมูลใหม่
  //   setDateTime({
  //     dateForm: "",
  //     dateTo: "",
  //     dateTextTure: "",
  //     timeFrom: "",
  //     timeTo: "",
  //     timeTextTrue: "",
  //   });

  //   setPickerdVal({
  //     empoyees: "",
  //     serfaces: "",
  //     tpyofpipes: "",
  //     sizeofpipes: "",
  //     processpipes: "",
  //     leakwound: "",
  //     leakwound_s: "",
  //   });

  //   setBrokenAppearance("");
  //   setHoleDepth("");
  //   setHoleLength("");
  //   setHoleWidth("");
  //   setArrPipeSize([]);
  //   setArrProcessGIS([]);
  //   toggleChecked(false);
  //   toggleCheckedLat(false);
  //   setToggleCheckedSizePipe(false);

  //   // ✅ โหลดข้อมูลใหม่
  //   loadDataSetView();
  //   loadDataPinLocationPip();
  //   // console.log(pickerdVal);

  //   let checkPermissions = await checkPermissionsAccept();
  //   if (!checkPermissions) await requestPermissionsAccept();
  // };

  const init = async () => {
    // ✅ เคลียร์ค่าเดิม
    setDateTime({
      dateForm: "",
      dateTo: "",
      dateTextTure: "",
      timeFrom: "",
      timeTo: "",
      timeTextTrue: "",
    });

    setPickerdVal({
      empoyees: "",
      serfaces: "",
      tpyofpipes: "",
      sizeofpipes: "",
      processpipes: "",
      leakwound: "",
      leakwound_s: "",
    });

    setBrokenAppearance("");
    setHoleDepth("");
    setHoleLength("");
    setHoleWidth("");
    setArrPipeSize([]);
    setArrProcessGIS([]);
    toggleChecked(false);
    toggleCheckedLat(false);
    setToggleCheckedSizePipe(false);

    // ✅ ดึงค่าจาก props.data ใหม่ (หลัง save)
    if (props.data?.process) {
      setBrokenAppearance(props.data.process.brokenAppearance || "");
      setHoleDepth(props.data.process.holeDepth || "");
      setHoleLength(props.data.process.holeLength || "");
      setHoleWidth(props.data.process.holeWidth || "");

      // ตัวอย่างเติม picker
      setPickerdVal((prev) => ({
        ...prev,
        empoyees: props.data.process.empoyeeId || "",
        serfaces: props.data.process.surfaceId || "",
        tpyofpipes: props.data.process.pipeTypeId || "",
        leakwound: props.data.process.woundId || "",
        // etc.
      }));

      // ✅ ตั้ง toggle ต่าง ๆ
      toggleChecked(!!props.data.process.isNotGIS);
      toggleCheckedLat(!!props.data.process.useLatlong);
    }

    // ✅ โหลด dropdown ต่าง ๆ
    loadDataSetView();
    loadDataPinLocationPip();

    let checkPermissions = await checkPermissionsAccept();
    if (!checkPermissions) await requestPermissionsAccept();
  };

  useEffect(() => {
    if (props.data?.rwId) {
      init();
    }
  }, [props.data?.rwId]);

  const loadDataSetView = () => {
    const process = props.data?.process;
    // console.log(process);

    if (!process) {
      setDateTime({
        dateForm: dateNowTh(),
        dateTo: dateNowTh(),
        dateTextTure: dateNowTh(),
        timeFrom: timeNow(),
        timeTo: timeNow(),
        timeTextTrue: timeNow(),
      });
      return;
    }

    setDateTime({
      dateForm: process.fromProcessDate
        ? convertDateServiceToDateTh(process.fromProcessDate)
        : dateNowTh(),
      dateTo: process.toProcessDate
        ? convertDateServiceToDateTh(process.toProcessDate)
        : dateNowTh(),
      dateTextTure: process.surfaceFixedDate
        ? convertDateServiceToDateTh(process.surfaceFixedDate)
        : dateNowTh(),
      timeFrom: process.fromProcessTime || timeNow(),
      timeTo: process.toProcessTime || timeNow(),
      timeTextTrue: process.surfaceFixedTime || timeNow(),
    });

    setBrokenAppearance(process.brokenAppearance || "");
    // toggleChecked(process.isNotGIS === "1");
    loadData_saveSizeHole();
    loadData_savePickerVal();
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
    // console.log("TypePipe:", props.data.process.piplineType);
    // console.log("Picker Value State:", pickerdVal);
    // console.log("props.data.process****:", props.data.process);

    sizeofpipe(props.data.process.piplineType);
    let leakWound_id = "99";
    if (props.data.process.leakWound_id) {
      leakWound_id = props.data.process.leakWound_id.toString();
    }
    // console.log(leakWound_id)

    setPickerdVal((_state) => ({
      tpyofpipes: props.data.process.piplineType?.toString() ?? "",
      sizeofpipes: props.data.process.piplineSize?.toString() ?? "",
      serfaces: props.data.process.surfaceAppearance?.toString() ?? "",
      empoyees: props.data.process.repaireAccountId?.toString() ?? "",
      processpipes: props.data.process.isNotGIS?.toString() ?? "",
      leakwound: leakWound_id == "99" ? "" : leakWound_id,
    }));

    // console.log("loadData_savePickerVal:", props.data.process);
  };

  const loadDataPinLocationPip = () => {
    const survey = workRepairDetailReducer.dataArray?.survey || {};
    const savePoint = saveLocationPointNormalReducer.dataObj || {};
    // console.log(survey);
    // console.log(savePoint);

    // เช็กค่าพิกัดว่ามีหรือไม่
    const hasCoordinates =
      !!survey?.latitude?.trim() && !!survey?.longtitude?.trim();
    toggleCheckedLat(hasCoordinates);

    if (saveLocationPointNormalReducer.dataObj != null) {
      const { piplineType, piplineSize } = savePoint;

      setPickerdVal((prev) => ({
        ...prev,
        tpyofpipes: piplineType || "",
        sizeofpipes: piplineSize || "",
        processpipes: piplineType || piplineSize ? "0" : "",
      }));

      sizeofpipe(piplineType);
    } else {
      const { piplineType, piplineSize } = survey;

      setPickerdVal((prev) => ({
        ...prev,
        tpyofpipes: piplineType || "",
        sizeofpipes: piplineSize || "",
        processpipes:
          piplineType && piplineSize ? "0" : piplineType === "" ? "" : "",
      }));

      sizeofpipe(piplineType);

      // console.log("survey:", survey);
      // console.log("savePoint:", savePoint);
      // console.log("toggleCheckedLat:", hasNoCoordinates);
    }
    pickerProcess();
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

    if (nme === "tpyofpipes") {
      // console.log("tpyofpipes");
      sizeofpipe(label);
      setPickerdVal((_state) => ({
        ..._state,
        tpyofpipes: label.toString(),
        sizeofpipes: "",
      }));
    }

    if (nme == "processpipes") {
      if (label == 0) {
        if (
          workRepairDetailReducer.dataArray?.survey?.pipe_id == "" ||
          workRepairDetailReducer.dataArray?.survey?.piplineSize == "" ||
          workRepairDetailReducer.dataArray?.survey?.piplineType == ""
        ) {
          settingAlert("ALERT_WARNING_LOCATION");
        }
        toggleChecked(false);
      } else {
        toggleChecked(true);
      }
      setToggleCheckedSizePipe(true);
    }

    if (nme == "leakwound") {
      // console.log("leakwound");
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
    setDateTime((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const sizeofpipe = async (value) => {
    // console.log("sizeofpipe", value)
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
    // const pipeSizeOptions = arrr1.map((size) => ({ label: size, value: size }));
    const pipeSizeOptions = arrr1.map((size) => ({
      label: size,
      value: size.toString(),
    }));
    setArrPipeSize(pipeSizeOptions);
    // console.log(pipeSizeOptions)​
  };
  const pickerProcess = () => {
    let pickerProcessArrr = [];
    // 29/05/2025
    console.log(workRepairDetailReducer.dataArray);
    // console.log(
    //   "pickerProcess",
    //   workRepairDetailReducer.dataArray?.survey?.pipe_id
    // );
    const isNotGIS = workRepairDetailReducer.dataArray?.process?.isNotGIS;
    // console.log(isNotGIS);
    // console.log(pickerdVal.processpipes);
    // console.log("pickerProcess", workRepairDetailReducer.dataArray?.process)
    // #1
    if (workRepairDetailReducer.dataArray?.survey?.pipe_id) {
      console.log("if", 1)
      pickerProcessArrr.push(
        { label: "ตรงกับหน้างาน", value: "0" },
        { label: "ไม่ตรงกับหน้างาน", value: "1" }
      );

      if (isNotGIS !== "0" && isNotGIS !== "1") {
        setPickerData("processpipes", "0");
      } else {
        setPickerData("processpipes", isNotGIS);
      }
    }
    // #2
    else if (
      workRepairDetailReducer.dataArray?.survey?.pipe_id == "" &&
      (isNotGIS != undefined && isNotGIS != "")
    ) {
      console.log("2", isNotGIS);
      // isNotGIS ไม่มีใน obj, isNotGIS เป็นค่า "", isNotGIS = "0" / "1" / "2" / "3"
      // if (isNotGIS) {
      pickerProcessArrr.push(
        { label: "ไม่มีท่อในระบบ (ท่อจำหน่าย)", value: "2" },
        { label: "ไม่มีท่อในระบบ (ท่อบริการ/ขามาตร)", value: "3" }
      );
      if (isNotGIS != "2" || isNotGIS != "3") {
        setPickerData("processpipes", "2");
      } else {
        setPickerData("processpipes", isNotGIS);
      }
      // }
      // else {
      //   pickerProcessArrr.push(
      //     { label: "ตรงกับหน้างาน", value: "0" },
      //     { label: "ไม่ตรงกับหน้างาน", value: "1" },
      //     { label: "ไม่มีท่อในระบบ (ท่อจำหน่าย)", value: "2" },
      //     { label: "ไม่มีท่อในระบบ (ท่อบริการ/ขามาตร)", value: "3" }
      //   );
      //   setPickerData("processpipes", "");
      // }
    }
    // #3 default
    else {
      pickerProcessArrr.push(
        { label: "ตรงกับหน้างาน", value: "0" },
        { label: "ไม่ตรงกับหน้างาน", value: "1" },
        { label: "ไม่มีท่อในระบบ (ท่อจำหน่าย)", value: "2" },
        { label: "ไม่มีท่อในระบบ (ท่อบริการ/ขามาตร)", value: "3" }
      );
    }
    setArrProcessGIS(pickerProcessArrr);
    // console.log(workRepairDetailReducer.dataArray?.process?.isNotGIS)
    // console.log("pickerProcess", workRepairDetailReducer.dataArray)
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
    // console.log("saveRepairWork : ", params);

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

  // const disSizePipe = () => {
  //   console.log(pickerdVal.processpipes)
  //   let _dis = false;
  //   if (pickerdVal.processpipes === "1") {
  //     return _dis;
  //   }
  //   if (toggleCheckedSizePipe == true && checked == true) {
  //     _dis = false;
  //   } else {
  //     _dis = true;
  //   }
  //   // console.log(_dis)
  //   return _dis;
  // };

  // const disSizePipe = () => {
  //   console.log(toggleCheckedSizePipe)
  //   console.log(checked)
  //   let _dis = false;
  //   if (pickerdVal.processpipes === "1") {
  //     return _dis;
  //   }
  //   if (toggleCheckedSizePipe == true && checked == true) {
  //     _dis = false;
  //   } else {
  //     _dis = true;
  //   }
  //   // console.log(_dis)
  //   return _dis;
  // };

  // ปิด SizePipe ถ้าไม่มี Type หรือไม่มี option
  const disSizePipe = () => {
    const noType = !pickerdVal.tpyofpipes;
    const noSizeOptions = arrPipeSize.length === 0;
    const isNotMatchGIS = pickerdVal.processpipes === "0"; // ตรงกับหน้างาน
    return noType || noSizeOptions || isNotMatchGIS;
  };

  // ปิด TypePipe ถ้า GIS ยังไม่ได้เลือก
  const disableTypePipe = () => {
    const isNotMatchGIS = pickerdVal.processpipes === "0"; // ตรงกับหน้างาน
    return isNotMatchGIS;
  };

  const disProcesspipes = () => {
    let _dis = false;
    if (
      workRepairDetailReducer.dataArray?.survey?.latitude == "" &&
      workRepairDetailReducer.dataArray?.survey?.latitude == ""
    ) {
      _dis = true;
    } else {
      _dis = false;
    }
    return _dis;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ backgroundColor: "#FFFFFF" }}
        nestedScrollEnabled={true}
      >
        <View style={workRepairDetailStyle.section}>
          <NativeBaseProvider>
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 10,
                marginBottom: 5,
                borderLeftWidth: 5,
                borderColor: "#194f90",
                backgroundColor: "#f0f0f0",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={textsty.text_normal_bold_color_blue}>
                ระยะเวลาดำเนินการ
              </Text>
            </View>
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
                      <TouchableOpacity
                        onPress={() => setVisibleDateFrom(true)}
                      >
                        <InputNormal
                          hint="วันที่"
                          val={dateTime.dateForm}
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="calendar-month"
                            size={30}
                            color="#2c689e"
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
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="clock-time-three"
                            size={30}
                            color="#2c689e"
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
              <View
                style={{ flex: 1, flexDirection: "row", marginVertical: 10 }}
              >
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
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="calendar-month"
                            size={30}
                            color="#2c689e"
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
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="clock-time-three"
                            size={30}
                            color="#2c689e"
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
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="calendar-month"
                            size={30}
                            color="#2c689e"
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
                          color="#2c689e"
                          dis={false}
                        />
                        <View style={WorkCarryRepairStyle.iconDate}>
                          <MaterialCommunityIcons
                            name="clock-time-three"
                            size={30}
                            color="#2c689e"
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
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    marginBottom: 5,
                    borderLeftWidth: 5,
                    borderColor: "#194f90",
                    backgroundColor: "#f0f0f0",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={textsty.text_normal_bold_color_blue}>
                    รายละเอียดการดำเนินการซ่อม
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={textsty.text_normal_bold}>ผู้ซ่อม</Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      empoyeesisFocus && { borderColor: "#2c689e" },
                    ]}
                    placeholderStyle={textsty.text_normal_regular}
                    selectedTextStyle={textsty.text_normal_regular}
                    inputSearchStyle={textsty.text_normal_regular}
                    iconStyle={styles.iconStyle}
                    data={props.empoyees}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!empoyeesisFocus ? "เลือกผู้ซ่อม" : "..."}
                    searchPlaceholder="ค้นหา..."
                    value={pickerdVal.empoyees}
                    onFocus={() => setEmpoyeesIsFocus(true)}
                    onBlur={() => setEmpoyeesIsFocus(false)}
                    onChange={(item) => {
                      // setValue(item.value);
                      setPickerData("empoyees", item.value);
                      setEmpoyeesIsFocus(false);
                    }}
                    renderLeftIcon={() =>
                      pickerdVal.empoyees !== "0" &&
                      pickerdVal.empoyees !== "" && (
                        <AntDesign
                          style={styles.icon}
                          color="green"
                          name="checkcircle"
                          size={15}
                        />
                      )
                    }
                  />
                  <Text style={textsty.text_normal_bold}>
                    ลักษณะการแตก (รูปแบบแผล)
                    <Text style={[textsty.text_request]}>*</Text>
                  </Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      leakwoundisFocus && { borderColor: "#2c689e" },
                    ]}
                    placeholderStyle={textsty.text_normal_regular}
                    selectedTextStyle={textsty.text_normal_regular}
                    inputSearchStyle={textsty.text_normal_regular}
                    iconStyle={styles.iconStyle}
                    data={props.getLeakwounds.filter(
                      (item) => item.value !== "99"
                    )}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      !leakwoundisFocus ? "เลือกลักษณะการแตก" : "..."
                    }
                    searchPlaceholder="ค้นหา..."
                    value={pickerdVal.leakwound}
                    onFocus={() => setLeakwoundIsFocus(true)}
                    onBlur={() => setLeakwoundIsFocus(false)}
                    onChange={(item) => {
                      // setValue(item.value);
                      setPickerData("leakwound", item.value);
                      setLeakwoundIsFocus(false);
                    }}
                    renderLeftIcon={() =>
                      pickerdVal.leakwound !== "" && (
                        <AntDesign
                          style={styles.icon}
                          color="green"
                          name="checkcircle"
                          size={15}
                        />
                      )
                    }
                  />
                  <View style={WorkCarryRepairStyle.space} />
                  <HStack alignItems="center">
                    <Text style={textsty.text_normal_bold}>ชนิดของท่อ</Text>
                    <Text style={[textsty.text_request]}>*</Text>
                  </HStack>
                  <Dropdown
                    disable={disableTypePipe()}
                    style={[
                      styles.dropdown,
                      tpyofpipesisFocus && { borderColor: "#2c689e" },
                      disableTypePipe() && styles.disabledDropdown,
                    ]}
                    placeholderStyle={textsty.text_normal_regular}
                    selectedTextStyle={textsty.text_normal_regular}
                    inputSearchStyle={textsty.text_normal_regular}
                    iconStyle={styles.iconStyle}
                    data={props.getTypeOfPipes}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!tpyofpipesisFocus ? "เลือกชนิด" : "..."}
                    searchPlaceholder="ค้นหา..."
                    value={pickerdVal.tpyofpipes}
                    onFocus={() => setTpyofpipesisFocus(true)}
                    onBlur={() => setTpyofpipesisFocus(false)}
                    onChange={(item) => {
                      // setValue(item.value);
                      setPickerData("tpyofpipes", item.value);
                      setTpyofpipesisFocus(false);
                    }}
                    renderLeftIcon={() =>
                      pickerdVal.tpyofpipes && (
                        <AntDesign
                          style={styles.icon}
                          color="green"
                          name="checkcircle"
                          size={15}
                        />
                      )
                    }
                  />
                  <HStack alignItems="center">
                    <Text style={textsty.text_normal_bold}>ขนาดของท่อ</Text>
                    <Text style={[textsty.text_request]}>*</Text>
                  </HStack>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      sizeofpipesisFocus && { borderColor: "#2c689e" },
                      disSizePipe() && styles.disabledDropdown,
                    ]}
                    placeholderStyle={textsty.text_normal_regular}
                    selectedTextStyle={textsty.text_normal_regular}
                    inputSearchStyle={textsty.text_normal_regular}
                    iconStyle={styles.iconStyle}
                    data={arrPipeSize}
                    search
                    // maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!sizeofpipesisFocus ? "เลือกขนาด" : "..."}
                    searchPlaceholder="ค้นหา..."
                    value={pickerdVal.sizeofpipes}
                    disable={disSizePipe()}
                    onFocus={() => setSizeofpipesisFocus(true)}
                    onBlur={() => setSizeofpipesisFocus(false)}
                    onChange={(item) => {
                      // setValue(item.value);
                      setPickerData("sizeofpipes", item.value);
                      setSizeofpipesisFocus(false);
                    }}
                    renderLeftIcon={() =>
                      pickerdVal.sizeofpipes && (
                        <AntDesign
                          style={styles.icon}
                          color="green"
                          name="checkcircle"
                          size={15}
                        />
                      )
                    }
                  />
                  <View style={WorkCarryRepairStyle.space} />
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 2, marginRight: 5 }}>
                      <HStack alignItems="center">
                        <Text style={textsty.text_normal_bold}>
                          สถานะลงจุดซ่อม (GIS)
                        </Text>
                        <Text style={[textsty.text_request]}>*</Text>
                        {!checkedLat ? (
                          <Text style={textsty.text_normal_bold}>
                            กรุณาลงจุดซ่อม
                          </Text>
                        ) : null}
                      </HStack>
                    </View>
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Dropdown
                      disable={!checkedLat}
                      style={[
                        styles.dropdown,
                        processGISisFocus && { borderColor: "#2c689e" },
                        !checkedLat && styles.disabledDropdown,
                      ]}
                      placeholderStyle={textsty.text_normal_regular}
                      selectedTextStyle={textsty.text_normal_regular}
                      inputSearchStyle={textsty.text_normal_regular}
                      iconStyle={styles.iconStyle}
                      data={arrProcessGIS}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"เลือกสถานะลงจุดซ่อม (GIS)"}
                      searchPlaceholder="ค้นหา..."
                      value={pickerdVal.processpipes}
                      disabled={disProcesspipes()}
                      onFocus={() => setProcessGISisFocus(true)}
                      onBlur={() => setProcessGISisFocus(false)}
                      onChange={(item) => {
                        // setValue(item.value);
                        setPickerData("processpipes", item.value);
                        setProcessGISisFocus(false);
                      }}
                      renderLeftIcon={() =>
                        pickerdVal.processpipes != "" && (
                          <AntDesign
                            style={styles.icon}
                            color="green"
                            name="checkcircle"
                            size={15}
                          />
                        )
                      }
                    />
                  </View>
                  <View style={WorkCarryRepairStyle.space} />
                  <Text style={textsty.text_normal_bold}>ลักษณะพื้นผิว</Text>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: "blue" },
                    ]}
                    placeholderStyle={textsty.text_normal_regular}
                    selectedTextStyle={textsty.text_normal_regular}
                    inputSearchStyle={textsty.text_normal_regular}
                    iconStyle={styles.iconStyle}
                    data={props.getSerfaces}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "ลักษณะพื้นผิว" : "..."}
                    searchPlaceholder="ค้นหา..."
                    value={pickerdVal.serfaces}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      // setValue(item.value);
                      setPickerData("serfaces", item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() =>
                      pickerdVal.serfaces !== "0" &&
                      pickerdVal.serfaces !== "" && (
                        <AntDesign
                          style={styles.icon}
                          color="green"
                          name="checkcircle"
                          size={15}
                        />
                      )
                    }
                  />
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
            <View style={{ height: 100 }} />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 40,
    borderColor: "#2c689e",
    borderWidth: 1,
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
  set: {
    backgroundColor: "#59d090",
    borderColor: "#59d090",
  },
  disabledDropdown: {
    backgroundColor: "#e0e0e0", // เทาอ่อน
    borderColor: "#bdbdbd", // เทาเข้ม
  },
});
