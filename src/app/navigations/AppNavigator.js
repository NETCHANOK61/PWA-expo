import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TouchableOpacity, Platform, Dimensions } from "react-native";
import { useNavigationState } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import CheckUpdate from "../screen/checkupdate";
import LoginScreen from "../screen/LoginScreen";
import ChangePassword from "../screen/changepassword/ChangePasswordScreen";
import ReceiveRepairScreen from "../screen/receiverepair/ReceiveRepairScreen";
import DetailWorkCallScreen from "../screen/receiverepair/DetailWorkCallScreen";
import RepairJobScreen from "../screen/receiverepair/RepairJobScreen";
import WorkRepairScreen from "../screen/workrepair/WorkRepairScreen";
import ReceiveRepairSearchScreen from "../screen/repairfilter/RepairFilterScreen";
import ProfileScreen from "../screen/profile/ProfileScreen";
import WorkTakePhotoScreen from "../screen/jobsurvey/WorkTakePhotoScreen";
import camara from "../screen/camera/index";
import location from "../components/location/Location";
import savelocation from "../screen/jobsurvey/SaveLocationPointNormal/index";

import mainTabScreen from "../screen/jobsurvey/MainTabScreen";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Stack = createStackNavigator();
const RootStack = (props) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <>
        <Stack.Screen
          name="checkupdate"
          component={CheckUpdate}
          options={{ headerShown: false, headerLeft: null }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, headerLeft: null }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessTab}
          options={{
            title: "",
            headerShown: false,
            headerBackTitle: " ",
          }}
        />
        <Stack.Screen
          name="changepassword"
          component={ChangePassword}
          options={{
            title: "เปลี่ยนรหัสผ่าน",
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Prompt-Bold",
              fontSize: 0.02 * viewportHeight,
            },
            headerStyle: {
              backgroundColor: "#2c689e",
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              },
              shadowColor: "transparent",
              ...Platform.select({ android: { elevation: 0 } }),
            },
            headerLeft: null,
          }}
        />
      </>
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const Tab1 = {
  title: "รับงานซ่อม",
  tabBarLabel: "รับงานซ่อม",
  tabBarIcon: ({ color, size }) => (
    <MaterialCommunityIcons name="clipboard-list" color="#2c689e" size={size} />
  ),
};

const Tab2 = {
  title: "งานซ่อม",
  tabBarLabel: "งานซ่อม",
  tabBarIcon: ({ color, size }) => (
    <MaterialCommunityIcons name="tools" color="#2c689e" size={size} />
  ),
};

const Tab3 = {
  title: "ข้อมูลผู้ใช้งาน",
  tabBarLabel: "ข้อมูลผู้ใช้งาน",
  tabBarIcon: ({ color, size }) => (
    <MaterialCommunityIcons name="account" color="#2c689e" size={size} />
  ),
};

const StackReciveRepair = createStackNavigator();

const ReceiveRepairStackScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  return (
    <StackReciveRepair.Navigator initialRouteName="ReceiveRepairScreen">
      <StackReciveRepair.Screen
        name="ReceiveRepairScreen"
        component={ReceiveRepairScreen}
        options={{
          title: "รายการรับเรื่องซ่อม",
          headerTitleAlign: "center",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerLeft: null,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.1}
              onPress={async () => {
                navigation.navigate("ReceiveRepair", {
                  screen: "ReceiveRepairSearchScreen",
                });
                // dispatch(repairFilterAction.inncidentSearch(navigation));
              }}
              style={{ padding: 10 }}
            >
              <MaterialCommunityIcons
                name="text-search"
                color="#2c689e"
                size={20}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <StackReciveRepair.Screen
        // name="RecevieRepairScreen"
        name="DetailReceiveScreen"
        component={DetailWorkCallScreen}
        options={{
          title: "รายละเอียดงานรับเเจ้ง",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
      <StackReciveRepair.Screen
        name="RepairJobScreen"
        component={RepairJobScreen}
        options={{
          title: "รับงานซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
        }}
      />
      <StackReciveRepair.Screen
        name="ReceiveRepairScreen2"
        component={ReceiveRepairScreen}
        options={{
          title: "รายการรับเรื่องซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
        }}
      />
      <StackReciveRepair.Screen
        name="ReceiveRepairSearchScreen"
        component={ReceiveRepairSearchScreen}
        options={{
          title: "ค้นหารายการรับเรื่องซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
      <StackReciveRepair.Screen
        name="workrepairtabscreen"
        component={MyTab}
        options={{
          title: " ",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
        }}
      />
      <StackReciveRepair.Screen
        name="location"
        component={location}
        options={{
          title: "แผนที่จุดแจ้งซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
      <StackReciveRepair.Screen
        name="Savelocation"
        component={savelocation}
        options={{
          title: "ลงจุดซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
      <StackReciveRepair.Screen
        name="changepassword2"
        component={ChangePassword}
        options={{
          title: "เปลี่ยนรหัสผ่าน",
          headerTintColor: "#FFF",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerStyle: {
            backgroundColor: "#2c689e",
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
            shadowColor: "transparent",
            ...Platform.select({ android: { elevation: 0 } }),
          },
          headerLeft: null,
        }}
      />
    </StackReciveRepair.Navigator>
  );
};

const StackWorkRepair = createStackNavigator();

const WorkRepairStackScreen = ({ navigation, route }) => {
  return (
    <StackWorkRepair.Navigator initialRouteName="workrepairscreen">
      <StackWorkRepair.Screen
        name="workrepairscreen"
        component={WorkRepairScreen}
        options={{
          title: "รายการงานซ่อม",
          headerTintColor: "#2c689e",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerLeft: null,
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.1}
              onPress={async () => {
                // navigation.navigate("WorkRepairStackScreen", {
                //   screen: "ReceiveRepairSearchScreen2",
                // });
                navigation.navigate("WorkRepair", {
                  screen: "ReceiveRepairSearchScreen2",
                });
              }}
              style={{ padding: 10 }}
            >
              <MaterialCommunityIcons
                name="text-search"
                color="#2c689e"
                size={20}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <StackWorkRepair.Screen
        name="ReceiveRepairSearchScreen2"
        component={ReceiveRepairSearchScreen}
        options={{
          title: "ค้นหารายการงานซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
    </StackWorkRepair.Navigator>
  );
};

const StackProfile = createStackNavigator();

const ProfileStackScreen = ({ navigation, route }) => {
  return (
    <StackProfile.Navigator>
      <StackProfile.Screen
        name="profileScreen"
        component={ProfileScreen}
        options={{
          title: "ข้อมูลผู้ใช้งาน",
          headerTintColor: "#FFF",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerStyle: {
            backgroundColor: "#2c689e",
            shadowRadius: 0,
            shadowOffset: {
              height: 0,
            },
            shadowColor: "transparent",
            ...Platform.select({ android: { elevation: 0 } }),
          },
          headerLeft: null,
        }}
      />
    </StackProfile.Navigator>
  );
};

const SuccessTab = ({ navigation, route }) => {
  const routeName = useNavigationState((state) => {
    const currentRoute = state.routes[state.index];

    if (currentRoute.state) {
      const tabState = currentRoute.state;
      const tabRoute = tabState.routes[tabState.index];

      if (tabRoute.state) {
        const stackState = tabRoute.state;
        const stackRoute = stackState.routes[stackState.index];

        if (stackRoute.state) {
          const nestedState = stackRoute.state;
          const nestedRoute = nestedState.routes[nestedState.index];
          return nestedRoute.name; // Route ที่ลึกที่สุด
        }

        return stackRoute.name;
      }

      return tabRoute.name;
    }

    return currentRoute.name;
  });

  // console.log("Final Current Route Name:", routeName); // ตรวจสอบ route ที่ลึกที่สุด
  const shouldHideTabBar =
    routeName === "DetailReceiveScreen" ||
    routeName === "ReceiveRepairSearchScreen" ||
    routeName === "ReceiveRepairSearchScreen2" ||
    routeName === "workrepairtabscreen" ||
    routeName === "mainTabScreen" ||
    routeName === "savelocation" ||
    routeName === "WorkTakePhotoScreen" ||
    routeName === "location" ||
    routeName === "camera";
  return (
    <Tab.Navigator
      backBehavior="none"
      tabBarOptions={{
        labelStyle: { fontFamily: "Prompt-Bold" },
        style: { backgroundColor: "white" },
      }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: shouldHideTabBar ? { display: "none" } : null,
      }}
    >
      <>
        <Tab.Screen
          name="ReceiveRepair"
          component={ReceiveRepairStackScreen}
          options={Tab1}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
        
              // Reset to root of ReceiveRepair stack
              navigation.navigate("ReceiveRepair", {
                screen: "ReceiveRepairScreen",
              });
            },
          })}
        />
        <Tab.Screen
          name="WorkRepair"
          component={WorkRepairStackScreen}
          options={Tab2}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={Tab3}
        />
      </>
    </Tab.Navigator>
  );
};

const StackJobSurvey = createStackNavigator();
const MyTab = ({ navigation, route }) => {
  const routeName = useNavigationState((state) => {
    const currentRoute = state.routes[state.index];

    if (currentRoute.state) {
      const tabState = currentRoute.state;
      const tabRoute = tabState.routes[tabState.index];

      if (tabRoute.state) {
        const stackState = tabRoute.state;
        const stackRoute = stackState.routes[stackState.index];

        if (stackRoute.state) {
          const nestedState = stackRoute.state;
          const nestedRoute = nestedState.routes[nestedState.index];
          return nestedRoute.name; // Route ที่ลึกที่สุด
        }

        return stackRoute.name;
      }

      return tabRoute.name;
    }

    return currentRoute.name;
  });

  useEffect(() => {
    // Helper function to set header options
    const setHeaderOptions = (options) => {
      navigation.setOptions(options);
    };
  
    // Condition for "WorkTakePhotoScreen" and "camera" routes
    const isHiddenHeader = routeName === "WorkTakePhotoScreen" || routeName === "camera";
  
    if (isHiddenHeader) {
      setHeaderOptions({
        headerShown: false,
        headerBackTitle: " ",
      });
    } else {
      setHeaderOptions({
        title: route.params.rwcode,
        headerTitleStyle: { color: "#2c689e", fontFamily: "Prompt-Bold" },
        headerTitleAlign: "center",
        headerShown: true,
        headerBackTitle: " ",
        headerLeft: () => (
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
              if (route.params.page === "1") {
                navigation.goBack();
                navigation.jumpTo("WorkRepair", { owner: "WorkRepair" });
                // navigation.navigate("Success2");
              } else {
                // navigation.goBack();
                navigation.jumpTo("WorkRepair", { owner: "WorkRepair" });
              }
            }}
            style={{ padding: 10 }}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="#2c689e"
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [routeName]);
  
  return (
    <StackJobSurvey.Navigator
      initialRouteName="mainTabScreen"
      tabBarOptions={{
        labelStyle: { fontFamily: "Prompt-Bold" },
        style: { backgroundColor: "white" },
      }}
    >
      <StackJobSurvey.Screen
        name="mainTabScreen"
        component={mainTabScreen}
        options={{
          title: "",
          headerShown: false,
          headerBackTitle: " ",
        }}
      />
      <Stack.Screen
        name="Success2"
        component={SuccessTab}
        options={{
          title: "",
          headerShown: false,
          headerBackTitle: " ",
        }}
      />
      <StackJobSurvey.Screen
        name="WorkTakePhotoScreen"
        component={WorkTakePhotoScreen}
        options={{}}
      />
      <StackJobSurvey.Screen
        name="camera"
        component={camara}
        options={{
          title: "",
          headerShown: false,
          headerBackTitle: " ",
        }}
      />
      <StackJobSurvey.Screen
        name="location2"
        component={location}
        options={{
          title: "แผนที่จุดแจ้งซ่อม",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
          headerTitleAlign: "center",
        }}
      />
      {/* <StackReciveRepair.Screen
        name="workrepairtabscreen"
        component={MyTab}
        options={{
          title: " ",
          headerTintColor: "#2c689e",
          headerTitleStyle: {
            fontFamily: "Prompt-Bold",
            fontSize: 0.02 * viewportHeight,
          },
          headerBackTitle: " ",
        }}
      /> */}
    </StackJobSurvey.Navigator>
  );
};

export default RootStack;
