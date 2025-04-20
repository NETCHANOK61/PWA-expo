import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Input } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import textsty from "../../styles/TextStyle";
import workRepairDetailStyle from "../../styles/WorkRepairDetailStyle";
import Awesome from "../../components/awesomealert/Awesome";
import { getProfile } from "../../utils/Storage";

export default function WorkRepairTebScreen(props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // setNavigationOption();
  }, []);

  const setNavigationOption = () => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: "#75a478",
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: { color: "#fff" },
      headerBackTitle: " ",
    });
  };
  const formatDate_Date_Time = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear() + 543,
      hh = d.getHours(),
      min = d.getMinutes();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hh.length < 2) hh = "0" + hh;
    if (min.length < 2) min = "0" + min;
    return [day, month, year].join("/") + " " + hh + ":" + min;
  };

  const openMap = async () => {
    const profile = await getProfile().then((data) => {
      return data;
    });
    if (props.data.incidents.length == 0) {
      setVisible(true);
    } else {
      if (
        props.data.incidents[0].caseLatitude == "" &&
        props.data.incidents[0].caseLongtitude == ""
      ) {
        setVisible(true);
      } else {
        props.navigation.navigate("location", {
          viewData: props.data.incidents[0],
          ww_code: profile.ww_code,
        });
      }
    }
  };
  const callPhone = (phone) => {
    if (Platform.OS === "android") {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }
    Linking.openURL(phoneNumber);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ backgroundColor: "#FFFFFF" }} nestedScrollEnabled={true}>
        {props.data != null ? (
          <View style={workRepairDetailStyle.section}>
            <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
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
                  marginTop: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
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
                          {props.data.incidents[0].customerName == null
                            ? "-"
                            : props.data.incidents[0].customerName}
                        </Text>
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
                        <Text style={textsty.text_normal_bold}>
                          รหัสผู้ใช้น้ำ
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {props.data.incidents[0].custCode}
                        </Text>
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
                        <Text style={textsty.text_normal_bold}>
                          ที่อยู่ผู้ใช้น้ำ
                        </Text>
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
                        <Text style={textsty.text_normal_regular}>
                          {props.data.incidents[0].custAddress == null
                            ? "-"
                            : props.data.incidents[0].custAddress}
                        </Text>
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
                        <Text style={textsty.text_normal_bold}>
                          เบอร์โทรศัพท์
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 3,
                          flexDirection: "row",
                          alignSelf: "stretch",
                        }}
                      >
                        <TouchableOpacity
                          style={{ flexDirection: "row" }}
                          onPress={() => {
                            callPhone(props.data.incidents[0].telephone);
                          }}
                        >
                          {props.data.incidents[0].telephone != "" ? (
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={[
                                  textsty.text_normal_regular,
                                  {
                                    color: "green",
                                    textDecorationLine: "underline",
                                  },
                                ]}
                              >
                                {props.data.incidents[0].telephone}
                              </Text>
                              <MaterialIcons name="call" size={20} />
                            </View>
                          ) : (
                            <Text
                              style={[
                                textsty.text_normal_regular,
                                {
                                  color: "green",
                                },
                              ]}
                            >
                              -
                            </Text>
                          )}
                        </TouchableOpacity>
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
                        <Text style={textsty.text_normal_bold}>
                          ช่องทางการรับแจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {props.data.incidents[0].informChannelID_Name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ height: 10 }}></View>
              </View>
              <View style={{ height: 10 }}></View>
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
                  รายละเอียดงานการรับเเจ้ง
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  marginTop: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
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
                          {props.data.incidents[0].pwaIncidentNo}
                        </Text>
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
                        <Text style={textsty.text_normal_bold}>
                          วันเวลารับเเจ้ง
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {props.data.incidents[0].receivedCaseDateText}
                        </Text>
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
                        <Text style={textsty.text_normal_bold}>
                          ประเภทการร้องเรียน
                        </Text>
                      </View>
                      <View style={{ flex: 3, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_regular}>
                          {props.data.incidents[0].requestType}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 1, alignSelf: "stretch" }}>
                        <Text style={textsty.text_normal_bold}>
                          หัวข้อการร้องเรียน
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 1, alignSelf: "stretch" }}>
                        <Text
                          style={[
                            textsty.text_normal_regular,
                            { color: "red" },
                          ]}
                        >
                          {props.data.incidents[0].requestCategorySubject == ""
                            ? "-"
                            : props.data.incidents[0].requestCategorySubject}
                        </Text>
                      </View>
                    </View>
                    <View style={{ height: 10 }}></View>
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
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 2, alignSelf: "stretch" }}>
                        <Text
                          style={[
                            textsty.text_normal_regular,
                            { color: "red" },
                          ]}
                        >
                          {props.data.incidents[0].caseDetail == ""
                            ? "-"
                            : props.data.incidents[0].caseDetail}
                        </Text>
                      </View>
                    </View>
                    <View style={{ height: 10 }}></View>
                  </View>
                </View>

                <View slyle={{ height: 10 }}></View>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
              <View style={{ flex: 1, flexDirection: "row", padding: 5 }}>
                <View
                  style={{
                    flex: 2,
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
                    <View style={workRepairDetailStyle.lsitInfo}>
                      <Text style={textsty.text_normal_bold}>
                        บริเวณที่เกิดเหตุ
                      </Text>
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
                      <Text style={textsty.text_normal_regular}>
                        {props.data.incidents[0].pwsIncidentAddress}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 10 }}></View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "stretch",
                      flexDirection: "row",
                    }}
                  >
                    <View style={workRepairDetailStyle.lsitInfo}>
                      <Text style={textsty.text_normal_bold}>ผู้รับเเจ้ง</Text>
                    </View>
                    <View style={{ flex: 2, alignSelf: "stretch" }}>
                      <Text style={textsty.text_normal_regular}>
                        {props.data.incidents[0].pwaInformReceiver_Name}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 40,
                    flex: 0.6,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    openMap();
                  }}
                >
                  <MaterialCommunityIcons name="earth" size={30} />
                  <Text style={textsty.text_normal_regular}>จุดแจ้งซ่อม</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <Awesome
        visible={visible}
        titleIcon={4}
        showCancelButton={false}
        showConfirmButton={true}
        textBody="ไม่พบตำเเหน่งจุดซ่อม"
        confirmText="ตกลง"
        onConfirmPress={() => {
          setVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}
