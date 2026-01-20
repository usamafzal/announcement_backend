import { Router } from "express";
import {
  allAnnouncementTarget,
  createAnnouncementTarget,
  deleteAnnouncementTarget,
  updateAnnouncementTarget,
} from "../controllers/announcement_target.controller.js";

const announcementTarget = Router();

// all announcements
announcementTarget.get("/", allAnnouncementTarget);

// create announcements
announcementTarget.post("/create", createAnnouncementTarget);

// update announcements
announcementTarget.put("/update/:id", updateAnnouncementTarget);

// delete announcements
announcementTarget.delete("/delete/:id", deleteAnnouncementTarget);

export default announcementTarget;
