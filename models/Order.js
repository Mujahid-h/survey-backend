import mongoose from "mongoose";

// separate customer schema (Taa k customer details separate table main  jaa k save ho wahi sa pick karlain during filteration)
const customerSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    // phone: { type: String },
    // address1: { type: String },
    // address2: { type: String },
    // city: { type: String },
    // state: { type: String },
    // country: { type: String },
    // postal_code: { type: String },
  },
  { _id: false }
);

// As we could have multiple items in a single order
const itemSchema = new mongoose.Schema(
  {
    product_id: { type: Number, required: true },
    name: { type: String, required: true },
    sku: { type: String },
    qty: { type: Number, required: true },
    price: { type: String, required: true },
    subtotal: { type: String, required: true },
    total: { type: String, required: true },
  },
  { _id: false }
);

const questionnaireSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, enum: ["Yes", "No"], required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Internal (TRTPEP) order ID
    trtpep_order_id: { type: String, unique: true, required: true },

    // Merchant Order Details
    merchant_order_id: { type: String, required: true },
    merchant_name: { type: String, required: true },
    merchant_url: { type: String, required: true },

    // Customer Info
    customer: customerSchema,

    // Cart Items
    items: [itemSchema],

    // Financials
    currency: { type: String, required: true },
    total_order_value: { type: String, required: true },

    // Questionnaire responses
    //   questionnaire: [questionnaireSchema],

    // Payment + Approval Status
    payment_status: {
      type: String,
      enum: ["pending", "failed", "completed"],
      default: "pending",
    },
    approval_status: {
      type: String,
      enum: ["pending", "completed", "rejected", "incomplete", "ineligible"],
      default: "pending",
    },
    rejection_reason: { type: String },
    failed_payment_reason: { type: String },

    // URLs (callback + return)
    callback_url: { type: String },
    return_url: { type: String },

    // Metadata
    nonce: { type: String },
    site_id: { type: String },
    ts: { type: Number },
    version: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
