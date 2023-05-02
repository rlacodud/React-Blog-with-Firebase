import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnJ6S3dpa4lM0tisF6rDweyRVwtYVJx34",
  authDomain: "signup-test-aebb8.firebaseapp.com",
  projectId: "signup-test-aebb8",
  storageBucket: "signup-test-aebb8.appspot.com",
  messagingSenderId: "622639850733",
  appId: "1:622639850733:web:11803aab602955ac07d8e4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();