import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Box, NativeBaseProvider } from "native-base";
import { BottomSheet, ListItem } from "react-native-elements";
import textsty from "../../styles/TextStyle";
import styles from "../../styles/WorkRepairStyle";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as workRepairAction from "../../actions/workrepair/WorkRepairAction";
import * as workRepairDetailAction from "../../actions/workrepair/WorkRepairDetailAction";
import * as workCarryRepairAction from "../../actions/jobsurvey/WorkCarryRepairAction";
import * as SaveLocationPointNormalAction from "../../actions/jobsurvey/SaveLocationPointNormalAction";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export default function WorkRepairScreen(props) {
  const workRepairReducer = useSelector((state) => state.workRepairReducer);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [rwId, setRwId] = useState("");
  const [visibleLoading, setVisibleLoading] = useState(false);
  const [reLoadingData, setReLoadingData] = useState(false);
  const [isLoadding, setIsLoadding] = useState(false);
  const [isCheckData, setIsCheckData] = useState(false);

  const setStateToLogin = (payload) => ({
    type: ACTION_LOGIN,
    payload,
  });

  const init = async (navigation) => {
    setIsCheckData(true);
    await dispatch(workCarryRepairAction.loadPiker());
    await dispatch(workRepairAction.loadDataWitchPost(props));

    if (workRepairReducer.dataArray.length == 0) {
      setIsLoadding(true);
    } else {
      setIsLoadding(false);
    }
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(
        SaveLocationPointNormalAction.setStateSaveLocationPointNormalFailed()
      );
    });
    setIsCheckData(false);
    return () => {
      unsubscribe;
    };
  };

  useEffect(() => {
    init(props.navigation);
  }, [props.navigation]);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const list = [
    {
      id: "1",
      title: "ดูรายละเอียด",
      onPress: () => {
        btnsheetaction("detail");
      },
      titleStyle: { fontFamily: "Prompt-Regular" },
    },
    {
      id: "2",
      title: "สำรวจพื้นที่ เเละ ประเมินผลกระทบ",
      onPress: () => {
        btnsheetaction("carry");
      },
      titleStyle: { fontFamily: "Prompt-Regular" },
    },
    {
      id: "3",
      title: "ดำเนินการซ่อมภาคสนาม",
      onPress: () => {
        btnsheetaction("survey");
      },
      titleStyle: { fontFamily: "Prompt-Regular" },
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red", alignItems: "center" },
      titleStyle: { color: "white", fontFamily: "Prompt-Regular" },
      onPress: () => setIsVisible(false),
    },
  ];
  const btnsheetaction = (rw) => {
    dispatch(
      workRepairDetailAction.loadGetRepairWorkById(rw, props, setVisibleLoading)
    );

    setVisibleLoading(true);
    setIsVisible(false);
  };

  const renderRow = ({ item, index }) => {
    let render = [];
    let titleJobTime = "-";
    let strenddate = "-";
    let strEndSLADate = "";
    if (item.endSLADate) {
      let sumItemstring = item.endSLADate;
      titleJobTime = sumItemstring.substring(
        0,
        sumItemstring.lastIndexOf("ต้องตอบกลับภายใน")
      );
      strEndSLADate = sumItemstring.substring(0, 10);
      let myEndDateSubString = sumItemstring.substring(
        sumItemstring.indexOf("ต้องตอบกลับภายใน"),
        sumItemstring.length
      );
      strenddate = myEndDateSubString.replace("ต้องตอบกลับภายใน:", "");
    }
    //console.log(strEndSLADate);
    render.push(
      <TouchableOpacity
        key={index}
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: index % 2 == 0 ? "#FFF" : "#F0F6FF",
        }}
        onPress={() => {
          setRwId(item.rwId);
          btnsheetaction(item.rwId);
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, alignSelf: "stretch", marginTop: 5 }}>
                <Text style={textsty.text_sm_bold_color_blue}>
                  {/* {item.workingDate.split(' ')[0]} */}
                  {strEndSLADate}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 5,
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"เลขที่รับแจ้ง:"}</Text>
              </View>
              <View
                style={[
                  styles.lableContent,
                  { justifyContent: "center", borderRadius: 3 },
                ]}
              >
                <Text
                  style={[textsty.text_12, { color: "#dc3545", fontSize: 13 }]}
                >
                  {titleJobTime}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={[
                    textsty.text_normal_bold_color_blue,
                    { fontSize: 13, textAlign: "center" },
                  ]}
                >
                  {item.statusDesc}
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
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"ต้องตอบกลับภายใน:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text
                  style={[textsty.text_12, { color: "#dc3545", fontSize: 13 }]}
                >
                  {strenddate}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"เลขงานซ่อม:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>{item.rwCode}</Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"วันที่รับงานซ่อม:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>{item.workingDate}</Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            {item.superAccountName == " ( )" ? null : (
              <View
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  flexDirection: "row",
                }}
              >
                <View style={styles.lableTitle}>
                  <Text style={textsty.text_bold_12}>{"ผู้ควบคุมงาน:"}</Text>
                </View>
                <View style={styles.lableContent}>
                  <Text style={textsty.text_12}>{item.superAccountName}</Text>
                </View>
                <View
                  style={{
                    flex: 0.9,
                    alignSelf: "stretch",
                    alignItems: "flex-end",
                  }}
                ></View>
              </View>
            )}
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"ผู้เเจ้ง:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>{item.informerName}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"เบอร์โทร:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>{item.informerTelephone}</Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"ประเภทการซ่อม:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>{item.requestTypeName}</Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                flexDirection: "row",
              }}
            >
              <View style={styles.lableTitle}>
                <Text style={textsty.text_bold_12}>{"บริเวณที่เกิดเหตุ:"}</Text>
              </View>
              <View style={styles.lableContent}>
                <Text style={textsty.text_12}>
                  {item.location == "" ? "-" : item.location}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.9,
                  alignSelf: "stretch",
                  alignItems: "flex-end",
                }}
              ></View>
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
      </TouchableOpacity>
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
  //     }}>
  //     <Text style={[textsty.text_xl_bold_color_blue, { opacity: 0.3 }]}>
  //       ไม่พบข้อมูล
  //     </Text>
  //     <MaterialCommunityIcons
  //       name="delete-empty-outline"
  //       size={0.15 * viewportHeight}
  //       color="rgba(44,104,158,0.2);"
  //     />
  //   </View>
  // );

  const refresh = () => {
    dispatch(workRepairAction.loadDataWitchPost(props));
    if (workRepairReducer.dataArray.length == 0) {
      setIsLoadding(true);
    } else {
      setIsLoadding(false);
    }
  };

  const onreloaddata = () => {
    setReLoadingData(true);
    setTimeout(() => {
      dispatch(workRepairAction.loadDataWitchPost(props));
      setReLoadingData(false);
    }, 1500);
  };

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {/* <Text>WorkRepairScreen</Text> */}
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
            {"จำนวนทั้งหมด " + workRepairReducer.dataArray.length + " รายการ"}
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
        {workRepairReducer.dataArray.length == 0 &&
        isLoadding == true &&
        isCheckData == false ? (
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
            refreshing={workRepairReducer.isFetching}
            onRefresh={refresh}
            data={workRepairReducer.dataArray}
            renderItem={renderRow}
            keyExtractor={(item, index) => item.rwCode || index.toString()}
            pagingEnabled={false}
            showsVerticalScrollIndicator={false}
            onEndThreshold={50}
            removeClippedSubviews={false}
            initialNumToRender={10}
            windowSize={10}
          />
        )}
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}
            >
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        <LoadingSpinner
          width={0.75 * viewportWidth}
          height={0.18 * viewportHeight}
          visible={visibleLoading}
          textContent="กำลังโหลด"
          animation={"fade"}
          color={"#0000ff"}
        />
      </View>
    </NativeBaseProvider>
  );
}
