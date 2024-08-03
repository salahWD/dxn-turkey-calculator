import { Text, View, StyleSheet, Pressable } from 'react-native';
import { productPrice } from '../util/productPrice';
import AntDesign from '@expo/vector-icons/AntDesign';
import { globalStyles } from '../constants/global';

export function Footer({ info, togglePreviewMood }) {

  return (
    <View style={styles.footer}>
      <Pressable onPress={e => togglePreviewMood()}>
        <AntDesign style={globalStyles.cartBtn} name="eyeo" size={24} color="black" />
      </Pressable>
      <View style={styles.holder}>
        <Text style={{...styles.row }}>
          <Text>السعر الكلّي: </Text>
          <Text style={{ fontFamily: "zain-black" }}>{info.reduce((value, row) => value + productPrice(row.item.price) * row.count, 0)}</Text>
        </Text>
        <Text style={{...styles.row }}>
          <Text>مجموع النقاط: </Text>
          <Text style={{ fontFamily: "zain-black" }}>{info.reduce((value, row) => value + row.item.points, 0)}</Text>
        </Text>
        <Text style={{...styles.row }}>
          <Text>عدد المنتجات: </Text>
          <Text style={{ fontFamily: "zain-black" }}>{info.reduce((value, row) => value + row.count, 0)}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 4,
    flexDirection: "row",
    backgroundColor: 'skyblue',
    justifyContent: "center",
  },
  holder: {
    width: 550,
    flexDirection: "row",
    gap: 8,
  },
  row: {
    height: "100%",
    flex: 1,
    fontSize: 15,
    display: "flex",
    fontFamily: "zain-bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
