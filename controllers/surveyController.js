import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const dataDir = path.resolve("./data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const secret = process.env.SHARED_SECRET;
const surveysFile = path.join(dataDir, "surveys.jsonl");

/**
 * Save a line to surveys.jsonl
 */
const appendLine = (file, obj) => {
  fs.appendFileSync(file, JSON.stringify(obj) + "\n");
};

/**
 * POST /api/surveys/intake
 * - Verify HMAC signature
 * - Save the survey to file
 */
export const intakeSurvey = (req, res) => {
  console.log("Endpoint /api/surveys/intake hit successfully!");
  const headers = req.headers;
  const body = req.body || {};

  console.log("-> Incoming survey");
  console.log("Headers:", headers);
  console.log("Parsed body:", body);

  // Validate signature
  const incomingSig = headers["x-signature"];
  if (!incomingSig) {
    return res
      .status(400)
      .json({ success: false, error: "Missing x-signature" });
  }

  // NOTE: using JSON.stringify(req.body) because we’re not touching your global express.json()
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expected !== incomingSig) {
    console.log("❌ Signature mismatch");
    return res.status(401).json({ success: false, error: "Invalid signature" });
  }

  console.log("✅ Signature OK");

  // Save
  appendLine(surveysFile, { received_at: new Date().toISOString(), ...body });

  res.json({ success: true, received: body });
};

/**
 * GET /api/surveys
 * - List all saved surveys
 */
export const listSurveys = (req, res) => {
  if (!fs.existsSync(surveysFile)) return res.json([]);
  const lines = fs
    .readFileSync(surveysFile, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  const out = lines.map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return { parse_error: true, raw: l };
    }
  });
  res.json(out);
};
