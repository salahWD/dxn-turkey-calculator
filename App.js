import React, { useState, useEffect } from "react";
import { View, I18nManager } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import ProductsScreen from "./screens/ProductsScreen";
import { LangContext } from "./langContext";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaProvider } from "react-native-safe-area-context";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [language, setLanguage] = useState("ar");

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

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LangContext.Provider value={{ language, setLanguage }}>
        <View style={{ backgroundColor: "#e9fbf1", flex: 1 }}>
          <ProductsScreen />
        </View>
      </LangContext.Provider>
    </SafeAreaProvider>
  );
}
