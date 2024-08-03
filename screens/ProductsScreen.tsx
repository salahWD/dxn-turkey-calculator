import React, { useEffect, useState } from "react";
import { Alert, FlatList, View, StatusBar, Text, StyleSheet, ScrollView } from "react-native";
import { globalStyles, serverUrl } from "../constants/global";
import { Product } from "../components/Product";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InfoBar } from "../components/InfoBar";

export default function ProductsScreen() {
  
  const [products, setProducts] = useState([]);
  const [footerItems, setFooterItems] = useState([]);
  const [previewMood, setPreviewMood] = useState(true);

  useEffect(() => {
    fetch(serverUrl + "/assets/products.json").then(res => {
      return res.json();
    }).then(res => {
      setProducts(res);
    }).catch(err => {
      console.error(err)
      throw new Error("Erro Fetching Products => ", err);
    })
  }, []);

  const togglePreviewMood = () => {
    setPreviewMood(!previewMood);
  }

  const calcFooter = (order) => {
    if (order.count <= 0) {
      setFooterItems(footerItems.filter(row => {
        return row.item.id != order.item.id;
      }));
    }else {
      setFooterItems([...footerItems.filter(row => {
        return row.item.id != order.item.id;
      }), order]);
    }
  }

  return (
    <>
      <StatusBar hidden={true} translucent/>
      <Header />
      {/* <ScrollView style={{marginTop: 25}}>
        {products.map(product => {
          return (
            <CustomText style={styles.product} key={product.id}>{product.title}</CustomText>
          )
        })}
      </ScrollView> */}
      {previewMood && <FlatList
        keyExtractor={(
          item: { id: number, title: string, img: String },
          index: number
        ): string => String(item.id)}
        data={products}
        renderItem={({ item }) => {
          const selected = footerItems.filter((order) => item.id == order.item.id)[0];
          return (
          // count={footerItems.filter(order => item.id == order.item.id)}
          <Product calcFooter={calcFooter} item={item} selectedCount={selected ? selected.count: 0} />
        )}}
      />}
      {!previewMood && <FlatList
        keyExtractor={(
          order: {item: { id: number, title: string, img: String }, count: number},
          index: number
        ): string => String(order.item.id)}
        data={footerItems}
        renderItem={({ item:order }) => (
          <Product disabled={true} calcFooter={calcFooter} item={order.item} selectedCount={order.count} />
        )}
      />}
      {previewMood && <Footer togglePreviewMood={togglePreviewMood} info={footerItems} />}
      {!previewMood && <InfoBar togglePreviewMood={togglePreviewMood} info={footerItems} />}
    </>
  );
}

const styles = StyleSheet.create({
  product: {
    justifyContent: "space-between",
    backgroundColor: "#dfdfdf",
    borderStyle: 'solid',
    flexDirection: "row",
    borderColor: '#cfcfcf',
    borderRadius: 10,
    display: "flex",
    borderWidth: 1,
    marginTop: 4,
    gap: 10,
    padding: 16,
  },
  dropdownButtonStyle: {
    height: 35,
    backgroundColor: '#E9ECEF',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: 50,
  },
  actionButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    textAlign: "center",
    width: "auto",
    height: "auto",
    marginVertical: "auto",
    backgroundColor: "#c0c0c0",
    paddingVertical: 0,
    paddingHorizontal: 12,
  }
});