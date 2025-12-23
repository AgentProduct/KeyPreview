/**
 * 非对称密钥对功能模块
 * 使用Web Crypto API实现RSA密钥对的生成、导出和加密解密
 */

export interface KeyPair {
  publicKey: string; // PEM格式公钥
  privateKey: string; // PEM格式私钥
}

export interface EncryptResult {
  isValid: boolean;
  result?: string;
  error?: string;
}

export interface DecryptResult {
  isValid: boolean;
  result?: string;
  error?: string;
}

/**
 * 生成RSA密钥对
 * @param modulusLength 密钥长度，默认2048
 * @returns Promise<KeyPair> 包含PEM格式公钥和私钥的对象
 */
export async function generateKeyPair(
  modulusLength: number = 2048
): Promise<KeyPair> {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: "SHA-256" },
      },
      true, // 是否可导出
      ["sign", "verify"] // 密钥用途
    );

    // 导出公钥
    const publicKey = await exportPublicKey(keyPair.publicKey);
    // 导出私钥
    const privateKey = await exportPrivateKey(keyPair.privateKey);

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    throw new Error(
      `生成密钥对失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * 导出公钥为PEM格式
 * @param publicKey CryptoKey对象
 * @returns Promise<string> PEM格式公钥
 */
async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const exportedAsString = arrayBufferToString(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PUBLIC KEY-----
${insertNewlines(exportedAsBase64)}
-----END PUBLIC KEY-----`;
}

/**
 * 导出私钥为PEM格式
 * @param privateKey CryptoKey对象
 * @returns Promise<string> PEM格式私钥
 */
async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const exportedAsString = arrayBufferToString(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PRIVATE KEY-----
${insertNewlines(exportedAsBase64)}
-----END PRIVATE KEY-----`;
}

/**
 * ArrayBuffer转换为字符串
 * @param buffer ArrayBuffer对象
 * @returns string 转换后的字符串
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)));
}

/**
 * 插入换行符，每64个字符换行
 * @param str 原始字符串
 * @returns string 插入换行符后的字符串
 */
function insertNewlines(str: string): string {
  const result = [];
  for (let i = 0; i < str.length; i += 64) {
    result.push(str.substring(i, i + 64));
  }
  return result.join("\n");
}

/**
 * 使用公钥加密数据
 * @param data 要加密的数据
 * @param publicKeyPEM PEM格式公钥
 * @returns Promise<EncryptResult> 加密结果
 */
export async function encryptData(
  data: string,
  publicKeyPEM: string
): Promise<EncryptResult> {
  try {
    // 移除PEM格式头部和尾部
    const publicKeyDER = window.atob(
      publicKeyPEM
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s/g, "")
    );

    // 转换为ArrayBuffer
    const publicKeyBuffer = stringToArrayBuffer(publicKeyDER);

    // 导入公钥
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt"]
    );

    // 将数据转换为ArrayBuffer
    const dataBuffer = new TextEncoder().encode(data);

    // 加密数据
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      dataBuffer
    );

    // 转换为Base64编码
    const encryptedData = window.btoa(arrayBufferToString(encryptedBuffer));

    return {
      isValid: true,
      result: encryptedData,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `加密失败: ${error instanceof Error ? error.message : "未知错误"}`,
    };
  }
}

/**
 * 使用私钥解密数据
 * @param encryptedData 加密的数据
 * @param privateKeyPEM PEM格式私钥
 * @returns Promise<DecryptResult> 解密结果
 */
export async function decryptData(
  encryptedData: string,
  privateKeyPEM: string
): Promise<DecryptResult> {
  try {
    // 移除PEM格式头部和尾部
    const privateKeyDER = window.atob(
      privateKeyPEM
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replace(/\s/g, "")
    );

    // 转换为ArrayBuffer
    const privateKeyBuffer = stringToArrayBuffer(privateKeyDER);

    // 导入私钥
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["decrypt"]
    );

    // 将加密数据转换为ArrayBuffer
    const encryptedBuffer = stringToArrayBuffer(window.atob(encryptedData));

    // 解密数据
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedBuffer
    );

    // 转换为字符串
    const decryptedData = new TextDecoder().decode(decryptedBuffer);

    return {
      isValid: true,
      result: decryptedData,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `解密失败: ${error instanceof Error ? error.message : "未知错误"}`,
    };
  }
}

/**
 * 字符串转换为ArrayBuffer
 * @param str 原始字符串
 * @returns ArrayBuffer 转换后的ArrayBuffer
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
  const buffer = new ArrayBuffer(str.length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return buffer;
}
