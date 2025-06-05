import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import { getProfile, removeStore, removeRemem } from "../../utils/Storage";
import textStyle from "../../styles/TextStyle";
import CardList from "../../components/card/CardList";
import * as profileAction from "../../actions/profile/ProfileAction";
import { getCheckEmployee, removeCheckEmployee } from "../../utils/Storage";

const { height: viewReportHeight, width: viewReportWidth } =
  Dimensions.get("window");

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  //const profileReducer = useSelector(state => state.profileReducer);
  const [dataObject, setDataObject] = useState({});
  //const [numOfWork, setNumOfWork] = useState('');
  const [isemployee, setIsemployee] = useState(false);

  const init = async () => {
    // const remem = await getRememberLogin().then(data => {
    //   return data;
    // });
    setNavigationOption();
    const profile = await getProfile().then((data) => {
      return data;
    });
    const checkEmployee = await getCheckEmployee().then((data) => {
      return data;
    });
    if (isFocused) {
      getInitial();
    }
    setDataObject(profile);
    if (checkEmployee == "1") {
      setIsemployee(true);
    } else {
      setIsemployee(false);
    }
    // setNumOfWork(
    //   profileReducer == null ? '0' : profileReducer.dataObject.value,
    // );
  };

  useEffect(() => {
    init(isFocused);
  }, [isFocused]);

  const getInitial = () => {
    dispatch(profileAction.getNumOfWork());
  };

  const setNavigationOption = () => {
    props.navigation.setOptions({
      headerRight: () => null,
    });
  };

  // const setNavigationOption = () => {
  //   props.navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         activeOpacity={0.1}
  //         onPress={() => {
  //           props.navigation.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: 'Login',
  //               },
  //             ],
  //           });
  //           removeStore();
  //           removeRemem();
  //         }}
  //         style={{ padding: 10 }}>
  //         <MaterialCommunityIcons
  //           name="logout"
  //           size={20}
  //           color="#FFF"
  //           style={{
  //             height: 24,
  //             width: 24,
  //           }}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // };

  const arr_profile = (_obj) => {
    return [
      {
        index: 1,
        name: "ข้อมูลส่วนตัว",
        icon_p: "format-list-bulleted",
        lable: "",
      },
      {
        index: 2,
        name: "รหัสพนักงาน",
        icon_p: "account-circle",
        lable: _obj == null ? "" : _obj.username,
      },
      {
        index: 3,
        name: "ชื่อ-สกุล",
        icon_p: "account-circle",
        lable: `${_obj == null ? "" : _obj.first_name} ${
          _obj == null ? "" : _obj.last_name
        }`,
      },
      {
        index: 4,
        name: "ตำเเหน่ง",
        icon_p: "briefcase-variant",
        lable: _obj == null ? "" : _obj.position,
      },
      // {
      //   name: 'จำนวนรอรับงาน',
      //   icon_p: 'earth',
      //   lable: _obj == null ? '' : _obj.num_of_work,
      // },
    ];
  };

  const totarget = (key) => {
    dispatch(profileAction.setProfileTarget(key, props));
  };
  // console.log('IsEmployee', isemployee)

  const onClickLogout = () => {
    Alert.alert("ข้อความแจ้งเตือน!", "ยืนยันการออกจากระบบ", [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      {
        text: "ยืนยัน",
        onPress: () => {
          removeStore();
          removeRemem();
          removeCheckEmployee();
          dispatch({ type: "ACTION_LOGOUT" });
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1, justifyContent: "flex-start", height: 100 }}
        source={require("../../assets/images/bg_haed.png")}
      >
        <View style={{ height: 0.01 * viewReportHeight }} />
        {/* <Card containerStyle={screenStyle.card}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={screenStyle.btn_menu}
              onPress={() => {
                totarget(1);
              }}>
              <Image
                style={screenStyle.img}
                source={require('../../assets/images/repair_job.png')}
              />
              <Text style={textStyle.text_12}>รับงานซ่อม</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={screenStyle.btn_menu}
              onPress={() => { totarget(2) }}>
              <Image
                style={screenStyle.img}
                source={require('../../assets/images/detective_point.png')}
              />
              <Text style={textStyle.text_12}>งานซ่อม</Text>
            </TouchableOpacity>
            <TouchableOpacity style={screenStyle.btn_menu}>
              <Image
                style={screenStyle.img}
                source={require('../../assets/images/info.png')}
              />
              <Text style={textStyle.text_12}>ข้อมูลผู้ใช้</Text>
            </TouchableOpacity>
          </View>
        </Card> */}
        <View style={{ flex: 1 }}>
          <CardList
            data={arr_profile(dataObject)}
            footerbutton={
              <View style={{ paddingHorizontal: 10 }}>
                {isemployee == false ? null : (
                  <>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        backgroundColor: "#14478b",
                        height: 35,
                      }}
                      onPress={() => {
                        props.navigation.navigate("changepassword", {
                          username: dataObject.username,
                          isFlag: 1,
                        });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color="#FFF"
                      />
                      <Text
                        style={[
                          textStyle.text_normal_bold_color_blue,
                          { color: "#FFFFFF", fontSize: 16 },
                        ]}
                      >
                        {" เปลี่ยนรหัสผ่าน"}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ padding: 5 }} />
                  </>
                )}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    backgroundColor: "#dc3545",
                    height: 35,
                  }}
                  onPress={() => {
                    onClickLogout();
                  }}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color="#FFF"
                  />
                  <Text
                    style={[
                      textStyle.text_normal_bold_color_blue,
                      { color: "#FFFFFF", fontSize: 16 },
                    ]}
                  >
                    {" ออกจากระบบ"}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
