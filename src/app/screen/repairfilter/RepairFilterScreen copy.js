import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Box, NativeBaseProvider } from "native-base";
// import { DatePickerModal } from "react-native-paper-dates";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import textsty from "../../styles/TextStyle";
import repairFilterStyle from "../../styles/RepairFilterStyle";
import { dateNowTh, dateNowThBack } from "../../utils/Date";
import Awesome from "../../components/awesomealert/Awesome";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import * as receiveRepairFeedJsonAction from "../../actions/receiverepair/ReceiveRepairFeedJsonAction";
import * as workRepairAction from "../../actions/workrepair/WorkRepairAction";
import { SafeAreaView } from "react-native-safe-area-context";
// import { registerTranslation } from 'react-native-paper-dates';
// import { th } from 'date-fns/locale'; // Import the Thai locale from date-fns

// registerTranslation('th', th); // Register the Thai locale

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function ReceiveRepairSearchScreen(props) {
  const dispatch = useDispatch();
  // const repairFilterReducer = useSelector(state => state.repairFilterReducer);
  // const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [openNoti, setOpenNoti] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [notiDate, setNotiDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [noNoti, setNoNoti] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [visibleALert, setVisibleALert] = useState(false);
  const [show, setShow] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [callFunPik, setCallFunPik] = useState({
    date_fun: () => {},
  });

  const init = async () => {
    await setNotiDate(dateNowThBack(3));
    await setToDate(dateNowTh());
  };

  useEffect(() => {
    init();
  }, []);

  // const data = () => {
  //   const _ls = repairFilterReducer.dataObject.incidentSearchStatus.map(
  //     (i, l) => {
  //       return {label: i.text, value: i.value};
  //     },
  //   );
  //   return [..._ls];
  // };

  const formatDate = (date) => {
    // console.log("formatDate in function", date);
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear() + 543;

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const onDismissSingle_noti = React.useCallback(() => {
    setOpenNoti(false);
  }, [setOpenNoti]);

  const onDismissSingle_to = React.useCallback(() => {
    setOpenTo(false);
  }, [setOpenTo]);

  const onConfirmSingle_noti = React.useCallback(
    (params) => {
      setOpenNoti(false);
      setDate(params);
      setNotiDate(formatDate(params));
    },
    [setOpenNoti, setDate]
  );

  const onConfirmSingle_to = React.useCallback(
    (params) => {
      setOpenTo(false);
      setDate(params.date);
      setToDate(formatDate(params));
    },
    [(setOpenTo, setDate)]
  );

  const DatePicker_Noti = ({ con, dis }) => {
    return (
      <DateTimePickerModal
        isVisible={openNoti}
        mode="date"
        onConfirm={con}
        onCancel={dis}
        locale="th_TH"
      />
    );
  };

  const DatePicker_to = ({ con, dis }) => {
    return (
      <DateTimePickerModal
        isVisible={openTo}
        mode="date"
        onConfirm={con}
        onCancel={dis}
        locale="th_TH"
      />
    );
  };

  // Android
  const setStateDate_Noti = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setNotiDate(formatDate(currentDate));
    },
    [setNotiDate]
  );

  const setStateDate_To = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setToDate(formatDate(currentDate));
    },
    [setToDate]
  );

  // const DatePikerAndroid = () => {
  //   return (
  //     <DateTimePicker
  //       testID="dateTimePicker"
  //       locale="th-TH"
  //       value={date}
  //       mode={"date"}
  //       is24Hour={true}
  //       display="default"
  //       onChange={callFunPik.date_fun}
  //     />
  //   );
  // };
  const DatePikerAndroid = () => {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        locale="th-TH"
        value={date}
        mode={"date"}
        is24Hour={true}
        display="default"
        onChange={callFunPik.date_fun}
      />
    );
  };

  const switchDate = (key) => {
    switch (key) {
      case 1:
        setCallFunPik((state) => ({ ...state, date_fun: setStateDate_Noti }));
        setShow(true);
        break;

      case 2:
        setCallFunPik((state) => ({ ...state, date_fun: setStateDate_To }));
        setShow(true);
        break;
      default:
        break;
    }
  };

  const clear = () => {
    setNoNoti("");
    setName("");
    setTel("");
    setNotiDate(dateNowThBack(3)); // รีเซ็ตเป็นวันที่เริ่มต้น
    setToDate(dateNowTh());
  };

  const _alert = (result) => {
    setVisibleLoading(false);
    if (result == 1) {
      props.navigation.goBack();
    } else {
      setVisibleALert(true);
    }
  };

  const search = () => {
    setVisibleLoading(true);
    // const start_test = "20/11/2567"
    // const end_test = "21/11/2567"
    if (props.route.name == "ReceiveRepairSearchScreen") {
      // console.log("A")
      dispatch(
        receiveRepairFeedJsonAction.loadDataWitchPostFilter(
          tel,
          name,
          noNoti,
          notiDate,
          toDate,
          props,
          _alert
        )
      );
      // console.log("B")
    } else if (props.route.name == "ReceiveRepairSearchScreen2") {
      dispatch(
        workRepairAction.loadDataWitchPostFilter(
          tel,
          name,
          noNoti,
          notiDate,
          toDate,
          props,
          _alert
        )
      );
    }
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Box bg={"#FFFFFF"}>
          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  flexDirection: "column",
                }}
              >
                <View style={repairFilterStyle.space} />
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                  <Text style={textsty.text_normal_bold}>วันที่รับเเจ้ง</Text>
                </View>
                <View style={repairFilterStyle.input}>
                  <View style={repairFilterStyle.inputContainer}>
                    <TextInput
                      style={repairFilterStyle.textInput}
                      value={notiDate}
                      editable={false}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={repairFilterStyle.btnCalendar}
                      onPress={() =>
                        Platform.OS == "android"
                          ? switchDate(1)
                          : setOpenNoti(true)
                      }
                    >
                      <MaterialCommunityIcons
                        name="calendar-month"
                        size={30}
                        color="#283593"
                      />
                    </TouchableOpacity>
                    {setOpenNoti && (
                      <DatePicker_Noti
                        con={onConfirmSingle_noti}
                        dis={onDismissSingle_noti}
                      />
                    )}
                  </View>
                </View>
                <View style={repairFilterStyle.space} />
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                  <Text style={textsty.text_normal_bold}>ถึงวันที่รับแจ้ง</Text>
                </View>
                <View style={repairFilterStyle.input}>
                  <View style={repairFilterStyle.inputContainer}>
                    <TextInput
                      style={repairFilterStyle.textInput}
                      value={toDate}
                      editable={false}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={repairFilterStyle.btnCalendar}
                      onPress={() =>
                        Platform.OS == "android"
                          ? switchDate(2)
                          : setOpenTo(true)
                      }
                    >
                      <MaterialCommunityIcons
                        name="calendar-month"
                        size={30}
                        color="#283593"
                      />
                    </TouchableOpacity>
                    {setOpenTo && (
                      <DatePicker_to
                        con={onConfirmSingle_to}
                        dis={onDismissSingle_to}
                      />
                    )}
                  </View>
                </View>
                <View style={repairFilterStyle.space} />
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                  <Text style={textsty.text_normal_bold}>
                    {props.route.name == "RepairFilterScreen"
                      ? "เลขที่รับแจ้ง"
                      : "เลขงานซ่อม"}
                  </Text>
                </View>
                <View style={repairFilterStyle.input}>
                  <View style={repairFilterStyle.inputContainer}>
                    <TextInput
                      style={repairFilterStyle.textInput}
                      value={noNoti}
                      placeholder={
                        props.route.name == "RepairFilterScreen"
                          ? "เลขที่รับแจ้ง"
                          : "เลขงานซ่อม"
                      }
                      onChangeText={(text) => setNoNoti(text)}
                    />
                  </View>
                </View>
                <View style={repairFilterStyle.space} />
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                  <Text style={textsty.text_normal_bold}>ชื่อผู้เเจ้ง</Text>
                </View>
                <View style={repairFilterStyle.input}>
                  <View style={repairFilterStyle.inputContainer}>
                    <TextInput
                      style={repairFilterStyle.textInput}
                      value={name}
                      placeholder="ชื่อแจ้ง"
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                <View style={repairFilterStyle.space} />
                <View style={{ flex: 1, alignSelf: "stretch" }}>
                  <Text style={textsty.text_normal_bold}>เบอร์โทร</Text>
                </View>
                <View style={repairFilterStyle.input}>
                  <View style={repairFilterStyle.inputContainer}>
                    <TextInput
                      style={repairFilterStyle.textInput}
                      value={tel}
                      placeholder="เบอร์โทร"
                      onChangeText={(text) => setTel(text)}
                    />
                  </View>
                </View>
              </View>

              {/* <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
          <View style={{flex: 1, alignSelf: 'stretch'}}>
            <Text style={textsty.text_bold_12}>สถานะ</Text>
          </View>
        </View> */}
              {/* <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
          <View style={repairFilterStyle.panalPiker}>
            <View style={repairFilterStyle.iconPikker}>
              <MaterialCommunityIcons name="chevron-down" size={20} />
            </View>
            <Picker
              containerStyle={{borderRadius: 5}}
              textInputStyle={[textsty.text_sm_regular, {color: '#707070'}]}
              style={repairFilterStyle.picker}
              item={pickedData}
              items={data()}
              onItemChange={setPickedData}
              title="เลือกสถานะ"
              placeholder="เลือกสถานะ"
              isNullable></Picker>
          </View>
        </View> */}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <View
                style={{ flex: 1, alignSelf: "stretch", flexDirection: "row" }}
              >
                <View style={{ flex: 2, alignSelf: "stretch" }}>
                  <TouchableOpacity
                    onPress={() => {
                      clear();
                    }}
                    style={repairFilterStyle.btn_rem}
                  >
                    <Text style={[textsty.text_normal_bold, { color: "#FFF" }]}>
                      ล้าง
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.5, alignSelf: "stretch" }} />
                <View style={{ flex: 2, alignSelf: "stretch" }}>
                  <TouchableOpacity
                    onPress={() => {
                      search();
                    }}
                    style={repairFilterStyle.btn_srh}
                  >
                    <Text style={[textsty.text_normal_bold, { color: "#FFF" }]}>
                      ค้นหา
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {show && <DatePikerAndroid />}
            <Awesome
              visible={visibleALert}
              titleIcon={4}
              showCancelButton={false}
              showConfirmButton={true}
              textBody="ไม่พบข้อมูล"
              confirmText="ตกลง"
              onConfirmPress={() => {
                setVisibleALert(false);
              }}
            />
          </ScrollView>
          <LoadingSpinner
            width={0.75 * viewportWidth}
            height={0.18 * viewportHeight}
            visible={visibleLoading}
            textContent="กำลังโหลด"
            animation={"fade"}
            color={"#0000ff"}
          />
        </Box>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
