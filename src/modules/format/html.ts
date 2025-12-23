import prettier from "prettier/standalone";
import parserHtml from "prettier/plugins/html";

export const formatHTML = (text: string) =>
  prettier.format(text, {
    parser: "html",
    plugins: [parserHtml],
  });
