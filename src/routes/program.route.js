import { Router } from "express";
import {
  allPrograms,
  createProgram,
  deleteProgram,
  updateProgram,
} from "../controllers/program.controller.js";

const programRouter = Router();

// all programs
programRouter.get("/", allPrograms);

// create programs
programRouter.post("/create", createProgram);

// update programs;
programRouter.put("/update/:id", updateProgram);

// delete program
programRouter.delete("/delete/:id", deleteProgram);

export default programRouter;
