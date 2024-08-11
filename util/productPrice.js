import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoV1Zuus1ujVzAxnvYCkHHI6O3pyP-yFM",
  authDomain: "dxn-turkye-calculator-d876d.firebaseapp.com",
  projectId: "dxn-turkye-calculator-d876d",
  storageBucket: "dxn-turkye-calculator-d876d.appspot.com",
  messagingSenderId: "475401095913",
  appId: "1:475401095913:web:c3cb0e48445daeaa8d7e78",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getDollarPrice = async () => {
  let dollarPrice = 32;

  try {
    // Ensure the document reference is correct
    const docRef = doc(db, "price", "1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      dollarPrice = parseFloat(data["USD-TL"]);
      // console.log("price of dollar [USD-TL] = ", dollarPrice);
    } else {
      console.error("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }

  return dollarPrice;
};

export const productPrice = (dollar, initPrice) => {
  return initPrice * dollar;
};
