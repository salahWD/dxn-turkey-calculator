import { StyleSheet } from "react-native";

export const serverUrl = 'http://192.168.1.33:8081';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontFamily: "zain-black",
    fontSize: 18,
    color: "#333"
  },
  paragraph: {
    fontFamily: "zain-light",
    marginVertical: 8,
    lineHeight: 20
  },
  cartBtn: {
    // width: 45,
    backgroundColor: "#3747ba",
    borderRadius: 6,
    textAlign: "center",
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 10,
  }
});