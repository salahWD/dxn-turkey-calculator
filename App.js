import React, { useState, useContext, createContext } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import ProductsScreen from "./screens/ProductsScreen";
import * as MediaLibrary from "expo-media-library";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const LangContext = createContext(null);

export default function App() {
  const [lang, setLang] = useState("ar");
  const [status, requestPermission] = MediaLibrary.usePermissions();
  useState;

  if (status === null) {
    requestPermission();
  }

  const [loaded] = useFonts({
    "zain-black": require("./assets/fonts/Zain-Black.ttf"),
    "zain-bold": require("./assets/fonts/Zain-Bold.ttf"),
    "zain-Light": require("./assets/fonts/Zain-Light.ttf"),
    "zain-regular": require("./assets/fonts/Zain-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LangContext.Provider value={[lang, setLang]}>
      <View style={{ backgroundColor: "#e9fbf1", flex: 1 }}>
        <ProductsScreen />
      </View>
    </LangContext.Provider>
  );
}
