import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { productPrice } from '../util/productPrice';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const productCountList = Array.from(Array(30).keys());

export type ProductProps = {
  item: {id: number, title: string, img: String, price: number, points: number},
  calcFooter: Function,
  dollarPrice?: number,
  selectedCount?: number,
  disabled?: boolean,
};

export function Product({ item, calcFooter, dollarPrice=0, selectedCount=0, disabled=false }: ProductProps) {

  const [count, setCount] = useState(selectedCount);
  
  const handleChangedText = (value) => {
    console.log(value)
    setCount(value);
    calcFooter({ id: item.id, count: value });
  }

  return (
    <View style={styles.product}>
      <View style={{ ...styles.cell, borderLeftWidth: 0, flex: 3.5 }}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      <View style={{ ...styles.cell, flex: 1 }}>
        <Text style={styles.text}>{item.points}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{productPrice(dollarPrice, item.price)}</Text>
      </View>
      <View style={ styles.cell }>
        <SelectDropdown
          defaultValue={selectedCount}
          disabled={disabled}
          data={productCountList}
          onSelect={(selectedItem, index) => {
            // console.log(selectedItem, index);
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
      <View style={{ ...styles.cell, paddingRight: 9, }}>
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
    backgroundColor: "#e1e4eb",
    borderStyle: 'solid',
    flexDirection: "row",
    borderColor: '#cfcfcf',
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
    // flex: 1,
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
