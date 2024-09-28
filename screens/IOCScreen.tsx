import React, { useEffect, useContext, useState, useRef, MutableRefObject } from "react";
import { Alert, ScrollView, FlatList, StatusBar, StyleSheet, View, Text, Pressable, Linking } from "react-native";

import { globalStyles } from "../constants/global";
import { productPrice, getDollarPrice, getProductsFromDB, getShippingPrices, getIOCLimit } from '../util/productPrice';

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

  const imageRef: null | MutableRefObject<any> = useRef(null);

  const [language, setLanguage] = useContext(LangContext);
  const [dollarPrice, setDollarPrice] = useState(null);
  const [IOCLimit, setIOCLimit] = useState(null);
  const [products, setProducts] = useState([]);
  const [shippingRules, setShippingRules] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [footerItems, setFooterItems] = useState({});
  const [footerInfo, setFooterInfo] = useState({price: 0, points: 0, shippingPrice: 110, products: 0, discountPrice: 0});
  const [previewMood, setPreviewMood] = useState(true);
  const [formData, setFormData] = useState({
    phone: null,
    membership: null,
    name: null,
    address: null,
    recipient: null,
    city: null,
  });
  const [orderType, setOrderType] = useState(0);
  
  useEffect(() => {

    const fetchDBInfo = async () => {
      const res = await getProductsFromDB();
      setProducts(res.filter(item => {
        return item.special != null && item.special ? false : true;
      }));

      setShippingRules(await getShippingPrices());

      const price = await getDollarPrice();
      setDollarPrice(price);

      const iotLimit = await getIOCLimit();
      setIOCLimit(iotLimit);
      
    }

    fetchDBInfo();

  }, []);

  const langs = {
    ar: {
      free: "مجاناً",
      essenyurt: "اسنيورت",
      taksim: "تقسيم",
      no_selected_product_title: "لا يوجد منتجات !",
      no_selected_product_desc: "لم يتم اختيار أي منتجات, يرجى اختيار بعض المنتجات قبل الإنتقال لصفحة المعلومات.",
      ioc_min_limit_title: "أقل من الحد الأدنى !",
      ioc_min_limit_desc: "يجب ان يتعدى إجمالي سعر الطلبية الحد الأدنى لطلبات الاي او سي وهو (" + productPrice(dollarPrice, IOCLimit) + " TL) حتى تنتقل لمرحلة الطلب",
      discount_10: "خصم 10%",
      asp_point_limit_title: "أقل من 100 نقطة !",
      asp_point_limit_desc: "يجب ان تتعدى نقاط الطلبية المائة نقطة في نظام (ASP) كي يتم قبول الطلبية",
      alert_btn: "حسناً",
    },
    tr: {
      free: "free",
      essenyurt: "Essenyurt",
      taksim: "Taksim",
      no_selected_product_title: "No products!",
      no_selected_product_desc: "No products selected, please select some products before moving to the information page.",
      ioc_min_limit_title: "Less than the minimum price limit!",
      ioc_min_limit_desc: "The total order price must exceed the minimum IOC order amount which is (" + productPrice(dollarPrice, IOCLimit) + " TL) to proceed to the ordering stage.",
      discount_10: "discount 10%",
      asp_point_limit_title: "Less than 100 points !",
      asp_point_limit_desc: "in ASP system, a 100 point at least is required for the order to be accepted !",
      alert_btn: "Ok",
    }
  }

  const togglePreviewMood = () => {
    if (previewMood) {// main page
      const selectedProds = products.filter(product => Object.keys(footerItems).includes(String(product.id)));
      if (selectedProds.length > 0) {
        if (orderType == 0) {
          if (footerInfo.price > productPrice(dollarPrice, IOCLimit)) {
  
            setSelectedProducts(selectedProds);
            setPreviewMood(false);
          }else {
            Alert.alert(langs[language].ioc_min_limit_title, langs[language].ioc_min_limit_desc, [{
              text: langs[language].alert_btn,
            }]);  
          }
        }else if (orderType == 1) {
          if (footerInfo.points >= 100) {
  
            setSelectedProducts(selectedProds);
            setPreviewMood(false);
          }else {
            Alert.alert(langs[language].asp_point_limit_title, langs[language].asp_point_limit_desc, [{
              text: langs[language].alert_btn,
            }]);  
          }
        }else {
          setSelectedProducts(selectedProds);
          setPreviewMood(false);
        }
      }else {
        Alert.alert(langs[language].no_selected_product_title, langs[language].no_selected_product_desc, [{
          text: langs[language].alert_btn,
        }]);
      }
    }else {// cart page
      setPreviewMood(true);
    }
  }

  const createOrderMessage = () => {

    let msg = '';
    selectedProducts.forEach((product, index) => {
      msg += `%0a المنتج: *${product.title.ar}*`;
      msg += `%0a العدد: *${footerItems[product.id]}*`;
      if (selectedProducts.length - 1 != index) {
        msg += `%0a ـ----------------------------`;
      }
    });

    msg += `%0a *ـ=================*`;
    msg += `%0a نوع الطلبية: *${["IOC", "ASP", "خصم 10 بالمئة"][orderType]}*`;
    msg += `%0a *ـ=================*`;
    msg += `%0a الاسم: ${formData.name ? `*${formData.name}*` : ""}`;
    msg += `%0a رقم العضوية: ${formData.membership ? `${formData.membership}` : ""}`;
    msg += `%0a اسم المستلم: ${formData.recipient ? `*${formData.recipient}*` : ""}`;
    msg += `%0a المدينة: ${formData.city ? `*${formData.city}*` : ""}`;
    msg += `%0a العنوان: ${formData.address ? `*${formData.address}*` : ""}`;
    msg += `%0a رقم الهاتف: ${formData.phone ? `${formData.phone}` : ""}`;
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

    let shippingPrice = 0;
    shippingRules.forEach(rule => {
      if (price > rule.from && price <= rule.to ) {
        shippingPrice = rule.price;
      }
    })

    if (orderType == 2) {
      setFooterInfo({
        price: parseFloat(price.toFixed(2)),
        points: parseFloat(points.toFixed(2)),
        shippingPrice: shippingPrice == 0 ? langs[language].free : shippingPrice,
        products: totalProducts,
        discountPrice: parseFloat((price * 0.9).toFixed(2)),
      });
    }else {
      setFooterInfo({
        price: parseFloat(price.toFixed(2)),
        points: parseFloat(points.toFixed(2)),
        shippingPrice: shippingPrice == 0 ? langs[language].free : shippingPrice,
        products: totalProducts,
        discountPrice: 0,
      });
    }
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

    let url = '';

    if (branch == 1) {// taksim branch
      url = "whatsapp://send?phone=905528666050&text=" + createOrderMessage();
      // url = "whatsapp://send?phone=905527188570&text=" + createOrderMessage();
    }else {// essenyurt branch
      // url = "whatsapp://send?phone=905527188570&text=" + createOrderMessage();
      url = "whatsapp://send?phone=905444482988&text=" + createOrderMessage();
    }
    try {

      Linking.openURL(url).catch(() => {
        alert('Make sure WhatsApp is installed on your device');
      });

    } catch (error) {
      console.error('Error =>', error);
    }

  }

  const onSaveImageAsync = async (willReturn=false) => {
    await saveInputs();
    try {

      const imageUri = await captureRef(imageRef, {
        format: "png",
        quality: 0.9,
      });
      if (willReturn) {
        return imageUri;
      }
      await Sharing.shareAsync(imageUri, { mimeType: 'image/png', dialogTitle: "loog at this" });

    } catch (e) {
      console.error("Error in onsaveimageasync function: ", e);
    }
  };

  const updateFooterCalc = (i) => {
    setOrderType(i)
    if (i == 3) {
      setFooterInfo({...footerInfo, discountPrice: footerInfo.price * 0.9});
    }else {
      setFooterInfo({...footerInfo, discountPrice: 0});
    }
  };


  return (
    <View style={{ backgroundColor: "#e9fbf1", flex: 1 }}>
      <StatusBar hidden={true} translucent/>
      {previewMood && 
        <>
        <View style={ styles.orderType } >
          <Pressable onPress={e => {
              updateFooterCalc(0);
            }}>
            <Text style={ orderType == 0 ? {...styles.orderTypeBtn} : {...styles.orderTypeBtn, opacity: 0.4} }>النظام العادي (SIMP)</Text>
          </Pressable>
          <Pressable onPress={e => {
              updateFooterCalc(1);
            }}>
            <Text style={ orderType == 1 ? {...styles.orderTypeBtn} : {...styles.orderTypeBtn, opacity: 0.4} }>IOC</Text>
          </Pressable>
          <Pressable onPress={e => {
              updateFooterCalc(2);
            }}>
            <Text style={ orderType == 2 ? {...styles.orderTypeBtn} : {...styles.orderTypeBtn, opacity: 0.4} }>ASP</Text>
          </Pressable>
          <Pressable onPress={e => {
              updateFooterCalc(3);
            }}>
            <Text style={ orderType == 3 ? {...styles.orderTypeBtn} : {...styles.orderTypeBtn, opacity: 0.4} }>{ langs[language].discount_10 }</Text>
          </Pressable>
        </View>
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
    </View>
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
  orderType: {
    backgroundColor: "#4dd0e2",
    padding: 12 ,
    borderBottomWidth: 1,
    borderColor: 'black',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  orderTypeBtn: {
    backgroundColor: "#3747ba",
    borderRadius: 6,
    textAlign: "center",
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
})