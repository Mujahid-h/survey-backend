// import crypto from "crypto";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// export const signWithPrivateKey = (data) => {
//   // Read your RSA private key from file
//   const privateKeyPath = path.resolve(process.env.RSA_PRIVATE_KEY_PATH);
//   const privateKey = fs.readFileSync(privateKeyPath, "utf8");

//   const sign = crypto.createSign("RSA-SHA256");
//   sign.update(JSON.stringify(data));
//   sign.end();
//   return sign.sign(privateKey, "base64");
// };

import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sign a RAW JSON string with RSA-SHA256 and return base64.
 * Pass the exact JSON string you will send in the HTTP body.
 */
export const signWithPrivateKey = (rawJson) => {
  const privateKeyPath = path.resolve(process.env.RSA_PRIVATE_KEY_PATH);
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(rawJson);
  signer.end();
  return signer.sign(privateKey, "base64");
};
