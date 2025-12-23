import CryptoJS from "crypto-js";

export const md5 = (text: string) => CryptoJS.MD5(text).toString();
