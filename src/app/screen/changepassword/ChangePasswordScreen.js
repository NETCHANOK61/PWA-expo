import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeBaseProvider, Input, Divider, HStack } from "native-base";
import { CheckBox } from "react-native-elements";

import { removeStore, removeRemem } from "../../utils/Storage";
import Awesome from "../../components/awesomealert/Awesome";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import * as LoginAction from "../../actions/LoginAction";

import textStyle from "../../styles/TextStyle";
import inputsty from "../../styles/InputStyle";
const { width, height } = Dimensions.get("window");

const ChangePassword = (props) => {
  const ref_password = useRef();
  const ref_cpassword = useRef();

  const [isFlag, setIsFlag] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [showpass, setShowPass] = useState(false);

  const [visibleCPasswordInput, setVisibleCPasswordInput] = useState(false);
  const [isExPassword, setIsExPassword] = useState(false);

  const [visibleALert, setVisibleALert] = useState(false);
  const [visiblePasswordALert, setVisiblePasswordALert] = useState(false);
  const [visibleTextAlert, setVisibleTextAlert] = useState("");
  const [visibleLoading, setVisibleLoading] = useState(false);

  const [visibleSavePassword, setVisibleSavePassword] = useState(false);

  const init = () => {
    setUsername(props.route.params?.username);
    setIsFlag(props.route.params?.isFlag);
  };

  useEffect(() => {
    init();
  }, [props.route.params?.username, props.route.params?.isFlag]);

  const ClickChangePassword = async () => {
    Keyboard.dismiss();
    let resultResetPassword = await LoginAction.resetPassword(
      username,
      password
    )
      .then((rs) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
    setVisibleALert(false);
    setTimeout(() => {
      if (resultResetPassword == true) {
        setVisibleSavePassword(true);
      } else {
        visibleTextAlert(
          "ไม่สามารถทำการเปลี่ยนรหัสผ่านได้\nกรุณาติดต่อ หน.สาขา"
        );
        setVisiblePasswordALert(true);
      }
    }, 500);
  };

  const ClickOkAlertHandler = () => {
    Keyboard.dismiss();
    setVisibleSavePassword(false);
    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      removeStore();
      removeRemem();
    }, 500);
  };

  const onShouldSetResponder = () => {
    Keyboard.dismiss();
    if (password) {
      if (password.length < 6) {
        setVisibleCPasswordInput(false);
        setVisibleTextAlert("รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร");
        setVisiblePasswordALert(true);
        return;
      }
    }

    if (password && cpassword) {
      if (password !== cpassword) {
        setCPassword("");
        setVisibleCPasswordInput(false);
        setVisibleTextAlert("รหัสผ่านไม่ตรงกัน");
        setVisiblePasswordALert(true);
        return;
      } else if (cpassword.length < 6) {
        setVisibleCPasswordInput(false);
        setVisibleTextAlert("รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร");
        setVisiblePasswordALert(true);
        return;
      } else {
        setVisibleCPasswordInput(true);
      }
    }
  };

  const ClickCancel = () => {
    setPassword("");
    setCPassword("");
    setVisibleCPasswordInput(false);
    Keyboard.dismiss();
    props.navigation.goBack();
    if (isFlag == 1) {
      props.navigation.navigate("Profile");
    }
  };

  return (
    <NativeBaseProvider>
      <View
        style={styles.container}
        onStartShouldSetResponder={onShouldSetResponder}
      >
        <View style={styles.bodyContainer}>
          {isExPassword == true ? (
            <>
              <Text style={styles.textTitle}>{"รหัสผ่านหมดอายุ"}</Text>
              <Text style={styles.textSubTitle}>{"กรุณาเปลี่ยนรหัสผ่าน"}</Text>
              <Divider w={"100%"} borderColor={"grey"} mt={3} mb={3} />
            </>
          ) : null}
          <View style={styles.inputContainer}>
            <View style={{ width: "100%" }}>
              <Text style={[textStyle.text_normal_bold, { fontSize: 16 }]}>
                {"รหัสพนักงาน"}
              </Text>
              <TextInput
                ref={username} // ถ้าใช้ ref ด้วย
                returnKeyType="next"
                returnKeyLabel="ถัดไป"
                onSubmitEditing={() => {
                  ref_password.current?.focus();
                }}
                style={[inputsty.textInput, { color: "black" }]}
                value={username}
                placeholder="Enter username"
                autoCapitalize="none"
                placeholderTextColor="#9e9e9e"
                maxLength={200}
                onChangeText={setUsername}
                blurOnSubmit={false}
              />

              {/* <Input
                                returnKeyType='next'
                                returnKeyLabel={'ถัดไป'}
                                onSubmitEditing={() => { ref_password.current.focus(); }}
                                fontFamily={'Prompt-Bold'}
                                fontSize={16}
                                padding={2}
                                placeholder="Enter username"
                                isReadOnly
                                value={username}
                                onChangeText={(text) => { setUsername(text) }}
                                blurOnSubmit={false} /> */}
            </View>
            <View style={{ width: "100%", marginTop: 8 }}>
              <HStack alignItems={"center"}>
                <Text style={[textStyle.text_normal_bold, { fontSize: 16 }]}>
                  {"รหัสผ่านใหม่"}
                </Text>
                <Text
                  style={[
                    textStyle.text_normal_bold_color_blue,
                    { fontSize: 16, color: "red", fontWeight: "300" },
                  ]}
                >
                  {" (ขั้นต่ำ 6 ตัวอักษร)"}
                </Text>
              </HStack>
              <TextInput
                ref={ref_password}
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (password.length < 6) {
                    setVisibleCPasswordInput(false);
                    setVisibleTextAlert(
                      "รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร"
                    );
                    setVisiblePasswordALert(true);
                    return;
                  } else {
                    ref_cpassword.current?.focus();
                  }
                }}
                value={password}
                placeholder="Enter password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showpass}
                onChangeText={setPassword}
                style={[inputsty.textInput, { color: "black" }]}
                blurOnSubmit={false}
              />
              {/* <Input
                                returnKeyType='next'
                                returnKeyLabel={'ถัดไป'}
                                onSubmitEditing={() => {
                                    if (password.length < 6) {
                                        setVisibleCPasswordInput(false);
                                        setVisibleTextAlert('รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร');
                                        setVisiblePasswordALert(true);
                                        return;
                                    } else {
                                        ref_cpassword.current.focus();
                                    }
                                }}
                                ref={ref_password}
                                isInvalid={password ? false : true}
                                fontFamily={'Prompt-Bold'}
                                fontSize={16}
                                padding={2}
                                placeholder="Enter password"
                                value={password}
                                secureTextEntry={showpass ? false : true}
                                onChangeText={(text) => { setPassword(text) }}
                                blurOnSubmit={false} /> */}
            </View>
            <View style={{ width: "100%", marginTop: 8 }}>
              <HStack alignItems={"center"}>
                <Text style={[textStyle.text_normal_bold, { fontSize: 16 }]}>
                  {"ยืนยันรหัสผ่านใหม่"}
                </Text>
                <Text
                  style={[
                    textStyle.text_normal_bold_color_blue,
                    { fontSize: 16, color: "red", fontWeight: "300" },
                  ]}
                >
                  {" (ขั้นต่ำ 6 ตัวอักษร)"}
                </Text>
              </HStack>
              <TextInput
                ref={ref_cpassword}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (password !== cpassword) {
                    setCPassword("");
                    setVisibleCPasswordInput(false);
                    setVisibleTextAlert("รหัสผ่านไม่ตรงกัน");
                    setVisiblePasswordALert(true);
                    return;
                  } else if (cpassword.length < 6) {
                    setVisibleCPasswordInput(false);
                    setVisibleTextAlert(
                      "รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร"
                    );
                    setVisiblePasswordALert(true);
                    return;
                  } else {
                    setVisibleCPasswordInput(true);
                  }
                }}
                style={[inputsty.textInput, { color: "black" }]}
                value={cpassword}
                placeholder="Enter password"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!showpass}
                onChangeText={setCPassword}
              />

              {/* <Input
                                returnKeyType={'done'}
                                returnKeyLabel={'ตกลง'}
                                onSubmitEditing={() => {
                                    if (password !== cpassword) {
                                        setCPassword('');
                                        setVisibleCPasswordInput(false);
                                        setVisibleTextAlert('รหัสผ่านไม่ตรงกัน');
                                        setVisiblePasswordALert(true);
                                        return;
                                    } else if (cpassword.length < 6) {
                                        setVisibleCPasswordInput(false);
                                        setVisibleTextAlert('รหัสผ่านใหม่\nต้องมีความยาวขั้นต่ำ 6 ตัวอักษร');
                                        setVisiblePasswordALert(true);
                                        return;
                                    } else {
                                        setVisibleCPasswordInput(true);
                                    }
                                }}
                                ref={ref_cpassword}
                                isInvalid={cpassword ? false : true}
                                fontFamily={'Prompt-Bold'}
                                fontSize={16}
                                padding={2}
                                placeholder="Enter password"
                                value={cpassword}
                                secureTextEntry={showpass ? false : true}
                                onChangeText={(text) => { setCPassword(text) }} /> */}
            </View>
          </View>
        </View>
        <View style={{ width: "100%", marginTop: 3 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setShowPass(!showpass)}
          >
            <CheckBox
              containerStyle={{
                borderColor: "transparent",
                backgroundColor: "transparent",
                paddingRight: 0,
                paddingVertical: 0,
              }}
              disabled={true}
              checked={showpass}
            />
            <Text
              style={[
                textStyle.text_13_forgetpass,
                { color: "black", fontSize: 16 },
              ]}
            >
              {"แสดงรหัสผ่าน"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            disabled={visibleCPasswordInput ? false : true}
            style={[
              styles.buttonSave,
              {
                backgroundColor: visibleCPasswordInput ? "#14478b" : "grey",
              },
            ]}
            onPress={() => setVisibleALert(true)}
          >
            <Text
              style={[
                textStyle.text_normal_bold_color_blue,
                { color: "#FFFFFF", fontSize: 16 },
              ]}
            >
              {"ยืนยันเปลี่ยนรหัสผ่าน"}
            </Text>
          </TouchableOpacity>
          <View style={{ margin: 3 }} />
          <TouchableOpacity style={styles.buttonBack} onPress={ClickCancel}>
            <Text
              style={[
                textStyle.text_normal_bold_color_blue,
                { color: "#FFFFFF", fontSize: 16 },
              ]}
            >
              {"ยกเลิก"}
            </Text>
          </TouchableOpacity>
        </View>
        <Awesome
          visible={visibleALert}
          titleIcon={2}
          showCancelButton={true}
          showConfirmButton={true}
          textBody="ยืนยันการเปลี่ยนรหัสผ่านใหม่"
          cancelText={"ยกเลิก"}
          onCancelPress={() => {
            setVisibleALert(false);
          }}
          confirmText="ตกลง"
          onConfirmPress={() => {
            ClickChangePassword();
          }}
        />
        <Awesome
          visible={visiblePasswordALert}
          titleIcon={4}
          showCancelButton={false}
          showConfirmButton={true}
          textBody={visibleTextAlert}
          confirmText="ตกลง"
          onConfirmPress={() => {
            setVisiblePasswordALert(false);
          }}
        />
        <Awesome
          visible={visibleSavePassword}
          titleIcon={1}
          showCancelButton={false}
          showConfirmButton={true}
          textBody={"เปลี่ยนรหัสผ่านใหม่เรียบร้อย"}
          confirmText="ตกลง"
          onConfirmPress={ClickOkAlertHandler}
        />
        <LoadingSpinner
          width={0.75 * height}
          height={0.18 * width}
          visible={visibleLoading}
          textContent="กรุณารอสักครู่"
          animation={"fade"}
          color={"#0000ff"}
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              color: "#272a2f",
              fontSize: 0.014 * height,
              fontFamily: "Prompt-bold",
            }}
          >
            {"Copyright © PWA Field Service (v.1.0.36)"}
          </Text>
        </View>
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bodyContainer: {
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    width: "100%",
    alignItems: "center",
  },
  textTitle: {
    color: "red",
    fontSize: 0.03 * height,
    fontFamily: "Prompt-Bold",
    fontWeight: "400",
  },
  textSubTitle: {
    color: "grey",
    fontSize: 0.02 * height,
    fontFamily: "Prompt-Bold",
    fontWeight: "400",
  },
  buttonBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#dc3545",
    height: 35,
    width: "100%",
  },
  buttonSave: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#14478b",
    height: 35,
    width: "100%",
  },
});

export default ChangePassword;
