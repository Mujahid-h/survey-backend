import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import verifyCheckout from "./routes/verify-checkout.js";
import orderConfirmation from "./routes/order-confirmation.js";
import payment from "./routes/payment.js";
import connectDB from "./config/db.js";
import surveyRoutes from "./routes/surveyRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//  Test route
app.get("/", (req, res) => {
  res.send("Server is running here successfully!");
});

// Routes
app.use("/api/checkout", verifyCheckout);
app.use("/api/order", orderConfirmation);
app.use("/api/payment", payment);
app.use("/api/surveys", surveyRoutes);
const PORT = 8080;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
