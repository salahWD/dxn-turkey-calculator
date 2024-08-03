import { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { productPrice } from '../util/productPrice';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

export type ProductProps = {
  item: {id: number, title: string, img: String, price: number, points: number},
  calcFooter: Function,
  selectedCount?: number,
  disabled?: boolean,
};

export function Product({ item, calcFooter, selectedCount=0, disabled=false }: ProductProps) {

  const [count, setCount] = useState(selectedCount);
  const [isChecked, setIsChecked] = useState(count > 0);
  
  const handleChangedText = (text) => {
    const val = parseInt(text.replace(/[^0-9]/g, ''));
    setCount(val);
    setIsChecked(val > 0);
    calcFooter({ item: item, count: val });
  }

  const handleChange = () => {
    if (!isChecked) {
      setCount(1);
      calcFooter({ item: item, count: 1});
    }else {
      setCount(0);
      calcFooter({ item: item, count: 0 });
    }
    setIsChecked(!isChecked)
  }

  return (
    <View style={styles.product}>
      <View style={{ ...styles.cell, borderLeftWidth: 0 }}>
        {!disabled && <Pressable onPress={handleChange}>
          {isChecked && <AntDesign style={styles.checkbox} name="checksquare" size={20} color="black" />}
          {!isChecked && <Feather style={styles.checkbox} name="square" size={20} color="black" />}
        </Pressable>}
        {disabled && <AntDesign style={{ ...styles.checkbox, color: "gray"}} name="checksquare" size={20} color="black" />}
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
          {!disabled && <TextInput 
            style={{ ...styles.dropdownButtonStyle, width: "100%"}}
            inputMode='numeric'
            onChangeText={(text) => handleChangedText(text)}
            value={String(count)}
          />}
          {disabled && <TextInput 
            readOnly={true}
            style={{ ...styles.dropdownButtonStyle, width: "100%"}}
            inputMode='numeric'
            onChangeText={(text) => handleChangedText(text)}
            value={String(count)}
          />}
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
    height: "auto",
    backgroundColor: '#E9ECEF',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
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
    justifyContent: 'center',
    fontSize: 13,
    borderLeftWidth: 1,
    borderColor: "#333",
    fontFamily: "zain-bold",
    height: "auto",
  },
  text: {
    paddingHorizontal: 6,
  },
  checkbox: {
    marginHorizontal: "auto",
    width: 20,
    height: 20,
  }
});
