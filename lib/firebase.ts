// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase-admin/app";

export const getFirebase = () => {
  try {
    return getApp();
  } catch {
    return initializeApp();
  }
};
