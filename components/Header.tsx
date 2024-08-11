import { Text, View, StyleSheet } from 'react-native';
import { useContext } from 'react';

import { LangContext } from '../langContext';

export type HeaderProps = {
  title: string,
};

const langs = {
  ar: {
    selected: "تحديد",
    products: "المنتجات",
    points: "النقاط",
    price: "السعر",
    count: "العدد",
    total_price: "النقاط السعر",
  },
  tr: {
    selected: "selected",
    products: "products",
    points: "points",
    price: "price",
    count: "count",
    total_price: "total points",
  }
}

export function Header({ dollarPrice }) {

  const [language, setLanguage] = useContext(LangContext);

  return (
    <View style={styles.header}>
      <Text style={{ position: "absolute", left: 10, top: 10, opacity: .8, color: "white", fontSize: 16,  }}>{ dollarPrice }TL</Text>
      <Text style={{...styles.row, borderLeftWidth: 0, flex: 3, }}>{langs[language].products}</Text>
      <Text style={{...styles.row, }}>{langs[language].points}</Text>
      <Text style={{...styles.row, }}>{langs[language].price}</Text>
      <Text style={{...styles.row, }}>{langs[language].count}</Text>
      <Text style={{...styles.row, paddingRight: 9, }}>{langs[language].total_price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    flexDirection: "row",
    backgroundColor: '#4dd0e2',
    gap: 8,
  },
  row: {
    paddingHorizontal: 0,
    height: "100%",
    textAlignVertical: 'center',
    flex: 1,
    color: "white",
    fontSize: 15,
    borderLeftWidth: 1,
    borderColor: "#333",
    fontFamily: "zain-bold",
    textAlign: "right",
  },  
});
