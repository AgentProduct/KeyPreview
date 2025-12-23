import { useState } from "react";
import { urlEncode } from "../modules/encrypt/url";
import { base64Encode } from "../modules/encrypt/base64";
import { md5 } from "../modules/encrypt/md5";

export default function EncryptTab() {
  const [type, setType] = useState("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const run = () => {
    try {
      if (type === "base64") setOutput(base64Encode(input));
      if (type === "url") setOutput(urlEncode(input));
      if (type === "md5") setOutput(md5(input));
    } catch {
      setOutput("❌ 处理失败");
    }
  };

  return (
    <>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="base64">Base64</option>
        <option value="url">URL Encode</option>
        <option value="md5">MD5</option>
      </select>

      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={run}>转换</button>
      <textarea value={output} readOnly />
    </>
  );
}
