import express from "express";
import { authenticate } from "../middleware/authmiddleware";
import { analyseDocument } from "../controllers/analyseDocument";

const router = express.Router();
router.get("/", authenticate, analyseDocument);

export default router;
