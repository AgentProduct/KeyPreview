import prettier from "prettier/standalone";
import parserPostcss from "prettier/plugins/postcss";

export const formatCSS = (text: string) =>
  prettier.format(text, {
    parser: "css",
    plugins: [parserPostcss],
  });
