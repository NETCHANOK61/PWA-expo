// ReceiveRepairScreen.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Box, NativeBaseProvider } from "native-base";
import { ACTION_LOGIN } from "../../Constants";
import { getProfile } from "../../utils/Storage";
import textsty from "../../styles/TextStyle";
import receiveRepairStyle from "../../styles/ReceiveRepairStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";

import * as jsonActions from "../../actions/receiverepair/ReceiveRepairFeedJsonAction";
import * as receiveRepairDetailAction from "../../actions/receiverepair/ReceiveRepairDetailAction";

export default function ReceiveRepairScreen(props) {
  const dispatch = useDispatch();
  const receiveRepairReducer = useSelector((state) => {
    return state.receiveRepairReducer;
  });
  const reduxSearchParams = useSelector(
    (state) => state.repairFilterReducer.searchParams
  );

  const dataArray = receiveRepairReducer?.dataArray || [];
  const [isLoadding, setIsLoadding] = useState(false);
  const [isCheckData, setIsCheckData] = useState(false);
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  //const [isRefreshing, setIsRefreshing] = useState(true);
  // const [searchParams, setSearchParams] = useState(null);
  const { width: viewportWidth, height: viewportHeight } =
    Dimensions.get("window");

  const setStateToLogin = (payload) => ({
    type: ACTION_LOGIN,
    payload,
  });

  // ฟังก์ชันช่วยสร้าง default searchParams (ย้อนหลัง 3 วันถึงวันนี้)
  const createDefaultSearchParams = () => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 3);

    // แปลงเป็น string ตามรูปแบบ yyyy-MM-dd หรือรูปแบบที่ backend ต้องการ
    const formatDate = (date) => date.toISOString().split("T")[0]; // "2025-06-05"

    return {
      FromDate: formatDate(fromDate),
      ToDate: formatDate(today),
    };
  };

  const init = async () => {
    const profileUserData = await getProfile();
    dispatch(setStateToLogin(profileUserData));

    if (reduxSearchParams?.FromDate && reduxSearchParams?.ToDate) {
      await dispatch(jsonActions.loadDataWitchPost(reduxSearchParams, props));
    } else {
      // หาก redux ยังไม่มี filter เลย (เข้าใหม่ครั้งแรก)
      const defaultParams = createDefaultSearchParams();
      await dispatch(jsonActions.loadDataWitchPost(defaultParams, props));

      // ✨ เซ็ตค่า default ลง redux ด้วย ถ้ามี reducer รองรับ
      // dispatch(setSearchParams(defaultParams));
    }

    setIsCheckData(true);
    setIsLoadding(dataArray.length === 0);
    setIsCheckData(false);
  };

  useEffect(() => {
    // const unsubscribe = props.navigation.addListener("focus", () => {
    //   init(); // โหลดใหม่ทุกครั้งที่ user กลับมาหน้านี้
    // });

    // return unsubscribe;
    init();
  }, [reduxSearchParams]); // 💥 สำคัญ! ต้องใส่ reduxSearchParams

  const title = {
    no: "เลขที่รับเเจ้ง : ",
    enddate: "ต้องตอบกลับภายใน :",
    name: "ชื่อผู้เเจ้ง : ",
    tel: "เบอร์โทร : ",
    head: "หัวข้อ : ",
    place: "บริเวณที่เกิดเหตุ : ",
  };

  const clickList = async (key) => {
    setisLoading(true);
    await dispatch(
      receiveRepairDetailAction.setReceiveRepairDetail(key, props)
    );
    setisLoading(false);
  };

  const renderRow = ({ index, item }) => {
    let render = [];
    let titleJobTime = "-";
    let strenddate = "-";
    if (item.receivedCaseDateText) {
      let sumItemstring = item.receivedCaseDateText + " " + item.pwaIncidentNo;
      titleJobTime = sumItemstring.substring(
        0,
        sumItemstring.lastIndexOf("ต้องตอบกลับภายใน")
      );
      let myEndDateSubString = sumItemstring.substring(
        sumItemstring.indexOf("ต้องตอบกลับภายใน"),
        sumItemstring.length
      );
      strenddate = myEndDateSubString.replace("ต้องตอบกลับภายใน:", "");
    }
    render.push(
      <View
        key={index}
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: index % 2 == 0 ? "#FFF" : "#F0F6FF",
        }}
      >
        <TouchableOpacity
          key={index}
          style={{ flex: 1, flexDirection: "row", padding: 5 }}
          onPress={() => {
            clickList(item.pwaIncidentID);
          }}
        >
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
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.no}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text
                  style={[textsty.text_12, { color: "#dc3545", fontSize: 13 }]}
                >
                  {titleJobTime}
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
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.enddate}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text
                  style={[textsty.text_12, { color: "#dc3545", fontSize: 13 }]}
                >
                  {strenddate}
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
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.name}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text style={textsty.text_12}>{item.customerName}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.tel}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text style={textsty.text_12}>{item.telephone}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.head}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text style={textsty.text_12}>
                  {item.requestCategorySubject}
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
              <View style={receiveRepairStyle.lsitInfo}>
                <Text style={textsty.text_bold_12}>{title.place}</Text>
              </View>
              <View style={{ flex: 2, alignSelf: "stretch" }}>
                <Text style={textsty.text_12}>{item.pwsIncidentAddress}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 5, flex: 0.6, paddingRight: 2 }}>
            <Text style={textsty.text_sm_center_color}>{item.statusText}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ height: 10 }}></View>
        <View style={{ borderBottomColor: "#aeaeae", borderBottomWidth: 1 }} />
      </View>
    );
    return render;
  };

  // const emptyData = () => (
  //   <View
  //     style={{
  //       flex: 1,
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       marginTop: 10
  //     }}>
  //     <Text style={[textsty.text_xl_bold_color_blue, { opacity: 0.3 }]}>{'ไม่พบข้อมูล'}</Text>
  //     <MaterialCommunityIcons
  //       name="delete-empty-outline"
  //       size={0.15 * viewportHeight}
  //       color="rgba(44,104,158,0.2);"
  //     />
  //   </View>
  // );

  // ฟังก์ชัน refresh ก็ดึงจาก local searchParams เสมอ
  const refresh = () => {
    dispatch(jsonActions.loadDataWitchPost(reduxSearchParams, props));
    setIsLoadding(dataArray.length === 0);
  };

  const onreloaddata = () => {
    setVisibleLoading(true);
    setTimeout(() => {
      const usedParams =
        reduxSearchParams && reduxSearchParams.FromDate
          ? reduxSearchParams
          : createDefaultSearchParams();
      dispatch(jsonActions.loadDataWitchPost(usedParams, props));
      setVisibleLoading(false);
    }, 1500);
  };

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Box
          h={45}
          bg={"#000000"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text
            style={[
              textsty.text_xl_bold_color_blue,
              { color: "#ffffff", fontSize: 0.016 * viewportHeight },
            ]}
          >
            {"จำนวนทั้งหมด " + dataArray.length + " รายการ"}
          </Text>
        </Box>
        {visibleLoading == true ? (
          <Box
            alignSelf={"center"}
            mt={0.08 * viewportHeight}
            position={"absolute"}
          >
            <ActivityIndicator size={"large"} />
          </Box>
        ) : null}
        {dataArray.length == 0 && isLoadding == true && isCheckData == false ? (
          <Box flex={1} justifyContent={"center"} alignItems={"center"}>
            <Text style={[textsty.text_xl_bold_color_blue, { opacity: 0.3 }]}>
              {"ไม่พบข้อมูล"}
            </Text>
            <MaterialCommunityIcons
              name="delete-empty-outline"
              size={0.13 * viewportHeight}
              color="rgba(44,104,158,0.2);"
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1c314c",
                paddingHorizontal: 5,
                borderRadius: 5,
                opacity: 0.9,
              }}
              onPress={onreloaddata}
            >
              <MaterialCommunityIcons
                name="reload"
                size={0.03 * viewportHeight}
                color="#ffffff"
              />
              <Text
                style={[
                  textsty.text_xl_bold_color_blue,
                  { color: "#ffffff", fontSize: 0.018 * viewportHeight },
                ]}
              >
                {" รีโหลดข้อมูล"}
              </Text>
            </TouchableOpacity>
          </Box>
        ) : (
          <FlatList
            refreshing={receiveRepairReducer?.isFetching}
            extraData={props}
            onRefresh={refresh}
            data={dataArray}
            renderItem={renderRow}
            keyExtractor={(item) => item.pwaIncidentNo}
            pagingEnabled={false}
            showsVerticalScrollIndicator={false}
            onEndThreshold={50}
            removeClippedSubviews={false}
            initialNumToRender={10}
            windowSize={10}
          />
        )}
        <LoadingSpinner
          width={0.75 * viewportWidth}
          height={0.18 * viewportHeight}
          visible={isLoading}
          textContent="กำลังโหลด"
          animation={"fade"}
          color={"#0000ff"}
        />
      </View>
    </NativeBaseProvider>
  );
}
