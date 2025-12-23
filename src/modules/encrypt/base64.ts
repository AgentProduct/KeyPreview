export const base64Encode = (text: string) => btoa(encodeURIComponent(text));

export const base64Decode = (text: string) => decodeURIComponent(atob(text));
