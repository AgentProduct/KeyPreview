// JWT 模块：实现 JWT 的编码、解码、签名和验证功能

interface JwtHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: unknown;
}

interface JwtPayload {
  [key: string]: unknown;
}

export interface JwtToken {
  header: JwtHeader;
  payload: JwtPayload;
  signature?: string;
  raw: string;
}

// JWT 解码
export const decodeJwt = (token: string): JwtToken => {
  try {
    if (!token.trim()) {
      throw new Error("JWT token cannot be empty");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error(
        `Invalid JWT format: Expected 3 parts, got ${parts.length}`
      );
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

    try {
      const header = JSON.parse(base64UrlDecode(headerEncoded));
      if (typeof header !== "object" || header === null) {
        throw new Error("JWT header must be a valid JSON object");
      }

      const payload = JSON.parse(base64UrlDecode(payloadEncoded));
      if (typeof payload !== "object" || payload === null) {
        throw new Error("JWT payload must be a valid JSON object");
      }

      return {
        header,
        payload,
        signature: signatureEncoded,
        raw: token,
      };
    } catch (jsonError) {
      if (
        jsonError instanceof Error &&
        jsonError.message.includes("Unexpected token")
      ) {
        throw new Error("Invalid JSON in JWT part: " + jsonError.message);
      }
      throw jsonError;
    }
  } catch (error) {
    throw new Error(
      `Failed to decode JWT: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// 辅助函数：将ArrayBuffer转换为Base64字符串
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// 辅助函数：将字符串转换为ArrayBuffer
const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes.buffer;
};

// 辅助函数：PEM格式转换为DER格式ArrayBuffer
const pemToDer = (pem: string): ArrayBuffer => {
  // 移除PEM头部和尾部，以及所有换行符
  const base64 = pem
    .replace(/-----BEGIN (.*)-----/g, "")
    .replace(/-----END (.*)-----/g, "")
    .replace(/\s/g, "");

  // 解码Base64为二进制字符串
  const binary = atob(base64);

  // 转换为ArrayBuffer
  return stringToArrayBuffer(binary);
};

// 检查是否为PEM格式密钥
const isPemFormat = (key: string): boolean => {
  return key.includes("-----BEGIN") && key.includes("-----END");
};

// 检查是否为JWK格式密钥
const isJwkFormat = (key: string | object): boolean => {
  try {
    const jwk = typeof key === "string" ? JSON.parse(key) : key;
    return typeof jwk === "object" && jwk !== null && "kty" in jwk;
  } catch {
    return false;
  }
};

// URL-safe Base64 编码
export const base64UrlEncode = (input: string | ArrayBuffer): string => {
  let base64: string;

  if (typeof input === "string") {
    // 对于字符串，先转换为ArrayBuffer确保正确处理Unicode
    base64 = btoa(unescape(encodeURIComponent(input)));
  } else {
    // 对于ArrayBuffer，直接转换
    base64 = arrayBufferToBase64(input);
  }

  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

// URL-safe Base64 解码（用于文本数据）
export const base64UrlDecode = (str: string): string => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return decodeURIComponent(escape(atob(str)));
};

// URL-safe Base64 解码（用于二进制数据）
export const base64UrlDecodeBinary = (str: string): Uint8Array => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  const binaryStr = atob(str);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
};

// 创建 JWT 头部和载荷的编码部分
export const createJwtParts = (
  header: JwtHeader,
  payload: JwtPayload
): string => {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
};

// 生成 HMAC 签名
export const generateHmacSignature = async (
  data: string,
  secret: string,
  algorithm: string
): Promise<string> => {
  const cryptoAlgorithm = {
    name: "HMAC",
    hash: {
      name: algorithm.replace("HS", "SHA-"),
    },
  };

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    cryptoAlgorithm,
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    cryptoAlgorithm,
    key,
    encoder.encode(data)
  );

  return base64UrlEncode(signature);
};

// 生成 RSA/ECDSA 签名
export const generateAsymmetricSignature = async (
  data: string,
  privateKey: string | object,
  algorithm: string
): Promise<string> => {
  const cryptoAlgorithm = {
    name: algorithm.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : "ECDSA",
    hash: {
      name: algorithm.replace(/^[RE]S/, "SHA-"),
    },
  };

  const encoder = new TextEncoder();
  let key;

  if (typeof privateKey === "string" && isPemFormat(privateKey)) {
    // 处理 PEM 格式密钥
    try {
      const der = pemToDer(privateKey);
      key = await crypto.subtle.importKey(
        algorithm.startsWith("RS") ? "pkcs8" : "ec",
        der,
        cryptoAlgorithm,
        false,
        ["sign"]
      );
    } catch (error) {
      throw new Error(
        `无效的PEM格式私钥: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  } else if (isJwkFormat(privateKey)) {
    // 处理 JWK 格式密钥
    try {
      // 检查是否包含私钥属性
      const jwk =
        typeof privateKey === "string" ? JSON.parse(privateKey) : privateKey;

      // 对于RSA，检查是否包含私钥必需的字段(d)
      if (algorithm.startsWith("RS") && (!jwk || !jwk.d)) {
        throw new Error("RSA签名需要私钥，但提供的是公钥（缺少'd'字段）");
      }

      key = await crypto.subtle.importKey("jwk", jwk, cryptoAlgorithm, false, [
        "sign",
      ]);
    } catch (error) {
      throw new Error(
        `无效的JWK格式私钥: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  } else {
    // 既不是PEM也不是JWK格式
    throw new Error("私钥必须是有效的PEM格式或JWK格式");
  }

  const signature = await crypto.subtle.sign(
    cryptoAlgorithm,
    key,
    encoder.encode(data)
  );

  return base64UrlEncode(signature);
};

// 验证 HMAC 签名
export const verifyHmacSignature = async (
  data: string,
  signature: string,
  secret: string,
  algorithm: string
): Promise<boolean> => {
  const cryptoAlgorithm = {
    name: "HMAC",
    hash: {
      name: algorithm.replace("HS", "SHA-"),
    },
  };

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    cryptoAlgorithm,
    false,
    ["verify"]
  );
  const signatureBytes = base64UrlDecodeBinary(signature);
  const result = await crypto.subtle.verify(
    cryptoAlgorithm,
    key,
    signatureBytes,
    encoder.encode(data)
  );

  return result;
};

// 验证 RSA/ECDSA 签名
export const verifyAsymmetricSignature = async (
  data: string,
  signature: string,
  publicKey: string | object,
  algorithm: string
): Promise<boolean> => {
  const cryptoAlgorithm = {
    name: algorithm.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : "ECDSA",
    hash: {
      name: algorithm.replace(/^[RE]S/, "SHA-"),
    },
  };

  const encoder = new TextEncoder();
  let key;

  if (typeof publicKey === "string" && isPemFormat(publicKey)) {
    // 处理 PEM 格式公钥
    try {
      const der = pemToDer(publicKey);
      key = await crypto.subtle.importKey(
        algorithm.startsWith("RS") ? "spki" : "ec",
        der,
        cryptoAlgorithm,
        false,
        ["verify"]
      );
    } catch (error) {
      throw new Error(
        `无效的PEM格式公钥: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  } else if (isJwkFormat(publicKey)) {
    // 处理 JWK 格式公钥
    try {
      const jwk =
        typeof publicKey === "string" ? JSON.parse(publicKey) : publicKey;
      key = await crypto.subtle.importKey("jwk", jwk, cryptoAlgorithm, false, [
        "verify",
      ]);
    } catch (error) {
      throw new Error(
        `无效的JWK格式公钥: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  } else {
    // 既不是PEM也不是JWK格式
    throw new Error("公钥必须是有效的PEM格式或JWK格式");
  }

  const signatureBytes = base64UrlDecodeBinary(signature);
  const result = await crypto.subtle.verify(
    cryptoAlgorithm,
    key,
    signatureBytes,
    encoder.encode(data)
  );

  return result;
};

// 生成 JWT 令牌
export const generateJwt = async (
  payload: JwtPayload,
  options: {
    secret?: string;
    privateKey?: string | object;
    algorithm: string;
  }
): Promise<string> => {
  const header: JwtHeader = {
    alg: options.algorithm,
    typ: "JWT",
  };

  const jwtParts = createJwtParts(header, payload);
  let signature: string;

  if (options.algorithm.startsWith("HS")) {
    if (!options.secret) {
      throw new Error("HMAC algorithm requires a secret");
    }
    signature = await generateHmacSignature(
      jwtParts,
      options.secret,
      options.algorithm
    );
  } else {
    if (!options.privateKey) {
      throw new Error("RSA/ECDSA algorithm requires a private key");
    }
    signature = await generateAsymmetricSignature(
      jwtParts,
      options.privateKey,
      options.algorithm
    );
  }

  return `${jwtParts}.${signature}`;
};

// 验证 JWT 令牌
export const verifyJwt = async (
  token: string,
  options: {
    secret?: string;
    publicKey?: string | object;
    algorithm: string;
  }
): Promise<boolean> => {
  try {
    const decoded = decodeJwt(token);
    const jwtParts = token.split(".").slice(0, 2).join(".");
    const signature = token.split(".")[2];

    if (decoded.header.alg !== options.algorithm) {
      throw new Error(
        `Algorithm mismatch: expected ${options.algorithm}, got ${decoded.header.alg}`
      );
    }

    if (options.algorithm.startsWith("HS")) {
      if (!options.secret) {
        throw new Error("HMAC algorithm requires a secret");
      }
      return await verifyHmacSignature(
        jwtParts,
        signature,
        options.secret,
        options.algorithm
      );
    } else {
      if (!options.publicKey) {
        throw new Error("RSA/ECDSA algorithm requires a public key");
      }
      return await verifyAsymmetricSignature(
        jwtParts,
        signature,
        options.publicKey,
        options.algorithm
      );
    }
  } catch (error) {
    throw new Error(
      `Failed to verify JWT: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// 将时间戳转换为人类可读格式
export const formatTimestamp = (timestamp: number): string => {
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return timestamp.toString();
  }

  const date = new Date(timestamp * 1000);
  return date.toISOString();
};

// 处理JWT载荷中的时间戳字段
export const processJwtPayload = (payload: JwtPayload): JwtPayload => {
  const processedPayload = { ...payload };

  // 常见的JWT时间戳字段
  const timestampFields = ["iat", "exp", "nbf"];

  timestampFields.forEach((field) => {
    if (
      field in processedPayload &&
      typeof processedPayload[field] === "number"
    ) {
      // 为每个时间戳字段添加一个人类可读格式的副本
      processedPayload[`${field}_human`] = formatTimestamp(
        processedPayload[field] as number
      );
    }
  });

  return processedPayload;
};

// 支持的 JWT 算法
export const supportedAlgorithms = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
];
