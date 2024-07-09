import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import { addParticipant, createEvent, listEvents, userParticipate } from "../controllers/userController.js";

router.post("/user/create-event", auth, createEvent);

router.get("/user/get-all-events", auth, listEvents);

router.patch("/user/add-participant/:id", auth, addParticipant);

router.post("/user/participate/:eventID", auth, userParticipate);

export default router;
