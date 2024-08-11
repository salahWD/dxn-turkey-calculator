import { useState, useContext } from 'react';
import { Text, View, StyleSheet, Pressable, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalStyles } from '../constants/global';
import { LangContext } from '../langContext';

const langs = {
  ar: {
    total_price: "السعرالكلّي",
    total_points: "مجموع النقاط",
    shipping: "سعر الشحن",
    products_count: "عدد المنتجات",
  },
  tr: {
    total_price: "total price",
    shipping: "shipping",
    total_points: "total points",
    products_count: "products count",
  }
}

export function Footer({ info: {price, shippingPrice, points, products}, togglePreviewMood }) {

  const [language, setLanguage] = useContext(LangContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLangModal = (lang) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, language == "ar" ? styles.buttonActive: {}]}
              onPress={() => handleLangModal("ar")}>
              <Text style={[styles.textStyle, language != "ar" ? styles.textStyleActive: {}]}>العربية</Text>
            </Pressable>
            <Pressable
              style={[styles.button, language == "tr" ? styles.buttonActive: {}]}
              onPress={() => handleLangModal("tr")}>
              <Text style={[styles.textStyle, language != "tr" ? styles.textStyleActive: {}]}>English</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <Pressable onPress={e => togglePreviewMood()}>
          <AntDesign style={{ ...globalStyles.cartBtn }} name="eyeo" size={24} color="black" />
        </Pressable>
        <View style={{ flexDirection: "row", flexGrow: 1, justifyContent: "space-evenly"}}>
          <View style={styles.holder}>
            <View style={{...styles.row }}>
              <Text style={ styles.key }>{langs[language].total_price}: </Text>
              <Text style={ styles.value }>{ price }</Text>
            </View>
            <View style={{...styles.row }}>
              <Text style={ styles.key }>{langs[language].shipping}: </Text>
              <Text style={ styles.value }>{ shippingPrice }</Text>
            </View>
          </View>
          <View style={ styles.holder }>
            <View style={{...styles.row }}>
              <Text style={ styles.key }>{langs[language].total_points}: </Text>
              <Text style={ styles.value }>{ points }</Text>
            </View>
            <View style={{...styles.row }}>
              <Text style={ styles.key }>{langs[language].products_count}: </Text>
              <Text style={ styles.value }>{ products }</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons style={{ ...globalStyles.cartBtn }} name="language" size={24} color="black" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 6,
    paddingTop: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    maxWidth: "100%",
    backgroundColor: '#afebf0',
    justifyContent: "space-between",
    alignItems: "center",
  },
  holder: {
    flexDirection: "column",
  },
  row: {
    alignItems: "center",
  },
  key: {
    color: "#444",
    textAlign: "right",
    fontSize: 14,
    fontFamily: "zain-bold",
    textAlignVertical: "center",
  },
  value: {
    fontSize: 16,
    textAlignVertical: "center",
    color: "#198691",
    fontFamily: "zain-black",
    textAlign: "left",
  },
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#0000003f",
  },
  modalView: {
    width: "80%",
    gap: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonActive: {
    elevation: 5,
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleActive: {
    color: '#999',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});