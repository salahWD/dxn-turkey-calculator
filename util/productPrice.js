import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoV1Zuus1ujVzAxnvYCkHHI6O3pyP-yFM",
  authDomain: "dxn-turkye-calculator-d876d.firebaseapp.com",
  projectId: "dxn-turkye-calculator-d876d",
  storageBucket: "dxn-turkye-calculator-d876d.appspot.com",
  messagingSenderId: "475401095913",
  appId: "1:475401095913:web:c3cb0e48445daeaa8d7e78",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getDollarPrice = async () => {
  let dollarPrice = 35;

  try {
    // Ensure the document reference is correct
    const docRef = doc(db, "price", "1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      dollarPrice = parseFloat(data["USD-TL"]);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }

  return dollarPrice;
};

export const getIOCLimit = async () => {
  let limit = 260;

  try {
    // Ensure the document reference is correct
    const docRef = doc(db, "IOC_limit", "1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      limit = parseFloat(data["limit"]);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }

  return limit;
};

export const getProductsFromDB = async () => {
  try {
    let products = [];
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Sort products by their numeric ID
    return products.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error("Error fetching products: ", error);
    const res = await fetch(serverUrl + "/assets/products.json");
    return res.json();
  }
};

export const getShippingPrices = async () => {
  try {
    let rules = [];
    const querySnapshot = await getDocs(collection(db, "shipping"));

    querySnapshot.forEach((doc) => {
      rules.push({ id: doc.id, ...doc.data() });
    });

    return rules;
  } catch (error) {
    return [
      {
        from: 2000,
        to: 2500,
        price: 20,
      },
      {
        from: 1600,
        to: 2000,
        price: 40,
      },
      {
        from: 1200,
        to: 1600,
        price: 65,
      },
      {
        from: 800,
        to: 1200,
        price: 85,
      },
      {
        from: 0,
        to: 800,
        price: 115,
      },
    ];
  }
};

export const productPrice = (dollar, initPrice) => {
  return initPrice * dollar;
};
