import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

function b64urlToUtf8(b64u) {
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

export const verifyCheckout = (req, res) => {
  try {
    const { payloadB64, sig, siteId } = req.body;

    const rawJson = b64urlToUtf8(payloadB64);
    const expected = crypto
      .createHmac("sha256", process.env.SITE_SECRET)
      .update(rawJson)
      .digest("hex");

    // console.log(JSON.parse(rawJson));

    if (expected === sig) {
      return res.json({ valid: true, payload: JSON.parse(rawJson) });
    }

    return res.status(400).json({ valid: false, error: "Invalid signature" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
