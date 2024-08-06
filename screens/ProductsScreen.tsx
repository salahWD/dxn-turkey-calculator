import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { ScrollView, FlatList, StatusBar, StyleSheet, View, Animated, Text, Linking, Pressable } from "react-native";
import { serverUrl, globalStyles } from "../constants/global";
import { productPrice, getDollarPrice } from '../util/productPrice';
import { Product } from "../components/Product";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InfoBar } from "../components/InfoBar";

import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import * as MediaLibrary from "expo-media-library";

import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function ProductsScreen() {

  const imageRef: null | MutableRefObject<any> = useRef(null);

  const [scale] = useState(new Animated.Value(1));
  const [dollarPrice, setDollarPrice] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [footerItems, setFooterItems] = useState({});
  const [footerInfo, setFooterInfo] = useState({price: 0, points: 0, products: 0});
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

    fetch(serverUrl + "/assets/products.json").then(res => {
      return res.json();
    }).then(res => {
      setProducts(res);
    }).catch(err => {
      console.error(err)
      throw new Error("Erro Fetching Products => ", err);
    })

    const fetchDollarPrice = async () => {
      const price = await getDollarPrice();
      setDollarPrice(price);
    };

    fetchDollarPrice();

  }, []);

  const togglePreviewMood = () => {
    setSelectedProducts(products.filter(product => Object.keys(footerItems).includes(String(product.id))));
    setPreviewMood(!previewMood);
  }

  const createOrderMessage = () => {

    // أجور توصيل خدمة الدفع المسبق 
    // فاتورة بقيمة من 2400 واعلى مجاناً
    // من 2000-2400 اجور 15ليرة
    // من 1600-2000 اجور 30 ليرة
    // من 1200-1600 اجور 50 ليرة
    // من 800-1200 اجور 75 ليرة
    // من 50-800    اجور 110 ليرة

    let msg = '';
    selectedProducts.forEach(product => {
      msg += `%0a المنتج: *${product.title}*`;
      msg += `%0a العدد: *${footerItems[product.id]}*`;
      msg += `%0a ----------------------------`;
    });
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
      price: price,
      points: points,
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
    await saveInputs();
    let url = "";
    const msg = createOrderMessage();
    if (branch == 1) {// taksim branch
      url = "https://wa.me/905528666050?text=" + msg;
    }else {// essenyurt branch
      url = "https://wa.me/905444482988?text=" + msg;
    }
    await Linking.openURL(url);
  }

  const onSaveImageAsync = async () => {
    console.log("start function")
    try {
      // Scale down
      Animated.timing(scale, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }).start(async () => {
        // Capture the scaled view
        const imageUri = await captureRef(imageRef, {
          format: "png",
          quality: 0.9,
          snapshotContentContainer: true,
        });
        
        console.log("success")
        await Sharing.shareAsync(imageUri, { mimeType: 'image/gif' });

        // Scale back to original
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      })
    } catch (e) {
      console.error("Error in onsaveimageasync function: ", e);
    }
    // try {
    //   console.log("enter try")
      
    //   const imageUri = await imageRef.current.capture();
    //   console.log("success")
      
    //   await Sharing.shareAsync(imageUri, { mimeType: 'image/gif' });

    // } catch (e) {
    //   console.error("Error in onsaveimageasync function: ", e);
    // }
  };

  return (
    <>
      <StatusBar hidden={true} translucent/>
      {/* <View ref={imageRef} collapsable={false} style={{ flex: 1 }}> */}
      <ViewShot ref={imageRef} style={{ flex: 1 }} options={{ format: "png", quality: 0.9, snapshotContentContainer: false, }}>
        <Header />
        {previewMood && 
          <>
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
          <>
            <FlatList
              keyExtractor={(
                item: { id: number, title: string, img: String }
              ): string => String(item.id)}
              data={selectedProducts}
              renderItem={({ item }) => {
                let count = 0;
                if (Object.hasOwn(footerItems, item.id)) {
                  count = footerItems[item.id];
                }
                return (
                  <Product disabled={true} dollarPrice={dollarPrice} calcFooter={calcFooter} item={item} selectedCount={count} />
                )
              }}
            />
            <InfoBar info={footerInfo} formInfo={[formData, setFormData]} />
            <View style={styles.actionsBox}>
              <Pressable onPress={togglePreviewMood}>
                <AntDesign style={globalStyles.cartBtn} name="eyeo" size={24} color="black" />
              </Pressable>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable onPress={() => {makeOrder(1)}}>
                  <View style={styles.orderBtn}>
                    <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                    <Text style={styles.orderBtnText}>تقسيم</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => {makeOrder(2)}}>
                  <View style={styles.orderBtn}>
                    <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                    <Text style={styles.orderBtnText}>اسنيورت</Text>
                  </View>
                </Pressable>
              </View>
              <Pressable onPress={onSaveImageAsync}>
                <AntDesign style={{ ...globalStyles.cartBtn, backgroundColor: "#289e16", color: "#dcfadc"}} name="camerao" size={24} color="black" />
              </Pressable>
            </View>
          </>
        }
      </ViewShot>
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
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  orderBtnText: {
    color: "white",
  },
})