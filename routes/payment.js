import express from "express";
import { makePayments } from "../controllers/Payment.js";

const router = express();

router.post("/", makePayments);

export default router;
