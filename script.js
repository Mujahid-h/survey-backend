// import crypto from "crypto";
// import fs from "fs";

// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048,
// });

// fs.writeFileSync(
//   "private.pem",
//   privateKey.export({ type: "pkcs1", format: "pem" })
// );
// fs.writeFileSync(
//   "public.pem",
//   publicKey.export({ type: "pkcs1", format: "pem" })
// );

import crypto from "crypto";

// Generate 32 character random secret
const secret = crypto.randomBytes(16).toString("hex");

console.log(secret);
