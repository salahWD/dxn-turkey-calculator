import { useState, useContext, useEffect } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { productPrice } from '../util/productPrice';

import { LangContext } from "../langContext";

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const productCountList = Array.from(Array(50).keys());

export type ProductProps = {
  item: {id: number, title: string, img: String, price: number, points: number, special?: boolean},
  calcFooter: Function,
  dollarPrice?: number,
  selectedCount?: number,
  customStyle?: {},
  disabled?: boolean,
};

export function Product({ item, calcFooter, customStyle, dollarPrice=0, selectedCount=0, disabled=false }: ProductProps) {

  const [count, setCount] = useState(0);
  const [language] = useContext(LangContext);
  
  const handleChangedText = (value) => {
    setCount(value);
    calcFooter({ id: item.id, count: value });
  }

  useEffect(() => {
    setCount(selectedCount)
  }, [selectedCount]);

  return (
    <View style={{ ...styles.product, ...customStyle, backgroundColor: item?.special ? "#c7b2d9" : (count > 0 ? "#98f2a4": "#e1e4eb"), borderWidth: 0.5, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
      <View style={{ ...styles.cell, borderLeftWidth: 0, flex: 3, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
        <Text style={styles.text}>{item.title[language]}</Text>
      </View>
      <View style={{ ...styles.cell, flex: 1, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
        <Text style={styles.text}>{item.points}</Text>
      </View>
      <View style={{ ...styles.cell, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
        <Text style={styles.text}>{productPrice(dollarPrice, item.price).toFixed(1)}</Text>
      </View>
      <View style={{ ...styles.cell, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
        <SelectDropdown
          statusBarTranslucent={true}
          defaultValue={selectedCount}
          disabled={disabled}
          data={productCountList}
          onSelect={(selectedItem, index) => {
            handleChangedText(selectedItem)
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem > 0 && selectedItem) || ' '}
                </Text>
                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#E9ECEF'})}}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
      <View style={{ ...styles.cell, paddingRight: 9, borderColor: item?.special && item.special == true ? "#808080": "#cfcfcf" }}>
        <Text style={styles.text}>{item.points * count}</Text>
      </View>
      {/* <View style={styles.cell}>
        <Text style={styles.text}>{productPrice(dollarPrice, item.price) * count}</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  product: {
    justifyContent: "space-between",
    borderStyle: 'solid',
    flexDirection: "row",
    display: "flex",
    borderWidth: 1,
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    textAlign: "center",
    width: "auto",
    height: "auto",
    marginVertical: "auto",
    backgroundColor: "#c0c0c0",
    paddingVertical: 0,
    paddingHorizontal: 12,
  },
  cell: {
    paddingHorizontal: 0,
    paddingVertical: 2,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    fontSize: 13,
    borderLeftWidth: 1,
    borderColor: "#bbb",
    fontFamily: "zain-bold",
    height: "auto",
  },
  text: {
    paddingHorizontal: 4,
  },

  dropdownButtonStyle: {
    width: "100%",
    height: 22,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButtonTxtStyle: {
    width: "100%",
    textAlign: "center",
    marginHorizontal: "auto",
    fontSize: 12,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 16,
  },
  dropdownMenuStyle: {
    backgroundColor: 'white',
    // backgroundColor: 'red',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#151E26',
  },
});
