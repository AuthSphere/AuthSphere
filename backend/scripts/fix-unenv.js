import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.join(
  __dirname,
  "../node_modules/unenv/dist/runtime/npm/whatwg-url/index.mjs",
);

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, "utf8");
  if (!content.includes("export default")) {
    content += `
export default {
  URL,
  URLSearchParams,
  parseURL,
  basicURLParse,
  serializeURL,
  serializeHost,
  serializeInteger,
  serializeURLOrigin,
  setTheUsername,
  setThePassword,
  cannotHaveAUsernamePasswordPort,
  percentDecodeBytes,
  percentDecodeString
};
`;
    fs.writeFileSync(targetPath, content);
    console.log("Fixed unenv whatwg-url polyfill.");
  } else {
    console.log("unenv whatwg-url polyfill already fixed.");
  }
} else {
  console.log("unenv whatwg-url polyfill not found.");
}
