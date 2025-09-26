import express from "express";
import { createBusiness } from "../controller/businessController";

const router = express.Router();

router.post("/create", createBusiness);

export default router;