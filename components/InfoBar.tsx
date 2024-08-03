import { useEffect, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Pressable, Alert } from 'react-native';
import { productPrice } from '../util/productPrice';
import { globalStyles } from '../constants/global';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

export function InfoBar({ info, togglePreviewMood }) {

  const [formData, setFormData] = useState({
    phone: null,
    membership: null,
    name: null,
    address: null,
    recipient: null,
    city: null,
  });
  
  useEffect(() => {
    const loadInputs = async () => {
      try {
        const form = JSON.parse(await AsyncStorage.getItem('@form'));
        if (form !== null) {
          setFormData({...formData, ...form});
        }
        console.log("form data: ", formData)
        console.log("form: ", form)
      } catch (e) {
        console.error('Failed to load inputs:', e);
      }
    };

    loadInputs();
  }, []);

  const saveInputs = async () => {
    try {
      await AsyncStorage.setItem('@form', JSON.stringify(formData));
      Alert.alert('تم إرسال الطلب بنجاح');
    } catch (e) {
      console.error('Failed to save inputs:', e);
    }
  }

  return (
    <View style={{backgroundColor: 'skyblue'}}>
      <View style={styles.footer}>
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <TextInput onChangeText={(e) => {setFormData({...formData, name: e})}} value={formData.name} style={styles.textInput} placeholder='اسم العضو' />
            <TextInput onChangeText={(e) => {setFormData({...formData, membership: e})}} value={formData.membership} inputMode='numeric' style={styles.textInput} placeholder='رقم العضوية' />
            <TextInput onChangeText={(e) => {setFormData({...formData, phone: e})}} value={formData.phone} inputMode='numeric' style={styles.textInput} placeholder='رقم الهاتف' />
          </View>
          <View style={styles.inputRow}>
            <TextInput onChangeText={(e) => {setFormData({...formData, city: e})}} value={formData.city} style={styles.textInput} placeholder='المدينة' />
            <TextInput onChangeText={(e) => {setFormData({...formData, recipient: e})}} value={formData.recipient} style={styles.textInput} placeholder='إسم المستلم' />
            <TextInput onChangeText={(e) => {setFormData({...formData, address: e})}} value={formData.address} style={styles.textInput} placeholder='العنوان' />
          </View>
        </View>
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
      <View style={styles.actionsBar}>
        <Pressable onPress={e => togglePreviewMood()}>
          <AntDesign style={globalStyles.cartBtn} name="eyeo" size={24} color="black" />
        </Pressable>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable onPress={saveInputs}>
            <View style={styles.orderBtn}>
              <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
              <Text style={styles.orderBtnText}>الطلب من تقسيم</Text>
            </View>
          </Pressable>
          <Pressable onPress={saveInputs}>
            <View style={styles.orderBtn}>
              <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
              <Text style={styles.orderBtnText}>الطلب من اسنيورت</Text>
            </View>
          </Pressable>
        </View>
        <Pressable onPress={e => togglePreviewMood()}>
          <AntDesign style={{ ...globalStyles.cartBtn, backgroundColor: "#289e16", color: "#dcfadc"}} name="camerao" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 16,
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
    paddingHorizontal: 22,
  },
  holder: {
    gap: 4,
  },
  row: {
    fontSize: 15,
    fontFamily: "zain-bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 5,
    height: "auto",
    backgroundColor: '#fafafa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 12,
    width: 50,
  },
  orderBtn: {
    backgroundColor: "#3dcc5a",
    color: "white",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  orderBtnText: {
    color: "white",
  },
});
