import React, { useEffect, useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
} from "react-native";
import { Card, ButtonGroup, Overlay } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import textsty from "../../styles/TextStyle";
import detailWorkCallStyle from "../../styles/DetailWorkCallStyle";
import { dateViewShort } from "../../utils/Date";
import { getProfile } from "../../utils/Storage";
import * as receiveRepairDetailAction from "../../actions/receiverepair/ReceiveRepairDetailAction";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import Awesome from "../../components/awesomealert/Awesome";
import * as jsonActions from "../../actions/receiverepair/ReceiveRepairFeedJsonAction";
import {
  checkPermissionsAccept,
  requestPermissionsAccept,
} from "../../utils/permissionsDevice";
import DropDownPicker from "react-native-dropdown-picker";

export default function DetailWorkCallScreen(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const receiveRepairDetailReducer = useSelector(
    (state) => state.receiveRepairDetailReducer
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleOk, setVisibleOk] = useState(false);
  // const [pickedData, setPickedData] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [remark, setRemark] = useState("");
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);

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

  const init = async (isFocused) => {
    setViewData(receiveRepairDetailReducer.dataArray);
    dispatch(receiveRepairDetailAction.getIncidentRejectType());
    if (isFocused) {
      getInitial(isFocused);
    }
    let checkPermissions = await checkPermissionsAccept();
    if (checkPermissions != true) {
      await requestPermissionsAccept();
    }
  };

  useEffect(() => {
    init(isFocused);
  }, [isFocused]);

  const getInitial = () => {
    setSelectedIndex(0);
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

  const settingAlert = (key, value) => {
    setVisibleLoading(false);
    if (key == "ALERT_ACCEPT_SUCCESS") {
      navigation.navigate("workrepairtabscreen", {
        rwcode: value,
        page: "1",
      });
    } else {
      setTimeout(() => {
        setVisibleAlert(true);
        switch (key) {
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
              },
              () => {}
            );
            break;
          case "ALERT_REJECT_SUCCESS":
            setStateAlert(
              1,
              true,
              false,
              "บันทึกข้อมูลเรียบร้อย",
              "ตกลง",
              "",
              () => {
                setVisibleAlert(false);
                dispatch(jsonActions.loadDataWitchPost(props));
                navigation.goBack();
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
          case "ALERT_ACCEPT_FAILED":
            setStateAlert(
              4,
              true,
              false,
              value.message,
              "ตกลง",
              "",
              () => {
                setVisibleAlert(false);
              },
              () => {}
            );
            break;
          case "ALERT_REJECT_VERIFLY":
            setStateAlert(
              3,
              true,
              false,
              "กรุณาเลือกเหตุผลเเละกรอกรายละเอียด",
              "ตกลง",
              "",
              () => {
                setVisibleAlert(false);
              },
              () => {}
            );
            break;
          case "ALERT_LOCATION":
            setStateAlert(
              4,
              true,
              false,
              "ไม่พบตำแหน่งจุดซ่อม",
              "ตกลง",
              "",
              () => {
                setVisibleAlert(false);
                setSelectedIndex(0);
              },
              () => {}
            );
            break;
          default:
            break;
        }
      }, 800);
    }
  };

  const rejectTypeList = () => {
    if (receiveRepairDetailReducer.dataArrayTypeReject) {
      return receiveRepairDetailReducer.dataArrayTypeReject.map((l) => {
        return {
          label: l.text,
          value: l.value,
        };
      });
    } else {
      return [];
    }
  };

  // const createRepairWork = async () => {
  //   const profile = await getProfile().then((data) => {
  //     return data;
  //   });
  //   toggleOverlay(1);
  //   setVisibleLoading(true);
  //   dispatch(
  //     receiveRepairDetailAction.createRepairWork(
  //       viewData[0],
  //       profile.account_id,
  //       props,
  //       settingAlert
  //     )
  //   );
  // };

  const createRepairWork = async () => {
    // console.log("⚙️ Starting createRepairWork...");

    try {
      const profile = await getProfile();

      toggleOverlay(1);
      setVisibleLoading(true);
      dispatch(
        receiveRepairDetailAction.createRepairWork(
          viewData[0],
          profile.account_id,
          props,
          settingAlert
        )
      );
    } catch (err) {
      // console.error("❌ createRepairWork failed", err);
      settingAlert({
        visible: true,
        type: "error",
        message: "ไม่สามารถสร้างงานซ่อมได้ กรุณาลองใหม่",
      });
    }
  };

  const handlersReject = () => {
    if (reason == null || remark == "") {
      settingAlert("ALERT_REJECT_VERIFLY", "");
    } else {
      setVisibleLoading(true);
      dispatch(
        receiveRepairDetailAction.reJect(
          viewData[0].pwaIncidentID,
          reason,
          remark,
          settingAlert,
          props
        )
      );
    }

    setVisible(false);
  };

  const openMap = async () => {
    const profile = await getProfile().then((data) => {
      return data;
    });

    if (viewData[0].caseLatitude == "" && viewData[0].caseLongtitude == "") {
      // console.log(viewData[0].caseLatitude);
      settingAlert("ALERT_LOCATION", "");
    } else {
      // console.log("viewData[0]: ", viewData[0], profile.ww_code);
      navigation.navigate("location", {
        viewData: viewData[0],
        ww_code: profile.ww_code,
      });
    }
  };

  const toggleOverlay = (key) => {
    Keyboard.dismiss();
    switch (key) {
      case 1:
        setVisibleOk(!visibleOk);
        break;
      case 2:
        setVisible(!visible);
        break;
      default:
        break;
    }
  };

  const openOverlay = (bind) => {
    Keyboard.dismiss();
    setSelectedIndex(bind);
    switch (bind) {
      case 0:
        break;
      case 1:
        openMap();
        break;
      case 2:
        toggleOverlay(1);
        break;
      case 3:
        toggleOverlay(2);
        break;
      default:
        break;
    }
  };

  const icon_1 = () => (
    <View style={{ alignItems: "center" }}>
      <MaterialCommunityIcons
        name="clipboard-text-outline"
        color="white"
        size={20}
      />
      <Text style={[textsty.text_sm_regular, { color: "white" }]}>
        รายละเอียด
      </Text>
    </View>
  );
  const icon_2 = () => (
    <View style={{ alignItems: "center" }}>
      <MaterialCommunityIcons name="earth" color="white" size={20} />
      <Text style={[textsty.text_sm_regular, { color: "white" }]}>
        จุดแจ้งซ่อม
      </Text>
    </View>
  );
  const icon_3 = () => (
    <View style={{ alignItems: "center" }}>
      <MaterialCommunityIcons
        name="checkbox-marked-outline"
        color="white"
        size={20}
      />
      <Text style={[textsty.text_sm_regular, { color: "white" }]}>รับงาน</Text>
    </View>
  );
  const icon_4 = () => (
    <View style={{ alignItems: "center" }}>
      <MaterialCommunityIcons
        name="close-box-outline"
        color="white"
        size={20}
      />
      <Text style={[textsty.text_sm_regular, { color: "white" }]}>
        ไม่รับงาน
      </Text>
    </View>
  );
  const buttons = [
    { element: icon_1 },
    { element: icon_2 },
    { element: icon_3 },
    { element: icon_4 },
  ];

  const ListData = () => {
    return viewData.map((data) => {
      return (
        <Card
          key={data.pwaIncidentNo}
          containerStyle={detailWorkCallStyle.card}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginTop: 10,
            }}
          >
            <View style={{ flex: 1, flexDirection: "column", padding: 5 }}>
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
                  ข้อมูลผู้แจ้ง
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          ชื่อ-นามสกุล
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.customerName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          รหัสผู้ใช้น้ำ
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.custCode == null ? "-" : data.custCode}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>ที่อยู่</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.custAddress == null ? "-" : data.custAddress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 10 }}></View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>เบอร์โทร</Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.telephone == null ? "-" : data.telephone}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          ช่องทางการรับเเจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.informChannelID_Name == null
                            ? "-"
                            : data.informChannelID_Name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ height: 10 }}></View>
            <View style={{ flex: 1, flexDirection: "column", padding: 5 }}>
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
                  รายละเอียดการรับเเจ้ง
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          เลขที่รับเเจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.pwaIncidentNo}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={[textsty.text_normal_bold]}>
                          วันที่รับแจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {dateViewShort(data.receivedCaseDate)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          ประเภทการร้องเรียน
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.requestType}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 2, alignSelf: "stretch" }}>
                    <Text style={[textsty.text_normal_bold]}>
                      หัวข้อการร้องเรียน
                    </Text>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text
                          style={[
                            textsty.text_normal_regular,
                            { color: "red" },
                          ]}
                        >
                          {data.requestCategorySubject}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 10 }} />
                <View
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 2, alignSelf: "stretch" }}>
                    <Text style={textsty.text_normal_bold}>
                      รายละเอียดการรับเเจ้ง
                    </Text>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text
                          style={[
                            textsty.text_normal_regular,
                            { color: "red" },
                          ]}
                        >
                          {data.caseDetail == null ? "-" : data.caseDetail}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 10 }}></View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          บริเวณที่เกิดเหตุ
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.pwsIncidentAddress == null ||
                          data.pwsIncidentAddress == ""
                            ? "-"
                            : data.pwsIncidentAddress}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={detailWorkCallStyle.sublable}>
                  <View
                    style={{
                      flex: 4,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          ผู้รับเเจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {data.pwaInformReceiver_Name == null ||
                          data.pwaInformReceiver_Name == ""
                            ? "-"
                            : data.pwaInformReceiver_Name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ height: 10 }}></View>
              <View
                style={{
                  borderBottomColor: "#aeaeae",
                  borderBottomWidth: 1,
                }}
              />
            </View>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView>{ListData()}</ScrollView>
      <SafeAreaView>
        <ButtonGroup
          onPress={(bind) => {
            openOverlay(bind);
          }}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={detailWorkCallStyle.buttonGroup}
          innerBorderStyle={{ color: "#3a405a" }}
        ></ButtonGroup>
      </SafeAreaView>
      <View>
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={{ marginLeft: 10, marginRight: 10, width: "90%" }}
        >
          <Card containerStyle={detailWorkCallStyle.card}>
            <Text style={[textsty.text_xl_bold_color_blue, textsty.text_left]}>
              {"ไม่รับงานซ่อม"}
            </Text>
            <Card.Divider />
            <Text style={textsty.text_normal_regular}>
              {"เหตุผล"}
              <Text style={{ color: "red" }}>{"*"}</Text>
            </Text>
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              items={rejectTypeList()}
              placeholder="เลือกเหตุผล"
              value={reason}
              setValue={setReason}
            />

            {/* <Text>123</Text> */}
            {/* <SelectDropdown
              data={rejectTypeList()}
              defaultValueByIndex={1}
              onSelect={(selectedItem, index) => {
                const _filter =
                  receiveRepairDetailReducer.dataArrayTypeReject.filter(
                    data => {
                      return selectedItem == data.text;
                    },
                  );
                setPickedData(_filter);
              }}
              defaultButtonText={'เลือกเหตุผล'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                Keyboard.dismiss();
                return item;
              }}
              buttonStyle={detailWorkCallStyle.dropdown2BtnStyle}
              buttonTextStyle={detailWorkCallStyle.dropdown2BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={detailWorkCallStyle.dropdown2DropdownStyle}
              rowStyle={detailWorkCallStyle.dropdown2RowStyle}
              rowTextStyle={detailWorkCallStyle.dropdown2RowTxtStyle}
            /> */}

            <View style={{ height: 10 }} />
            <Text style={textsty.text_normal_regular}>
              รายละเอียด<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={detailWorkCallStyle.textInputMultiImage}
              multiline={true}
              numberOfLines={5}
              value={remark}
              onChangeText={(text) => {
                setRemark(text);
              }}
              placeholder="รายละเอียด"
              textAlignVertical={"top"}
            />
            <View style={{ height: 10 }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2c689e",
                  borderRadius: 10,
                  borderColor: "#2c689e",
                  marginTop: 20,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  height: 0.045 * height,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  handlersReject();
                }}
              >
                <Text style={[textsty.text_normal_regular, { color: "white" }]}>
                  ตกลง
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f57c00",
                  borderRadius: 10,
                  borderColor: "#f57c00",
                  marginTop: 20,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 0.045 * height,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  setVisible(false);
                  setSelectedIndex(0);
                  setRemark("");
                  setReason(null);
                  setOpen(false);
                }}
              >
                <Text style={[textsty.text_normal_regular, { color: "white" }]}>
                  ยกเลิก
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Overlay>
        <Overlay
          isVisible={visibleOk}
          onBackdropPress={toggleOverlay}
          overlayStyle={{ marginLeft: 10, marginRight: 10 }}
        >
          <Card
            containerStyle={[
              detailWorkCallStyle.card,
              { width: 0.8 * width, alignItems: "center" },
            ]}
          >
            <Card.Title
              style={[
                textsty.text_normal_bold_color_blue,
                { alignItems: "center", alignSelf: "center" },
              ]}
            >
              <View>
                <Image
                  style={[detailWorkCallStyle.image]}
                  source={require("../../assets/images/question-mark.png")}
                />
              </View>
            </Card.Title>
            <View style={{ alignItems: "center" }}>
              <Text style={textsty.text_normal_regular}>
                คุณต้องการรับงานนี้หรือไม่
              </Text>
            </View>
            <View style={{ height: 10 }} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2c689e",
                  borderRadius: 10,
                  borderColor: "#2c689e",
                  marginTop: 20,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  height: 0.045 * height,
                }}
                onPress={() => {
                  createRepairWork();
                }}
              >
                <Text style={[textsty.text_normal_regular, { color: "white" }]}>
                  {"ตกลง"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f57c00",
                  borderRadius: 10,
                  borderColor: "#f57c00",
                  marginTop: 20,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 0.045 * height,
                }}
                onPress={() => {
                  setVisibleOk(false);
                  // props.navigation.goBack();
                }}
              >
                <Text style={[textsty.text_normal_regular, { color: "white" }]}>
                  {"ยกเลิก"}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Overlay>
      </View>
      <Awesome
        visible={visibleAlert}
        titleIcon={customAlert.titleIcon}
        showCancelButton={customAlert.showCancelButton}
        showConfirmButton={customAlert.showConfirmButton}
        textBody={customAlert.textBody}
        confirmText={customAlert.confirmText}
        cancelText={customAlert.cancelText}
        onCancelPress={customAlert.onCancelPress}
        onConfirmPress={customAlert.onConfirmPress}
      />
      <LoadingSpinner
        visible={visibleLoading}
        textContent="กำลังโหลด"
        animation={"fade"}
        color={"#0000ff"}
      />
    </View>
  );
}
