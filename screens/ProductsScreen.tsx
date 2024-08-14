import React, { useEffect, useContext, useState, useRef, MutableRefObject } from "react";
import { Alert, ScrollView, FlatList, StatusBar, StyleSheet, View, Text, Pressable, Linking } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { serverUrl, globalStyles } from "../constants/global";
import { productPrice, getDollarPrice, getProductsFromDB } from '../util/productPrice';

import { Product } from "../components/Product";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InfoBar } from "../components/InfoBar";

import { LangContext } from "../langContext";

import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function ProductsScreen() {

  const langs = {
    ar: {
      free: "مجاناً",
      essenyurt: "اسنيورت",
      taksim: "تقسيم",
      no_selected_product_title: "لا يوجد منتجات !",
      no_selected_product_desc: "لم يتم اختيار أي منتجات, يرجى اختيار بعض المنتجات قبل الإنتقال لصفحة المعلومات.",
      no_selected_product_btn: "حسناً",
    },
    tr: {
      free: "free",
      essenyurt: "Essenyurt",
      taksim: "Taksim",
      no_selected_product_title: "No products!",
      no_selected_product_desc: "No products selected, please select some products before moving to the information page.",
      no_selected_product_btn: "Ok",
    }
  }

  const imageRef: null | MutableRefObject<any> = useRef(null);

  const [language, setLanguage] = useContext(LangContext);
  const [dollarPrice, setDollarPrice] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [footerItems, setFooterItems] = useState({});
  const [footerInfo, setFooterInfo] = useState({price: 0, points: 0, shippingPrice: 110, products: 0});
  const [previewMood, setPreviewMood] = useState(true);
  const [formData, setFormData] = useState({
    phone: null,
    membership: null,
    name: null,
    address: null,
    recipient: null,
    city: null,
  });

  useEffect(() => {

    const gettingProducts = async () => {
      const res = await getProductsFromDB();
      setProducts(res);
      console.log("Done !!")
    }

    const fetchDollarPrice = async () => {
      const price = await getDollarPrice();
      setDollarPrice(price);
    };

    gettingProducts();
    fetchDollarPrice();

  }, []);

  const togglePreviewMood = () => {
    if (previewMood) {// main page
      const selectedProds = products.filter(product => Object.keys(footerItems).includes(String(product.id)));
      if (selectedProds.length > 0) {
        setSelectedProducts(selectedProds);
        setPreviewMood(false);
      }else {
        Alert.alert(langs[language].no_selected_product_title, langs[language].no_selected_product_desc, [{
          text: langs[language].no_selected_product_btn,
        }]);
      }
    }else {// cart page
      setPreviewMood(true);
    }
  }

  const createOrderMessage = () => {

    let msg = '';
    selectedProducts.forEach(product => {
      console.log(product)
      msg += `%0a المنتج: *${product.title.ar}*`;
      msg += `%0a العدد: *${footerItems[product.id]}*`;
      msg += `%0a ـ----------------------------`;
    });
    msg += `%0a *ـ=================*`;
    msg += `%0a السعر: *${footerInfo.price}*`;
    msg += `%0a الشحن: *${footerInfo.shippingPrice}*`;
    msg += `%0a النقاط: *${footerInfo.points}*`;
    msg += `%0a عدد المنتجات: *${footerInfo.products}*`;
    return msg;
  }

  const calcFooter = (order: {id: number, count: number}) => {
    
    let items = { ...footerItems };
    if (order.count > 0) {
      items[order.id] = order.count;
    }else {
      delete items[order.id];
    }
    setFooterItems(items);

    let price = 0;
    let points = 0;
    let totalProducts = 0;
    products.filter(product => Object.keys(items).includes(String(product.id))).forEach(item => {
      if (Object.hasOwn(items, item.id)) {
        price += items[item.id] * productPrice(dollarPrice, item.price);
        points += items[item.id] * item.points;
        totalProducts += items[item.id];
      }
    })

    setFooterInfo({
      price: parseFloat(price.toFixed(2)),
      points: points,
      shippingPrice: price >= 2400 ? langs[language].free : (price >= 2000 ? 15: (price >= 1600 ? 30: (price >= 1200 ? 50: (price >= 800 ? 75: 110)))),
      products: totalProducts,
    });
  }

  const saveInputs = async () => {
    try {
      await AsyncStorage.setItem('@form', JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save inputs:', e);
    }
  }

  const makeOrder = async (branch: number) => {
    const uri = await onSaveImageAsync(true);
    await MediaLibrary.saveToLibraryAsync(uri);

    // let testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC';
    
    // const shareOptions = {
    //   title: 'Share image to WhatsApp',
    //   message: 'Check out this image!',
    //   url: testImage,
    //   social: Share.Social.WHATSAPP,
    //   whatsAppNumber: '+905527188570',
    // };
  
    // try {
    //   await Share.shareSingle(shareOptions);
    // } catch (error) {
    //   console.error('Error sharing to WhatsApp', error);
    // }

    let url = '';
    
    if (branch == 1) {// taksim branch
      // url = "whatsapp://send?phone=905528666050?text=" + msg;
      url = "whatsapp://send?phone=905527188570&text=" + createOrderMessage();
    }else {// essenyurt branch
      // url = "whatsapp://send?phone=905444482988?text=" + msg;
      url = "whatsapp://send?phone=905527188570&text=" + createOrderMessage();
    }
    try {

      Linking.openURL(url).catch(() => {
        alert('Make sure WhatsApp is installed on your device');
      });

    } catch (error) {
      console.log('Error =>', error);
    }

  }

  const onSaveImageAsync = async (willReturn=false) => {
    await saveInputs();
    try {

      // const imageUri = await imageRef.current.capture();
      const imageUri = await captureRef(imageRef, {
        format: "png",
        quality: 0.9,
        // snapshotContentContainer: true,
      });
      if (willReturn) {
        return imageUri;
      }
      await Sharing.shareAsync(imageUri, { mimeType: 'image/png', dialogTitle: "loog at this" });

    } catch (e) {
      console.error("Error in onsaveimageasync function: ", e);
    }
  };


  return (
    <>
      <StatusBar hidden={true} translucent/>
      {previewMood && 
        <>
        <Header dollarPrice={dollarPrice} />
          <FlatList
            keyExtractor={(
              item: { id: number, title: string, img: String }
            ): string => String(item.id)}
            data={products}
            renderItem={({ item }) => {
              let count = 0;
              if (Object.hasOwn(footerItems, item.id)) {
                count = footerItems[item.id];
              }
              return (
              <Product calcFooter={calcFooter} dollarPrice={dollarPrice} item={item} selectedCount={count} />
            )}}
          />
          <Footer togglePreviewMood={togglePreviewMood} info={footerInfo} />
        </>
      }
      {!previewMood && 
        <ScrollView style={{ flex: 1, backgroundColor: "#defafc"}} contentContainerStyle={{ minHeight: "100%"}}>
          <ViewShot ref={imageRef} style={{ flex: 1, backgroundColor: "#defafc" }} options={{ format: "png", quality: 1 }}>
            <Header key="header" dollarPrice={dollarPrice} />
            <View style={{ flex: 1 }}>
              {selectedProducts.map(item => {
                let count = 0;
                if (Object.hasOwn(footerItems, item.id)) {
                  count = footerItems[item.id];
                }
                return (
                  <Product key={item.id} disabled={true} dollarPrice={dollarPrice} calcFooter={calcFooter} item={item} selectedCount={count} />
                )
              })}
            </View>
            <InfoBar info={footerInfo} formInfo={[formData, setFormData]} />
          </ViewShot>
        <View style={styles.actionsBox}>
          <Pressable onPress={togglePreviewMood}>
            {/* <AntDesign  name="eyeo" size={24} color="black" /> */}
            <Entypo style={globalStyles.cartBtn} name="back" size={24} color="black" />
          </Pressable>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable onPress={() => {makeOrder(1)}}>
              <View style={styles.orderBtn}>
                <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                <Text style={styles.orderBtnText}>{langs[language].taksim}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => {makeOrder(2)}}>
              <View style={styles.orderBtn}>
                <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                <Text style={styles.orderBtnText}>{langs[language].essenyurt}</Text>
              </View>
            </Pressable>
          </View>
          <Pressable onPress={() => {onSaveImageAsync()}}>
            <AntDesign style={{ ...globalStyles.cartBtn, backgroundColor: "#289e16", color: "#dcfadc"}} name="camerao" size={24} color="black" />
          </Pressable>
        </View>
      </ScrollView>
      }
    </>
  );

}

const styles = StyleSheet.create({
  actionsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#afebf0',
    alignItems: "center",
    paddingBottom: 4,
    paddingHorizontal: 22,
  },
  orderBtn: {
    backgroundColor: "#3dcc5a",
    color: "white",
    borderRadius: 8,
    flexDirection: "row",
    minWidth: 90,
    textAlign: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  orderBtnText: {
    fontSize: 12,
    color: "white",
  },
})