import express from "express";
import { verifyCheckout } from "../controllers/verify-checkout.js";

const router = express.Router();

router.post("/verifycheckout", verifyCheckout);

export default router;
