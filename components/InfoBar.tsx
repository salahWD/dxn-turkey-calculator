import React, { useEffect, useContext } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LangContext } from "../langContext";

import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const citiesList = [
  "Istanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Konya",
  "Mersin",
  "Adana",
  "Diyarbakır",
  "Kayseri",
  "Samsun",
  "Balıkesir",
  "Denizli",
  "Çankaya",
  "Keçiören",
  "Osmangazi",
  "Esenyurt",
  "Eskişehir",
  "Seyhan",
  "Erzurum",
  "Trabzon",
  "Bağcılar",
  "Umraniye",
  "Yenimahalle",
  "Pendik",
  "Mamak",
  "Selçuklu",
  "Yıldırım",
  "Etimesgut",
  "Yukarıkaraman",
  "Melikgazi",
  "Sincan",
  "Nilüfer",
  "Buca",
  "Şanlıurfa",
  "Küçükçekmece",
  "Kartal",
  "Bornova",
  "Demiryol",
  "Erköklü",
  "Batman",
  "Esenler",
  "Kahramanmaraş",
  "Kâğıthane",
  "Avcılar",
  "Malatya",
  "Elazığ",
  "Altındağ",
  "Kocasinan",
  "Bağlar",
  "Yüreğir",
  "Manisa",
  "Hatay",
  "Gaziantep",
  "Gebze",
  "Sivas",
  "Alanya",
  "Kocaeli",
  "Kayapınar",
  "Konak",
  "Van",
  "Pamukkale",
  "Karşıyaka",
  "Sarıyer",
  "Meram",
  "Beylikdüzü",
  "Sultanbeyli",
  "Yeşilyurt",
  "Afyonkarahisar",
  "Battalgazi",
  "Güngören",
  "Sakarya",
  "İnegöl",
  "Çorlu",
  "Arnavutköy",
  "Bayat",
  "Adıyaman",
  "Kütahya",
  "Osmaniye",
  "Aydın",
  "Isparta",
  "Siverek",
  "Antalya",
  "Tuzla",
  "Aksaray",
  "Kızıltepe",
  "Çekme",
  "İskenderun",
  "Büyükçekmece",
  "Beykoz",
  "Düzce",
  "Tarsus",
  "Ordu",
  "Uşak",
  "Mezitli",
  "Sarıçam",
  "Yenişehir",
  "Çiğli",
  "Tekirdağ",
  "Menemen",
  "Viranşehir",
  "Karaköprü",
  "Muş",
  "Kırıkkale",
  "Bolu",
  "Edirne",
  "Torbalı",
  "Bodrum",
  "Akhisar",
  "Erciş",
  "Talas",
  "Karaman",
  "Fethiye",
  "Çerkezköy",
  "Siirt",
  "Körfez",
  "Manavgat",
  "Tokat",
  "Turgutlu",
  "Nazilli",
  "Gölcük",
  "Salihli",
  "Bingöl",
  "Ceyhan",
  "Erzincan",
  "Edremit",
  "Bandırma",
  "Kırşehir",
  "Nevşehir",
  "Erdemli",
  "Mahmutlu",
  "Büyük Çakırman",
  "Buğdaylı",
  "Gölbaşı",
  "Ağrı",
  "Kastamonu",
  "Lüleburgaz",
  "Milas",
  "Derince",
  "Ereğli",
  "Cizre",
  "Nizip",
  "Bafra",
  "Elbistan",
  "Rize",
  "Çarşamba",
  "Silivri",
  "Gaziemir",
  "Iğdır",
  "Yalova",
  "Silopi",
  "Ödemiş",
  "Karabük",
  "Kuşadası",
  "Kozan",
  "Ergani",
  "Çayırova",
  "Dörtyol",
  "Edremit",
  "Ünye",
  "Karatepe",
  "Giresun",
  "Polatlı",
  "Serik",
  "Kadirli",
  "Akçaabat",
  "Patnos",
  "Kâhta",
  "Ereğli",
  "Doğubayazıt",
  "Samandağ",
  "Kırıkhan",
  "Gemlik",
  "Söke",
  "Yüksekova",
  "Silifke",
  "Bismil",
  "Niğde",
  "Kapaklı",
  "Fatsa",
  "Nusaybin",
  "Amasya",
  "Midyat",
  "Akçakale",
  "Soma",
  "Mudanya",
  "Kemalpaşa",
  "Yozgat",
  "Alaşehir",
  "Suruç",
  "Bergama",
  "Gürsu",
  "Mustafakemalpaşa",
  "Tavşanlı",
  "Zonguldak",
  "Sur",
  "Burdur",
  "Çanakkale",
  "Mardin",
  "Bilecik",
  "Balçova",
  "Kırklareli",
  "Bartın",
  "Kars",
  "Narlıdere",
  "Kilis",
  "Hakkari",
  "Sinop",
  "Gümüşhane",
  "Muğla",
  "Şırnak",
  "Bitlis",
  "Bayburt",
  "Çorum",
  "Çukurçayır",
  "Tunceli",
  "Çankırı",
  "Artvin",
  "Pelitli",
  "Ardahan",
  "Yakacık",
  "Kadıköy",
  "Adalar",
  "Kızılcaşar",
  "Yenice",
  "Değirmendere",
  "Balpınar",
  "İncek",
  "Kayabaşı",
  "Heybeli",
  "Rumelifeneri",
  "Bahçeköy",
  "Eskihisar",
  "Çağlayan",
  "Akbaba",
  "Tayakadın",
  "Binatlı",
  "Kınalı",
  "Büyükyoncalı",
  "Düzyurt",
  "Burgaz",
  "Yeniköy",
  "Zeytinli",
  "Kızılca",
  "Saracalarçiftliği",
  "Çavak",
  "Çevrimova",
  "Mahmutbey",
  "Samandıra",
  "Pursaklar",
  "Kemerburgaz",
  "Burç",
  "Kazanlı",
  "Hadımköy",
  "Mahmut Şevket Paşa",
  "Yolboyu",
];

const langs = {
  ar: {
    free: "مجاناً",
    total_price: "سعر الطلبية",
    after_discount: "بعد الخصم",
    total_points: "مجموع النقاط",
    shipping: "سعر الشحن",
    products_count: "عدد المنتجات",
    cityPlaceholder: "المدينة",
    phonePlaceholder: "رقم الهاتف",
    memberNamePlaceholder: "إسم العضو",
    membershipNumberPlaceholder: "رقم العضوية",
    namePlaceholder: "إسم المستلم",
    addressPlaceholder: "العنوان",
  },
  tr: {
    free: "free",
    total_price: "order amount",
    after_discount: "after discount",
    shipping: "shipping",
    total_points: "total points",
    products_count: "products count",
    cityPlaceholder: "City",
    phonePlaceholder: "Phone",
    memberNamePlaceholder: "member name",
    membershipNumberPlaceholder: "membership",
    namePlaceholder: "recipient name",
    addressPlaceholder: "address",
  },
};

export function InfoBar({
  info: { price, shippingPrice, points, products, discountPrice },
  formInfo,
}) {
  const { language } = useContext(LangContext);
  const [formData, setFormData] = formInfo;

  useEffect(() => {
    const loadInputs = async () => {
      try {
        const form = JSON.parse(await AsyncStorage.getItem("@form"));
        if (form !== null) {
          setFormData({ ...formData, ...form });
        }
      } catch (e) {
        console.error("Failed to load inputs:", e);
      }
    };

    loadInputs();
  }, []);

  return (
    <>
      <KeyboardAvoidingView behavior={"padding"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.main}>
            <View style={styles.footer}>
              <View style={styles.container}>
                <View style={styles.inputRow}>
                  <TextInput
                    onChangeText={(e) => {
                      setFormData({ ...formData, name: e });
                    }}
                    value={formData.name}
                    style={styles.textInput}
                    placeholder={langs[language].memberNamePlaceholder}
                  />
                  <TextInput
                    onChangeText={(e) => {
                      setFormData({ ...formData, membership: e });
                    }}
                    value={formData.membership}
                    inputMode="numeric"
                    style={styles.textInput}
                    placeholder={langs[language].membershipNumberPlaceholder}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    onChangeText={(e) => {
                      setFormData({ ...formData, phone: e });
                    }}
                    value={formData.phone}
                    inputMode="numeric"
                    style={{ ...styles.textInput }}
                    placeholder={langs[language].phonePlaceholder}
                  />
                  <SelectDropdown
                    defaultValue={formData.city}
                    data={citiesList}
                    onSelect={(selectedItem, index) => {
                      setFormData({ ...formData, city: selectedItem });
                    }}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View style={styles.dropdownButtonStyle}>
                          <Text
                            style={
                              selectedItem != null
                                ? { color: "#333" }
                                : styles.dropdownButtonTxtStyle
                            }
                          >
                            {(selectedItem != null && selectedItem) ||
                              langs[language].cityPlaceholder}
                          </Text>
                          <Icon
                            name={isOpened ? "chevron-up" : "chevron-down"}
                            style={styles.dropdownButtonArrowStyle}
                          />
                        </View>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: "#E9ECEF" }),
                          }}
                        >
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item}
                          </Text>
                        </View>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    onChangeText={(e) => {
                      setFormData({ ...formData, recipient: e });
                    }}
                    value={formData.recipient}
                    style={styles.textInput}
                    placeholder={langs[language].namePlaceholder}
                  />
                  <TextInput
                    onChangeText={(e) => {
                      setFormData({ ...formData, address: e });
                    }}
                    value={formData.address}
                    style={styles.textInput}
                    placeholder={langs[language].addressPlaceholder}
                  />
                </View>
              </View>
              <View style={styles.holder}>
                <View style={{ ...styles.row }}>
                  <Text
                    style={
                      discountPrice && discountPrice > 0
                        ? {
                            ...styles.value,
                            textDecorationLine: "line-through",
                            opacity: 0.55,
                          }
                        : { ...styles.value }
                    }
                  >
                    {price.toFixed(2)}
                  </Text>
                  <Text style={styles.key}>
                    {langs[language].total_price}:{" "}
                  </Text>
                </View>
                {discountPrice && discountPrice > 0 ? (
                  <View style={{ ...styles.row }}>
                    <Text style={styles.value}>{discountPrice.toFixed(2)}</Text>
                    <Text style={styles.key}>
                      {langs[language].after_discount}:{" "}
                    </Text>
                  </View>
                ) : null}
                <View style={{ ...styles.row }}>
                  <Text style={styles.value}>
                    {shippingPrice > 0 ? shippingPrice : langs[language].free}
                  </Text>
                  <Text style={styles.key}>{langs[language].shipping}: </Text>
                </View>
                <View style={{ ...styles.row }}>
                  <Text style={styles.value}>{points.toFixed(2)}</Text>
                  <Text style={styles.key}>
                    {langs[language].total_points}:{" "}
                  </Text>
                </View>
                <View style={{ ...styles.row }}>
                  <Text style={styles.value}>{products}</Text>
                  <Text style={styles.key}>
                    {langs[language].products_count}:{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#afebf0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    gap: 10,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  holder: {
    gap: 0,
  },
  row: {
    textAlign: "center",
    textAlignVertical: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  key: {
    textAlign: "left",
    fontSize: 12,
    fontFamily: "zain-regular",
  },
  value: {
    fontSize: 16,
    fontFamily: "zain-black",
    textAlign: "left",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    marginBottom: 2,
  },
  textInput: {
    flex: 1,
    height: "auto",
    backgroundColor: "#fafafa",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 12,
  },
  dropdownButtonStyle: {
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "49%",
    paddingVertical: 0,
  },
  dropdownButtonTxtStyle: {
    textAlign: "center",
    marginHorizontal: "auto",
    fontSize: 12,
    fontWeight: "500",
    color: "#777",
  },
  dropdownButtonArrowStyle: {
    fontSize: 16,
    paddingRight: 6,
  },
  dropdownMenuStyle: {
    backgroundColor: "white",
    // backgroundColor: 'red',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
});
