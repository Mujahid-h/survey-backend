// routes/surveyRoutes.js
import express from "express";
import { intakeSurvey, listSurveys } from "../controllers/surveyController.js";

const router = express.Router();

// POST /api/surveys/intake
router.post("/intake", intakeSurvey);

// GET /api/surveys
router.get("/", listSurveys);

export default router;
