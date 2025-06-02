// LoginScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Keyboard,
  ImageBackground,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import Constants from "expo-constants";
import * as LoginAction from "../actions/LoginAction";
import { useSelector, useDispatch } from "react-redux";
import { getRememberLogin, getCheckEmployee } from "../utils/Storage";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
import { CheckBox } from "react-native-elements";
import Style from "../styles/LoginStyle";
import btnsty from "../styles/ButtonStyle";
import inputsty from "../styles/InputStyle";
import textsty from "../styles/TextStyle";
import loginsty from "../styles/LoginStyle";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";
import Awesome from "../components/awesomealert/Awesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function LoginScreen(props) {
  const appVersion = Constants?.expoConfig?.version || "10.0.42";
  const dispatch = useDispatch();
  const ref_inputPassword = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, toggleChecked] = useState(false);
  const [togleCheckEmployee, setTogleCheckEmployee] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [visibleAlert, setVisibleAlert] = useState(false);

  const [loginValueError, setLoginValueError] = useState("");
  const [visibleCheckUserAlert, setVisiblevisibleCheckUserAlert] =
    useState(false);
  const [visibleTextAlert, setVisibleTextAlert] = useState("");

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

  // const init = async () => {
  //   const remem = await getRememberLogin().then((data) => {
  //     return data;
  //   });

  //   const checkEmployee = await getCheckEmployee().then((data) => {
  //     return data;
  //   });

  //   if (remem != null) {
  //     setUsername(remem.username);
  //     setPassword(remem.password);
  //     setTogleCheckEmployee(checkEmployee == "1" ? true : false);
  //     toggleChecked(true);
  //   } else {
  //     toggleChecked(false);
  //   }
  // };
  const init = async () => {
    const remem = await getRememberLogin();
    const checkEmployee = await getCheckEmployee();

    if (remem != null) {
      // console.log("📥 REMEM Loaded into State:", remem.username, remem.password);
      setUsername(remem.username);
      setPassword(remem.password);
      setTogleCheckEmployee(checkEmployee == "1");
      toggleChecked(true);
    } else {
      toggleChecked(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

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
    switch (key) {
      case "ALERT_LOGIN_FAILED":
        setStateAlert(
          4,
          true,
          false,
          "ชื่อผู้ใช้ หรือ \nรหัสผ่านไม่ถูกต้อง",
          "ตกลง",
          "",
          () => {
            setVisibleAlert(false);
          },
          () => {
            setVisibleAlert(false);
          }
        );
        setVisibleAlert(true);
        break;
      case "EXPIRE_PASSWORD":
        setLoginValueError("1");
        setVisibleTextAlert("รหัสผ่านของท่านหมดอายุ\nกรุณาเปลี่ยนรหัสผ่านใหม่");
        setVisiblevisibleCheckUserAlert(true);
        break;
      case "USER_NOT_ACTIVE":
        setLoginValueError("2");
        setVisiblevisibleCheckUserAlert(true);
        setVisibleTextAlert("ถูกระงับการใช้งาน กรุณาติดต่อ หน.สาขา");
        break;
      case "ALERT_LOGIN_FAILED2":
        setLoginValueError("4");
        setVisiblevisibleCheckUserAlert(true);
        setVisibleTextAlert("ไม่สามารถเข้าใช้งานได้ กรุณาติดต่อ หน.สาขา");
        break;
      default:
        break;
    }
  };

  const hideLoading = () => {
    setVisibleLoading(false);
  };

  const loginFailed = (errorText) => {
    setVisibleLoading(false);
    setTimeout(() => {
      settingAlert(errorText);
    }, 500);
  };

  const onClickLogin = async () => {
    // console.log("click login");
    Keyboard.dismiss();
    if (username == "" || password == "") {
      Alert.alert("", "กรุณากรอกรหัสผู้ใช้งาน หรือ รหัสผ่าน", [
        {
          text: "ตกลง",
          onPress: () => {},
        },
      ]);
    } else {
      setVisibleLoading(true);

      dispatch(
        LoginAction.login(
          username,
          password,
          props,
          checked,
          hideLoading,
          loginFailed,
          togleCheckEmployee
        )
      );
    }
  };

  const showPassword = () => {
    showPass == true ? setShowPass(false) : setShowPass(true);
  };

  const ClickCheckOkAlert = () => {
    setVisiblevisibleCheckUserAlert(false);
    if (loginValueError === "1") {
      setTimeout(() => {
        props.navigation.navigate("changepassword", {
          username: username,
          isFlag: 0,
        });
      }, 500);
    } else {
      return;
    }
  };

  return (
    <ImageBackground
      style={loginsty.bgCover}
      source={require("../assets/images/bg_main.png")}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2c689e" />
      <View
        style={{
          marginTop: 0.1 * viewportHeight,
          marginHorizontal: 20,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <SafeAreaView />
        <Text
          style={{
            fontSize: 20,
            color: "#FFF",
            fontFamily: "Prompt-Bold",
          }}
        >
          เข้าสู่ระบบ
        </Text>
      </View>
      <View style={{ height: 0.08 * viewportHeight }} />
      <View style={Style.view_img_welcome_logo}>
        <ImageBackground
          style={{
            flexDirection: "row",
            height: 0.2 * viewportHeight,
            width: 0.7 * viewportWidth,
            justifyContent: "center",
            alignItems: "center",
          }}
          resizeMode="contain"
          source={require("../assets/images/img_welcome_logo_3.png")}
        >
          <Text
            style={{
              fontSize: 0.05 * viewportWidth,
              color: "#0d56a3",
              fontFamily: "Prompt-Bold",
              top: 30,
            }}
          >
            {"PWA Field Service"}
          </Text>
        </ImageBackground>
      </View>
      <View style={loginsty.loginbg}>
        <View>
          <TextInput
            returnKeyType="next"
            returnKeyLabel={"ถัดไป"}
            onSubmitEditing={() => {
              ref_inputPassword.current.focus();
            }}
            style={[inputsty.textInput, { color: "black" }]}
            value={username}
            placeholder="ชื่อผู้ใช้"
            autoCapitalize="none"
            placeholderTextColor="#9e9e9e"
            maxLength={200}
            onChangeText={(text) => setUsername(text)}
            blurOnSubmit={false}
          />
        </View>
        <View style={loginsty.inputContainer}>
          <TextInput
            returnKeyType={"done"}
            returnKeyLabel={"ตกลง"}
            ref={ref_inputPassword}
            style={[inputsty.textInput, { color: "black" }]}
            value={password}
            placeholder="รหัสผ่าน"
            placeholderTextColor="#9e9e9e"
            onChangeText={(text) => {
              setPassword(text);
            }}
            maxLength={200}
            secureTextEntry={showPass}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={loginsty.btnEye}
            onPress={() => showPassword()}
          >
            <Ionicons
              name={showPass == true ? "eye-off" : "eye"}
              color="#a4bdc4"
              size={26}
            />
            {/* <Image
              source={require('../assets/images/eye_black.png')}
              style={loginsty.iconEye}
            /> */}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFF3",
            borderRadius: 10,
          }}
        >
          {/* <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                onClickLogin();
              }}
              style={btnsty.btn_finger}>
              <Image
                source={require('../assets/images/finger_print.png')}
                style={{
                  width: 0.12 * viewportWidth,
                  height: 0.12 * viewportWidth,
                }}
              />
            </TouchableOpacity>
          </View> */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                onClickLogin();
              }}
              style={btnsty.btn_login}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ flex: 2, alignItems: "center" }}>
                  <Text
                    style={[
                      textsty.text_bold_color_btn,
                      { fontSize: 0.04 * viewportWidth },
                    ]}
                  >
                    เข้าสู่ระบบ
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <MaterialCommunityIcons
                    name="arrow-right-thick"
                    color="#ffff"
                    size={24}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "column",
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 10,
          width: "100%",
          marginTop: 3,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => toggleChecked(!checked)}
        >
          <CheckBox
            containerStyle={{
              borderColor: "transparent",
              backgroundColor: "transparent",
              paddingRight: 0,
              paddingVertical: 0,
            }}
            disabled={true}
            checked={checked}
          />
          <Text style={textsty.text_13_forgetpass}>จดจำรหัสผ่าน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setTogleCheckEmployee(!togleCheckEmployee)}
        >
          <CheckBox
            containerStyle={{
              borderColor: "transparent",
              backgroundColor: "transparent",
              paddingRight: 0,
              paddingVertical: 0,
            }}
            disabled={true}
            checked={togleCheckEmployee}
          />
          <Text style={textsty.text_13_forgetpass}>ไม่ใช่พนักงาน กปภ.</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ alignItems: "center", flex: 8, justifyContent: "flex-end" }}
      >
        <Text style={textsty.text_bold}>
          {`Copyright © PWA Field Service (${appVersion})`}
        </Text>
        <Text style={textsty.text_bold}>
          {"Deverlop Update: 01/06/2568 09.00 AM"}
        </Text>
      </View>
      <LoadingSpinner
        width={0.55 * viewportWidth}
        height={0.18 * viewportHeight}
        visible={visibleLoading}
        textContent="กำลังโหลด"
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
      <Awesome
        visible={visibleCheckUserAlert}
        titleIcon={3}
        showConfirmButton={true}
        showCancelButton={false}
        textBody={visibleTextAlert}
        confirmText={"ตกลง"}
        onConfirmPress={ClickCheckOkAlert}
      />
    </ImageBackground>
  );
}
