// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase-admin/app";

const firebaseConfig = {
  apiKey: "AIzaSyAnUvnKtMhL0l9V1XJGd90kUF1I5kwI9HI",
  authDomain: "notionhomepage.firebaseapp.com",
  projectId: "notionhomepage",
  storageBucket: "notionhomepage.appspot.com",
  messagingSenderId: "1085978670294",
  appId: "1:1085978670294:web:3bf2d4fd016b023dd44577",
};

export const getFirebase = () => {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
};
