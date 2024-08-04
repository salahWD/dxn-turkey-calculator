import { useState, useContext } from 'react';
import { Text, View, StyleSheet, Pressable, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalStyles } from '../constants/global';
import { LangContext } from '../App';

export function Footer({ info: {price, points, products}, togglePreviewMood }) {

  const [language, setLanguage] = useContext(LangContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLangModal = (lang) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <Modal
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
              <Text style={[styles.textStyle, language != "tr" ? styles.textStyleActive: {}]}>Turkish</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <Pressable onPress={e => togglePreviewMood()}>
          <AntDesign style={{ ...globalStyles.cartBtn }} name="eyeo" size={24} color="black" />
        </Pressable>
        <View style={styles.holder}>
          <Text style={{...styles.row }}>
            <Text>السعر الكلّي: </Text>
            <Text style={{ color: "black", fontFamily: "zain-black" }}>{ price }</Text>
          </Text>
          <Text style={{...styles.row }}>
            <Text>مجموع النقاط: </Text>
            <Text style={{ color: "black", fontFamily: "zain-black" }}>{ points }</Text>
          </Text>
          <Text style={{...styles.row }}>
            <Text>عدد المنتجات: </Text>
            <Text style={{ color: "black", fontFamily: "zain-black" }}>{ products }</Text>
          </Text>
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
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    width: "100%",
    backgroundColor: 'skyblue',
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  holder: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  row: {
    height: "100%",
    color: "#444",
    flex: 1,
    fontSize: 20,
    display: "flex",
    fontFamily: "zain-bold",
    textAlign: "center",
    textAlignVertical: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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