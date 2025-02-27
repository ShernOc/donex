import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByW5Ail4aPtjNN7HhJ0KsXD8NkZCB3AlA",
  authDomain: "denox-e20ad.firebaseapp.com",
  projectId: "denox-e20ad",
  storageBucket: "denox-e20ad.firebasestorage.app",
  messagingSenderId: "681090394697",
  appId: "1:681090394697:web:2b878a05d27d718208ed98",
  measurementId: "G-7HN31BWKLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;