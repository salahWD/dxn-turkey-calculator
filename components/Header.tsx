import { Text, View, StyleSheet } from 'react-native';
import { globalStyles } from "../constants/global";

export type HeaderProps = {
  title: string,
};

export function Header() {

  return (
    <View style={styles.header}>
      <Text style={{...styles.row, borderLeftWidth: 0 }}>تحديد</Text>
      <Text style={{...styles.row, flex: 4,}}>المنتجات</Text>
      <Text style={{...styles.row }}>النقاط</Text>
      <Text style={{...styles.row }}>السعر</Text>
      <Text style={{...styles.row, flex: 1.5,}}>العدد</Text>
      <Text style={{...styles.row }}>إجمالي النقاط</Text>
      <Text style={{...styles.row }}>إجمالي السعر</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    flexDirection: "row",
    backgroundColor: 'skyblue',
    gap: 8,
  },
  row: {
    height: "100%",
    textAlignVertical: 'center',
    flex: 1,
    fontSize: 15,
    borderLeftWidth: 1,
    borderColor: "#333",
    fontFamily: "zain-bold"
  }
});
