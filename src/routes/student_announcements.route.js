import { Router } from "express";
import getAllAnnouncements from "../controllers/student_announcement.controller.js";

const studentAnnouncementsRouter = Router();

// get student announcements

studentAnnouncementsRouter.get("/", getAllAnnouncements);

export default studentAnnouncementsRouter;
