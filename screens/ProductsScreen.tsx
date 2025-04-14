import React, { useEffect, useContext, useState } from "react";
import {
  BackHandler,
  Alert,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  Linking,
  Modal,
} from "react-native";

import { globalStyles } from "../constants/global";
import {
  productPrice,
  getDollarPrice,
  getShippingPrices,
  getProductsFromDB,
  getIOCLimit,
} from "../util/productPrice";

import { Product } from "../components/Product";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InfoBar } from "../components/InfoBar";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LangContext } from "../langContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from "@expo/vector-icons/Entypo";

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();

  const { language, setLanguage } = useContext(LangContext);
  const [dollarPrice, setDollarPrice] = useState(null);
  const [IOCLimit, setIOCLimit] = useState(null);
  const [products, setProducts] = useState([]);
  const [shippingRules, setShippingRules] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [footerItems, setFooterItems] = useState({});
  const [footerInfo, setFooterInfo] = useState({
    price: 0,
    points: 0,
    shippingPrice: 0,
    products: 0,
    discountPrice: 0,
  });
  const [previewMood, setPreviewMood] = useState(true);
  // const [modalVisible, setModalVisible] = useState(false);
  const [discountAlertVisible, setDiscountAlertVisible] = useState(false);
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
      setProducts(
        res.sort((a, b) => {
          // Prioritize items with special = 1 or 2
          if (
            (a.special === 1 || a.special === 2) &&
            (!b.special || b.special === 0)
          )
            return -1;
          if (
            (b.special === 1 || b.special === 2) &&
            (!a.special || a.special === 0)
          )
            return 1;

          // If both have special status, sort by tag
          return (a.tag || 0) - (b.tag || 0);
        })
      );

      setShippingRules(await getShippingPrices());

      const price = await getDollarPrice();
      setDollarPrice(price);

      const iotLimit = await getIOCLimit();
      setIOCLimit(iotLimit);
    };

    fetchDBInfo();

    const backAction = () => {
      setPreviewMood(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const langs = {
    ar: {
      free: "مجاناً",
      essenyurt: "اسنيورت",
      send: "طلب",
      no_selected_product_title: "لا يوجد منتجات !",
      no_selected_product_desc:
        "لم يتم اختيار أي منتجات, يرجى اختيار بعض المنتجات قبل الإنتقال لصفحة المعلومات.",
      ioc_min_limit_title: "أقل من الحد الأدنى !",
      ioc_min_limit_desc:
        "يجب ان يتعدى إجمالي سعر الطلبية الحد الأدنى لطلبات الاي او سي \nوهو (" +
        IOCLimit +
        " TL) حتى تنتقل لمرحلة الطلب",
      discount_10: "خصم 10%",
      asp_point_limit_title: "أقل من 100 نقطة !",
      asp_point_limit_desc:
        "يجب ان تتعدى نقاط الطلبية المائة نقطة في نظام (ASP) كي يتم قبول الطلبية",
      alert: "تنبيه",
      discountAlert:
        "يرجى التأكد من تفعيلكم لنظام (ASP) او (DSP ) قبل تقديم طلب خصم 10 بالمية",
      normal_system: "النظام العادي",
      alert_btn: "حسناً",
    },
    tr: {
      free: "free",
      essenyurt: "Essenyurt",
      send: "send",
      no_selected_product_title: "No products!",
      no_selected_product_desc:
        "No products selected, please select some products before moving to the information page.",
      ioc_min_limit_title: "Less than the minimum price limit!",
      ioc_min_limit_desc:
        "The total order price must exceed the minimum IOC order amount \nwhich is (" +
        IOCLimit +
        " TL) to proceed to the ordering stage.",
      discount_10: "discount 10%",
      asp_point_limit_title: "Less than 100 points !",
      asp_point_limit_desc:
        "in ASP system, a 100 point at least is required for the order to be accepted !",
      alert: "Alert",
      discountAlert:
        "make sure you have Active ASP balance before making an ASP discount order !",
      normal_system: "normal",
      alert_btn: "Ok",
    },
  };

  const togglePreviewMood = () => {
    if (previewMood) {
      // main page
      const selectedProds = products.filter((product) =>
        Object.keys(footerItems).includes(String(product.id))
      );
      if (selectedProds.length > 0) {
        if (orderType == 1) {
          if (footerInfo.price > IOCLimit) {
            setSelectedProducts(selectedProds);
            setPreviewMood(false);
          } else {
            Alert.alert(
              langs[language].ioc_min_limit_title,
              langs[language].ioc_min_limit_desc,
              [
                {
                  text: langs[language].alert_btn,
                },
              ]
            );
          }
        } else if (orderType == 2) {
          if (footerInfo.points >= 100) {
            setSelectedProducts(selectedProds);
            setPreviewMood(false);
          } else {
            Alert.alert(
              langs[language].asp_point_limit_title,
              langs[language].asp_point_limit_desc,
              [
                {
                  text: langs[language].alert_btn,
                },
              ]
            );
          }
        } else {
          setSelectedProducts(selectedProds);
          setPreviewMood(false);
        }
      } else {
        Alert.alert(
          langs[language].no_selected_product_title,
          langs[language].no_selected_product_desc,
          [
            {
              text: langs[language].alert_btn,
            },
          ]
        );
      }
    } else {
      // cart page
      setPreviewMood(true);
    }
  };

  const createOrderMessage = () => {
    let msg = "";
    selectedProducts.forEach((product, index) => {
      if (product?.special && product.special == 2) {
        const packageItems = [
          0, 1, 2, 3, 5, 8, 11, 12, 13, 16, 21, 22, 24, 25, 27, 28, 50, 49, 48,
          44,
        ];
        const firstPackage = products.filter((item) => {
          return packageItems.includes(item.tag);
        });
        msg += `%0a ـ *طلبية مجموعة*`;
        firstPackage.forEach((item) => {
          msg += `%0a ـ *${item.title.ar}*`;
        });
        msg += `%0a العدد: *1*`;
      } else {
        msg += `%0a المنتج: *${product.title.ar.replace("+", " %2b ")}*`;
        msg += `%0a العدد: *${footerItems[product.id]}*`;
        msg += `%0a الكود: *${product?.code ?? "- - -"}*`;
      }
      if (selectedProducts.length - 1 != index) {
        msg += `%0a ـ----------------------------`;
      }
    });

    msg += `%0a *ـ=================*`;
    msg += `%0a نوع الطلبية: *${
      ["عادية (SIMP)", "IOC", "ASP", "خصم 10 بالمئة"][orderType]
    }*`;
    msg += `%0a *ـ=================*`;
    if (footerInfo.discountPrice > 0) {
      msg += `%0a سعر الطلبية: *~${footerInfo.price}~* TL`;
      msg += `%0a بعد الخصم: *${footerInfo.discountPrice}* TL`;
    } else {
      msg += `%0a سعر الطلبية: *${footerInfo.price}* TL`;
    }
    msg += `%0a سعر الشحن: *${
      footerInfo.shippingPrice == 0
        ? langs[language].free
        : footerInfo.shippingPrice
    }* TL`;
    if (footerInfo.discountPrice > 0) {
      msg += `%0a الإجمالي: *${
        footerInfo.discountPrice + footerInfo.shippingPrice
      }* ${footerInfo.shippingPrice == 0 ? "" : " TL"}`;
    } else {
      msg += `%0a الإجمالي: *${
        footerInfo.price + footerInfo.shippingPrice
      }* TL`;
    }
    msg += `%0a إجمالي النقاط: *${footerInfo.points}*`;
    msg += `%0a عدد المنتجات: *${footerInfo.products}*`;
    msg += `%0a *ـ=================*`;
    msg += `%0a الاسم: ${
      formData.name?.trim() ? `*${formData.name?.trim()}*` : ""
    }`;
    msg += `%0a رقم العضوية: ${
      formData.membership?.trim() ? `${formData.membership?.trim()}` : ""
    }`;
    msg += `%0a اسم المستلم: ${
      formData.recipient?.trim() ? `*${formData.recipient?.trim()}*` : ""
    }`;
    msg += `%0a المدينة: ${
      formData.city?.trim() ? `*${formData.city?.trim()}*` : ""
    }`;
    msg += `%0a العنوان: ${
      formData.address?.trim() ? `*${formData.address?.trim()}*` : ""
    }`;
    msg += `%0a رقم الهاتف: ${
      formData.phone?.trim() ? `${formData.phone?.trim()}` : ""
    }`;
    msg += `%0a`;

    return msg;
  };

  const calcFooter = (order: { id: number; count: number }) => {
    let items = { ...footerItems };
    if (order.count > 0) {
      items[order.id] = order.count;
    } else {
      delete items[order.id];
    }
    setFooterItems(items);

    let price = 0;
    let shipingValue = 0;
    let points = 0;
    let totalProducts = 0;
    products
      .filter((product) => Object.keys(items).includes(String(product.id)))
      .forEach((item) => {
        if (Object.hasOwn(items, item.id)) {
          price += items[item.id] * productPrice(dollarPrice, item.price);
          points += items[item.id] * item.points;
          totalProducts += items[item.id];
        }
      });

    if (orderType == 3) {
      shipingValue = price * 0.9;
    }

    let shippingPrice = 0;
    shippingRules.forEach((rule) => {
      if (price > rule.from && price <= rule.to) {
        shippingPrice = rule.price;
      }
    });

    if (orderType == 3) {
      setFooterInfo({
        price: parseFloat(price.toFixed(2)),
        points: parseFloat(points.toFixed(2)),
        shippingPrice: shippingPrice,
        products: totalProducts,
        discountPrice: parseFloat((price * 0.9).toFixed(2)),
      });
    } else {
      setFooterInfo({
        price: parseFloat(price.toFixed(2)),
        points: parseFloat(points.toFixed(2)),
        shippingPrice: shippingPrice,
        products: totalProducts,
        discountPrice: 0,
      });
    }
  };

  const saveInputs = async () => {
    try {
      await AsyncStorage.setItem("@form", JSON.stringify(formData));
    } catch (e) {
      console.log("Failed to save inputs:", e);
    }
  };

  const makeOrder = async () => {
    await saveInputs();

    try {
      let url =
        "whatsapp://send?phone=905444482988&text=" + createOrderMessage();

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Make sure WhatsApp is installed on your device");
      }
    } catch (error) {
      console.error("Error =>", error);
    }
  };

  const updateFooterCalc = (i) => {
    if (i == 3) {
      setDiscountAlertVisible(true);
    }
    setOrderType(i);
    setFooterItems({});
    setFooterInfo({
      price: 0,
      points: 0,
      shippingPrice: 0,
      products: 0,
      discountPrice: 0,
    });
  };

  return (
    <>
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={discountAlertVisible}
        onRequestClose={() => {
          setDiscountAlertVisible(false);
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setDiscountAlertVisible(false)}
        >
          <View style={styles.centeredView}>
            <Pressable
              style={{
                width: 350,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalView}>
                <Text style={styles.alertTitle}>{langs[language].alert}</Text>
                <Text
                  style={{
                    ...styles.alertText,
                    textAlign: language == "ar" ? "right" : "left",
                  }}
                >
                  {langs[language].discountAlert}
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <View
        style={{
          backgroundColor: "#e9fbf1",
          flex: 1,
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        }}
      >
        <StatusBar hidden={true} translucent />
        {previewMood && (
          <>
            <View style={styles.orderType}>
              <Pressable
                onPress={(e) => {
                  updateFooterCalc(0);
                }}
              >
                <Text
                  style={
                    orderType == 0
                      ? { ...styles.orderTypeBtn }
                      : { ...styles.orderTypeBtn, opacity: 0.4 }
                  }
                >
                  {langs[language].normal_system} (SIMP)
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  updateFooterCalc(1);
                }}
              >
                <Text
                  style={
                    orderType == 1
                      ? { ...styles.orderTypeBtn }
                      : { ...styles.orderTypeBtn, opacity: 0.4 }
                  }
                >
                  IOC
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  updateFooterCalc(2);
                }}
              >
                <Text
                  style={
                    orderType == 2
                      ? { ...styles.orderTypeBtn }
                      : { ...styles.orderTypeBtn, opacity: 0.4 }
                  }
                >
                  ASP
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  updateFooterCalc(3);
                }}
              >
                <Text
                  style={
                    orderType == 3
                      ? { ...styles.orderTypeBtn }
                      : { ...styles.orderTypeBtn, opacity: 0.4 }
                  }
                >
                  {langs[language].discount_10}
                </Text>
              </Pressable>
            </View>
            <Header dollarPrice={dollarPrice} />
            <FlatList
              keyExtractor={(item: {
                id: number;
                title: string;
                img: String;
              }): string => String(item.id)}
              data={products}
              renderItem={({ item }) => {
                let count = 0;
                if (Object.hasOwn(footerItems, item.id)) {
                  count = footerItems[item.id];
                }
                if (
                  (orderType == 0 &&
                    (item.special == null ||
                      (item.special != null && item.special == 1))) ||
                  (orderType == 1 &&
                    (item.special == null ||
                      (item.special != null && item.special == 2))) ||
                  (orderType > 1 && item.special == null)
                ) {
                  return (
                    <Product
                      stopped={item?.stopped}
                      calcFooter={calcFooter}
                      dollarPrice={dollarPrice}
                      item={item}
                      selectedCount={count}
                    />
                  );
                } else {
                  return null;
                }
              }}
            />
            <Footer togglePreviewMood={togglePreviewMood} info={footerInfo} />
          </>
        )}
        {!previewMood && (
          <ScrollView
            style={{ flex: 1, backgroundColor: "#defafc" }}
            contentContainerStyle={{ minHeight: "100%" }}
          >
            <View style={{ flex: 1, backgroundColor: "#defafc" }}>
              <Header key="header" dollarPrice={dollarPrice} />
              <View style={{ flex: 1 }}>
                {selectedProducts.map((item) => {
                  let count = 0;
                  if (Object.hasOwn(footerItems, item.id)) {
                    count = footerItems[item.id];
                  }
                  return (
                    <Product
                      key={item.id}
                      disabled={true}
                      stopped={item?.stopped}
                      dollarPrice={dollarPrice}
                      calcFooter={calcFooter}
                      item={item}
                      selectedCount={count}
                    />
                  );
                })}
              </View>
              <InfoBar info={footerInfo} formInfo={[formData, setFormData]} />
            </View>
            <View style={styles.actionsBox}>
              <Pressable onPress={togglePreviewMood}>
                <Entypo
                  style={globalStyles.cartBtn}
                  name="back"
                  size={24}
                  color="black"
                />
              </Pressable>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={() => {
                    makeOrder();
                    // setModalVisible(true);
                  }}
                >
                  <View style={styles.orderBtn}>
                    <Text style={{ ...styles.orderBtnText }}>
                      {/* {langs[language].send} */}
                      {langs[language].essenyurt}

                      {/* <Pressable onPress={() => {makeOrder();}}>
                        <View style={styles.orderBtn}>
                          <Text style={styles.orderBtnText}>
                          </Text>
                        </View>
                      </Pressable> */}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actionsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#afebf0",
    alignItems: "center",
    paddingBottom: 12,
    paddingTop: 4,
    paddingHorizontal: 22,
  },
  orderBtn: {
    backgroundColor: "#3dcc5a",
    color: "white",
    borderRadius: 8,
    flexDirection: "row",
    textAlign: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  orderBtnText: {
    fontSize: 16,
    color: "white",
  },
  alertText: {
    fontSize: 18,
    color: "black",
  },
  alertTitle: {
    fontSize: 26,
    color: "#C30000",
  },
  orderType: {
    backgroundColor: "#4dd0e2",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  orderTypeBtn: {
    backgroundColor: "#3747ba",
    borderRadius: 6,
    textAlign: "center",
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000003f",
  },
  modalView: {
    width: "80%",
    gap: 15,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
