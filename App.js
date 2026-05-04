import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import store from "./src/app/store/store";
import AppNavigator from "./src/app/navigations/AppNavigator";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        "Prompt-Bold": require("./assets/fonts/Prompt-Bold.ttf"),
        "Prompt-Regular": require("./assets/fonts/Prompt-Regular.ttf"),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff"
            hidden={false}
          />
          <View style={{ flex: 1 }}>
            <AppNavigator />
          </View>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
