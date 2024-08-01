import React from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import ProductsScreen from "./screens/ProductsScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
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

  return <ProductsScreen />;
}
