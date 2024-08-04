import React, { useEffect, useState, useRef } from "react";
import { FlatList, StatusBar, StyleSheet, View, Share, Text, Linking, Pressable } from "react-native";
import { serverUrl } from "../constants/global";
import { productPrice, getDollarPrice } from '../util/productPrice';
import { Product } from "../components/Product";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InfoBar } from "../components/InfoBar";

import { globalStyles } from '../constants/global';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from "expo-media-library";


export default function ProductsScreen() {

  const imageRef = useRef();

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
      url = "https://wa.me/905527188570?text=" + msg;
    }else {// essenyurt branch
      url = "https://wa.me/905527188570?text=" + msg;
    }
    await Linking.openURL(url);
  }

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        await Share.share({
          message: 'مرحبا, اريد هذه المنتجات, شكراً!',
          url: localUri,
        });
      }
    } catch (e) {
      console.error("Error in onsaveimageasync function: ", e);
    }
  };

  return (
    <>
      <StatusBar hidden={true} translucent/>
      <View ref={imageRef} collapsable={false} style={{ flex: 1 }}>
        <Header />
        {previewMood && <FlatList
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
        />}
        {!previewMood && <FlatList
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
        />}
        {previewMood && <Footer togglePreviewMood={togglePreviewMood} info={footerInfo} />}
        {!previewMood && (
          <>
            <InfoBar info={footerInfo} formInfo={[formData, setFormData]} />
            <View style={styles.actionsBox}>
              <Pressable onPress={e => togglePreviewMood()}>
                <AntDesign style={globalStyles.cartBtn} name="eyeo" size={24} color="black" />
              </Pressable>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable onPress={() => {makeOrder(1)}}>
                  <View style={styles.orderBtn}>
                    <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                    <Text style={styles.orderBtnText}>الطلب من تقسيم</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => {makeOrder(2)}}>
                  <View style={styles.orderBtn}>
                    <Entypo name="shopping-cart" size={18} color="#dbf6e0" />
                    <Text style={styles.orderBtnText}>الطلب من اسنيورت</Text>
                  </View>
                </Pressable>
              </View>
              <Pressable onPress={e => onSaveImageAsync()}>
                <AntDesign style={{ ...globalStyles.cartBtn, backgroundColor: "#289e16", color: "#dcfadc"}} name="camerao" size={24} color="black" />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actionsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "skyblue",
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