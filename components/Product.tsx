import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { productPrice } from '../util/productPrice';

import { CustomText } from './CustomText';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

import CheckBox from 'react-native-checkbox';

export type ProductProps = {
  item: {id: number, title: string, img: String, price: number, points: number},
};

export function Product({ item }: ProductProps) {

  const [count, setCount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  
  const handleChangedText = (text) => {
    const val = parseInt(text.replace(/[^0-9]/g, ''));
    setCount(val);
    setIsChecked(val > 0);
  }

  const handleChange = (checked) => {
    if (!checked) {
      setCount(1);
    }else {
      setCount(0);
    }
    setIsChecked(!checked)
  }
  const handlePlusCount = () => {
    setCount(count + 1)
    setIsChecked(true)
  }
  const handleMinusCount = () => {
    if (count >= 1) {
      setCount(count - 1)
    }
    setIsChecked(count - 1 > 0)
  }

  return (
    <View style={styles.product}>
      <View style={{ ...styles.cell, borderLeftWidth: 0 }}>
          <CheckBox
            label=""
            checked={isChecked}
            onChange={handleChange}
          />
        {/* <Pressable onPress={(e) => setIsChecked(!isChecked)}>
        </Pressable> */}
      </View>
      <View style={{ ...styles.cell, flex: 4 }}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.points}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{productPrice(item.price)}</Text>
      </View>
      <View style={{ ...styles.cell, flex: 1.5 }}>
        <View style={ styles.text }>
          {/* <Pressable onPress={handlePlusCount}>
            <Text style={styles.actionButton}>+</Text>
          </Pressable> */}
          <TextInput 
            style={{ ...styles.dropdownButtonStyle, width: "100%"}}
            inputMode='numeric'
            onChangeText={(text) => handleChangedText(text)}
            value={String(count)}
            /> 
          {/* <Pressable onPress={handleMinusCount}>
            <Text style={styles.actionButton}
            >-</Text>
          </Pressable> */}
        </View>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.points * count}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{productPrice(item.price) * count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  product: {
    justifyContent: "space-between",
    backgroundColor: "#dfdfdf",
    borderStyle: 'solid',
    flexDirection: "row",
    borderColor: '#cfcfcf',
    display: "flex",
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  dropdownButtonStyle: {
    height: 35,
    backgroundColor: '#E9ECEF',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: 50,
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
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'center',
    fontSize: 13,
    borderLeftWidth: 1,
    borderColor: "#333",
    fontFamily: "zain-bold",
  },
  text: {
    paddingHorizontal: 6,
  }
});
