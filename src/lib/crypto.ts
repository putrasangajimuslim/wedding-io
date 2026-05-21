// src/utils/crypto.ts

import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_SECRET_KEY ||
  "secret123";

export const encryptData = (
  data: any
) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
};

export const decryptData = (
  encryptedData: string
) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      SECRET_KEY
    );

    return JSON.parse(
      bytes.toString(CryptoJS.enc.Utf8)
    );
  } catch (error) {
    return null;
  }
};