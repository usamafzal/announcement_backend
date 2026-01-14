import { Router } from "express";
import {
  allSemester,
  createSemester,
  deleteSemester,
  updateSemester,
} from "../controllers/semester.controller.js";

const semesterRouter = Router();

// all semester
semesterRouter.get("/", allSemester);

// create semseter
semesterRouter.post("/create", createSemester);

// update semester
semesterRouter.put("/update/:id", updateSemester);

// delete semester
semesterRouter.delete("/delete/:id", deleteSemester);

export default semesterRouter;
