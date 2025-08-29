import express from "express";
import {
  changeApprovalStatus,
  changePaymentStatus,
  confirmOrder,
  fetchOrderById,
  fetchOrders,
  rejectOrder,
} from "../controllers/order-confirmation.js";

const router = express.Router();

router.post("/confirm", confirmOrder);
router.get("/", fetchOrders);
router.get("/:id", fetchOrderById);
router.put("/payment/:id", changePaymentStatus);
router.put("/status/:id", changeApprovalStatus);
router.put("/reject/:id", rejectOrder);

export default router;
