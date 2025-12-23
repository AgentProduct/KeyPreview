import CryptoJS from "crypto-js";

export const aesEncrypt = (text: string, key: string) =>
  CryptoJS.AES.encrypt(text, key).toString();

export const aesDecrypt = (cipher: string, key: string) =>
  CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8);
