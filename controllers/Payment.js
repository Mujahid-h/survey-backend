import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const makePayments = async (req, res) => {
  try {
    const payload = req.body;
    console.log("Received payload:", payload);

    console.log(process.env.API_KEY);

    const response = await axios.post(
      "https://stratospay.com/api/v1/cards",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    console.log("Try blockk executed");
    return res.status(201).json({ success: true, response: response });
  } catch (error) {
    console.log("Catch block executed: ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "INternal server error",
    });
  }
};
