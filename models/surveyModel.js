import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  received_at: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("Survey", surveySchema);
