import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import { signWithPrivateKey } from "../helpers/rsa-signin.js"; // your signing fn

dotenv.config();

// export const confirmOrder = async (req, res) => {
//   try {
//     const { answers, orderData } = req.body;

//     // console.log(orderData);

//     const verifiedPayload = orderData;

//     if (!verifiedPayload?.order?.id || !verifiedPayload?.callback_url) {
//       return res
//         .status(400)
//         .json({ success: false, message: "missing_payload_fields" });
//     }

//     const isExist = await Order.findOne({
//       merchant_order_id: verifiedPayload.order.id,
//     });

//     if (isExist)
//       return res
//         .status(400)
//         .json({ success: false, message: "Order already exist" });

//     // Extract order data from payload
//     const orderDataDetails = verifiedPayload?.order;
//     const merchant_order_id = orderDataDetails.id;
//     const merchant_name = verifiedPayload.site_name;
//     const merchant_url = verifiedPayload.site_url;
//     const callback_url = verifiedPayload.callback_url;
//     const return_url = verifiedPayload.return_url;

//     // Generate TRTPEP ID
//     const trtpep_order_id = uuidv4();

//     // Build new order doc
//     const newOrder = new Order({
//       trtpep_order_id,
//       merchant_order_id: merchant_order_id,
//       merchant_name,
//       merchant_url,
//       customer: verifiedPayload.customer || {},
//       items: (orderDataDetails.items || []).map((item) => ({
//         product_id: item.product_id,
//         name: item.name,
//         sku: item.sku,
//         qty: item.qty,
//         price: item.total,
//         subtotal: item.subtotal,
//         total: item.total,
//       })),
//       currency: orderDataDetails.currency || "USD",
//       total_order_value: orderDataDetails.amount_total || "0.00",
//       questionnaire: (answers || []).map((a, idx) => ({
//         question: a.question || `q${idx + 1}`,
//         answer: a.answer,
//       })),
//       payment_status: "pending",
//       approval_status: "pending",
//       callback_url,
//       return_url,
//       nonce: verifiedPayload.nonce,
//       site_id: verifiedPayload.site_id,
//       ts: verifiedPayload.ts,
//       version: verifiedPayload.v,
//     });

//     // Save to MongoDB
//     await newOrder.save();

//     // // Build body for Woo callback
//     // const body = {
//     //   v: "1.0",
//     //   site_id: process.env.SITE_ID,
//     //   order_id: Number(merchant_order_id),
//     //   payment_status: "paid", // or "failed"/"canceled"
//     //   transaction_id: "gw_txn_" + Date.now(),
//     //   ts: Math.floor(Date.now() / 1000),
//     //   nonce: crypto.randomUUID(),
//     //   event_id: crypto.randomUUID(),
//     //   meta: { answers: answers ?? null },
//     // };

//     // // Sign body
//     // const raw = JSON.stringify(body);
//     // const signature = signWithPrivateKey(raw);

//     // // Send to WooCommerce
//     // const woo = await axios.post(callback_url, raw, {
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     "X-Delta-Signature": signature,
//     //     "X-Delta-Key-Id": "k1",
//     //   },
//     //   transformRequest: (v) => v,
//     //   timeout: 15000,
//     //   validateStatus: (s) => s >= 200 && s < 300,
//     // });

//     // // Build thank-you URL
//     // const thankYou = new URL(return_url);
//     // thankYou.searchParams.set("delta_return", "1");
//     // thankYou.searchParams.set("order", String(merchant_order_id));
//     // thankYou.searchParams.set("key", String(orderDataDetails.key));

//     // return res.json({
//     //   ok: true,
//     //   wp: woo.data,
//     //   redirect: thankYou.toString(),
//     //   order: newOrder,
//     // });

//     res.status(201).json({ success: true, order: newOrder });
//   } catch (error) {
//     console.error(
//       "Order confirmation error:",
//       error.response?.status,
//       error.response?.data || error.message
//     );
//     return res.status(500).json({
//       ok: false,
//       error: "confirm_failed",
//       detail: error.response?.data || error.message,
//     });
//   }
// };

export const confirmOrder = async (req, res) => {
  try {
    const verifiedPayload = req.body;

    console.log(verifiedPayload);

    if (!verifiedPayload?.order?.id || !verifiedPayload?.callback_url) {
      return res
        .status(400)
        .json({ success: false, message: "missing_payload_fields" });
    }

    const isExist = await Order.findOne({
      merchant_order_id: verifiedPayload.order.id,
    });

    if (isExist)
      return res
        .status(400)
        .json({ success: false, message: "Order already exist" });

    // Extract order data from payload
    const orderDataDetails = verifiedPayload?.order;
    const merchant_order_id = orderDataDetails.id;
    const merchant_name = verifiedPayload.site_name;
    const merchant_url = verifiedPayload.site_url;
    const callback_url = verifiedPayload.callback_url;
    const return_url = verifiedPayload.return_url;

    // Generate TRTPEP ID
    const trtpep_order_id = uuidv4();

    // Build new order doc
    const newOrder = new Order({
      trtpep_order_id,
      merchant_order_id: merchant_order_id,
      merchant_name,
      merchant_url,
      customer: verifiedPayload.customer || {},
      items: (orderDataDetails.items || []).map((item) => ({
        product_id: item.product_id,
        name: item.name,
        sku: item.sku,
        qty: item.qty,
        price: item.total,
        subtotal: item.subtotal,
        total: item.total,
      })),
      currency: orderDataDetails.currency || "USD",
      total_order_value: orderDataDetails.amount_total || "0.00",
      payment_status: "pending",
      approval_status: "pending",
      callback_url,
      return_url,
      nonce: verifiedPayload.nonce,
      site_id: verifiedPayload.site_id,
      ts: verifiedPayload.ts,
      version: verifiedPayload.v,
    });

    // Save to MongoDB
    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error(
      "Order confirmation error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      error: "confirm_failed",
      detail: error.response?.data || error.message,
    });
  }
};
export const fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const fetchOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ merchant_order_id: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: error.message });
  }
};

export const changePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, failedReason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.payment_status = status;
    if (status === "failed") {
      order.failed_payment_reason = failedReason || "Unknown failure";
    }

    await order.save();
    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

export const changeApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.approval_status = status;
    await order.save();

    res.status(200).json({ message: "Approval status updated", order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update approval status",
      error: error.message,
    });
  }
};

export const rejectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.rejection_reason = reason || "No reason provided";
    order.approval_status = "rejected";

    await order.save();
    res.status(200).json({ message: "Order rejected", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reject order", error: error.message });
  }
};
