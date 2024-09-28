import React, { useState } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import ProductsScreen from "./screens/ProductsScreen";
import { LangContext } from "./langContext.ts";

import { I18nManager } from "react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [lang, setLang] = useState("ar");

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
