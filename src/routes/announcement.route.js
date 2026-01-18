import { Router } from "express";
import {
  allAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "../controllers/announcement.controller.js";

const announcementRouter = Router();

// all announcements
announcementRouter.get("/", allAnnouncement);

// create announcements
announcementRouter.post("/create", createAnnouncement);

// update announcements
announcementRouter.put("/update/:id", updateAnnouncement);

// delete announcements
announcementRouter.delete("/delete/:id", deleteAnnouncement);

export default announcementRouter;
