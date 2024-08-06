import { useEffect, useContext } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LangContext } from '../App';


const langs = {
  ar: {
    total_price: "السعر الكلّي",
    total_points: "مجموع النقاط",
    products_count: "عدد المنتجات",
  },
  tr: {
    total_price: "total price",
    total_points: "total points",
    products_count: "products count",
  }
}


export function InfoBar({ info: {price, points, products}, formInfo }) {

  const [language, setLanguage] = useContext(LangContext);
  const [formData, setFormData] = formInfo;
  
  useEffect(() => {
    const loadInputs = async () => {
      try {
        const form = JSON.parse(await AsyncStorage.getItem('@form'));
        if (form !== null) {
          setFormData({...formData, ...form});
        }
      } catch (e) {
        console.error('Failed to load inputs:', e);
      }
    };

    loadInputs();
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.footer}>
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <TextInput onChangeText={(e) => {setFormData({...formData, name: e})}} value={formData.name} style={styles.textInput} placeholder='اسم العضو' />
            <TextInput onChangeText={(e) => {setFormData({...formData, membership: e})}} value={formData.membership} inputMode='numeric' style={styles.textInput} placeholder='رقم العضوية' />
          </View>
          <View style={styles.inputRow}>
            <TextInput onChangeText={(e) => {setFormData({...formData, phone: e})}} value={formData.phone} inputMode='numeric' style={styles.textInput} placeholder='رقم الهاتف' />
            <TextInput onChangeText={(e) => {setFormData({...formData, city: e})}} value={formData.city} style={styles.textInput} placeholder='المدينة' />
          </View>
          <View style={styles.inputRow}>
            <TextInput onChangeText={(e) => {setFormData({...formData, recipient: e})}} value={formData.recipient} style={styles.textInput} placeholder='إسم المستلم' />
            <TextInput onChangeText={(e) => {setFormData({...formData, address: e})}} value={formData.address} style={styles.textInput} placeholder='العنوان' />
          </View>
        </View>
        <View style={styles.holder}>
          <Text style={{...styles.row }}>
            <Text>{langs[language].total_price}: </Text>
            <Text style={{ fontFamily: "zain-black" }}>{ price }</Text>
          </Text>
          <Text style={{...styles.row }}>
            <Text>{langs[language].total_points}: </Text>
            <Text style={{ fontFamily: "zain-black" }}>{ points }</Text>
          </Text>
          <Text style={{...styles.row }}>
            <Text>{langs[language].products_count}: </Text>
            <Text style={{ fontFamily: "zain-black" }}>{ products }</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#afebf0',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 16,
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
    gap: 5,
    marginBottom: 2,
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
});
