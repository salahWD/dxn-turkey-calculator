import React, { useEffect, useState } from "react";
import { Alert, FlatList, View, StatusBar, Text, StyleSheet, ScrollView } from "react-native";
import { globalStyles, serverUrl } from "../constants/global";
import { Product } from "../components/Product";
import { Header } from "../components/Header";

export default function ProductsScreen() {
  
  const [products, setProducts] = useState([]);

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
      <FlatList
        keyExtractor={(
          item: { id: number, title: string, img: String },
          index: number
        ): string => String(item.id)}
        data={products}
        renderItem={({ item }) => (
          <Product item={item} />
        )}
      />
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