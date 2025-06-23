import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Dimensions, Text, StyleSheet, SafeAreaView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import WorkRepairDetailScreen from "./WorkRepairDetailScreen";
import WorkCarryRepairScreen from "./WorkCarryRepairScreen";
import WorkSurveyScreen from "./WorkSurveyScreen";
import BottomTab from "../../components/bottom/BottomTab";
import { timeNow, dateNowTh } from "../../utils/Date";
import * as workCarryRepairAction from "../../actions/jobsurvey/WorkCarryRepairAction";
import * as WorkRepairDetailAction from "../../actions/workrepair/WorkRepairDetailAction";
import { useRoute, useFocusEffect } from "@react-navigation/native";

export default function MainTabScreen({ props, navigation }) {
  const route = useRoute();
  const dispatch = useDispatch();
  const [jobCode, setJobCode] = React.useState("");
  const workCarrayRepairReducer = useSelector(
    (state) => state.workCarrayRepairReducer
  );
  const workRepairDetailReducer = useSelector(
    (state) => state.workRepairDetailReducer
  );

  const initialLayout = { width: Dimensions.get("window").width };
  const [index, setIndex] = React.useState(0);

  const init = () => {
    let brokenAppearanceText = "";
    if (workRepairDetailReducer.dataArray.process != null) {
      brokenAppearanceText =
        workRepairDetailReducer.dataArray.process.brokenAppearance;
    }
    dispatch(workCarryRepairAction.loadPiker(brokenAppearanceText));
    reMemViewWorkCarryRepair();
    return () => {};
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (workRepairDetailReducer.dataArray?.rwId) {
      setIndex(0);
      // ✅ บังคับให้ Tab ซ่อมโหลดใหม่
      setJobCode(workRepairDetailReducer.dataArray.rwId); // ถ้าคุณใช้ state นี้เป็น props
    }
  }, [workRepairDetailReducer.dataArray]);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (route.params?.job_code) {
  //       setJobCode(route.params.job_code);
  //       navigation.setOptions({
  //         title: route.params.job_code,
  //         headerTitleAlign: "center",
  //         headerTitleStyle: {
  //           fontFamily: "Prompt-Bold",
  //           fontSize: 18,
  //           color: "#2c689e",
  //         },
  //       });
  //     }
  //   }, [route.params?.job_code])
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     setIndex(0);
  //     if (route.params?.job_code) {
  //       setJobCode(route.params.job_code);
  //       navigation.setOptions({
  //         title: route.params.job_code,
  //         headerTitleAlign: "center",
  //         headerTitleStyle: {
  //           fontFamily: "Prompt-Bold",
  //           fontSize: 18,
  //           color: "#2c689e",
  //         },
  //       });

  //       reMemViewWorkCarryRepair(); // ✅ เพิ่มตรงนี้
  //     }
  //   }, [route.params?.job_code])
  // );

  const reMemViewWorkCarryRepair = () => {
    if (workRepairDetailReducer.dataArray.process != null) {
      if (workRepairDetailReducer.dataArray.survey.pipe_id == "") {
        if (workRepairDetailReducer.dataArray.process.isNotGIS != null) {
          dispatch(WorkRepairDetailAction.setStateRadioPipe("2"));
        }
      } else {
        dispatch(WorkRepairDetailAction.setStateRadioPipe("1"));
      }
    } else {
      dispatch(WorkRepairDetailAction.setStateRadioPipe("0"));
    }
    const obj = {
      sts: "1",
      dateForm: dateNowTh(),
      dateTo: dateNowTh(),
      dateTextTure: dateNowTh(),
      timeFrom: timeNow(),
      timeTo: timeNow(),
      timeTextTrue: timeNow(),
    };
    dispatch(workCarryRepairAction.rememViewWorkCarryRepair(obj));
  };

  const [routes] = React.useState([
    { key: "workrepairdetail", title: "รายละเอียดงาน" },
    { key: "worksurvey", title: "จุดซ่อมเเละ\nภาพงานซ่อม" },
    { key: "workCarryRepair", title: "ดำเนินการซ่อม" },
  ]);

  const empoyees = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject.dataEmployees) {
        let obj = {
          label: `${iterator.fNameTH} ${iterator.lNameTH}`,
          value: iterator.empId,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  const getLeakwounds = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject.getLeakWounds
        .data) {
        let obj = {
          label: iterator.text,
          value: iterator.value,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  const getSerfaces = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject.getSerfaces
        .surfaces) {
        let obj = {
          label: iterator.text,
          value: iterator.value,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  const getTypeOfPipes = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject.getTypeOfPipes
        .typeOfPipes) {
        let obj = {
          label: iterator.text,
          value: iterator.value,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  const getRequestType = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject.getRequestType
        .requestTypes) {
        let obj = {
          label: iterator.text,
          value: iterator.value,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  const getRequestCategorySubject = () => {
    var arrr1 = [];
    if (workCarrayRepairReducer.dataObject != null) {
      for (const iterator of workCarrayRepairReducer.dataObject
        .getRequestCategorySubject.requestTypes) {
        let obj = {
          label: iterator.text,
          value: iterator.value,
        };
        arrr1.push(obj);
      }
    }
    return arrr1;
  };

  // const renderScene = SceneMap({
  //   workrepairdetail: () => (
  //     <WorkRepairDetailScreen
  //       {...props}
  //       navigation={navigation}
  //       data={workRepairDetailReducer.dataArray}
  //     />
  //   ),
  //   worksurvey: () => (
  //     <WorkSurveyScreen
  //       {...props}
  //       navigation={navigation}
  //       data={workRepairDetailReducer.dataArray}
  //     />
  //   ),
  //   workCarryRepair: () => (
  //     <WorkCarryRepairScreen
  //       {...props}
  //       navigation={navigation}
  //       empoyees={empoyees()}
  //       getLeakwounds={getLeakwounds()}
  //       getSerfaces={getSerfaces()}
  //       getTypeOfPipes={getTypeOfPipes()}
  //       getRequestTyp={getRequestType()}
  //       data={workRepairDetailReducer.dataArray}
  //     />
  //   ),
  // });
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "workrepairdetail":
        return (
          <WorkRepairDetailScreen
            {...props}
            navigation={navigation}
            data={workRepairDetailReducer.dataArray}
          />
        );
      case "worksurvey":
        return (
          <WorkSurveyScreen
            {...props}
            navigation={navigation}
            data={workRepairDetailReducer.dataArray}
          />
        );
      case "workCarryRepair":
        return (
          // <View>
          //   <Text>workCarryRepair</Text>
          // </View>
          <WorkCarryRepairScreen
            {...props}
            navigation={navigation}
            empoyees={empoyees()}
            getLeakwounds={getLeakwounds()}
            getSerfaces={getSerfaces()}
            getTypeOfPipes={getTypeOfPipes()}
            getRequestTyp={getRequestType()}
            data={workRepairDetailReducer.dataArray}
          />
        );
      default:
        return null;
    }
  };

  const switchTab = (idTab) => {
    setIndex(idTab);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route }) => (
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  textAlign: "center",
                }}
              >
                {route.title}
              </Text>
            )}
            indicatorStyle={{ backgroundColor: "#3a405a" }}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.container}
      />
      <SafeAreaView>
        <BottomTab tab={index} switchTab={switchTab} navigation={navigation} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  scene: {
    flex: 1,
  },
});
