import { Router } from "express";
import {
  allStudents,
  createStudent,
  deleteStudent,
  loginStudent,
  updatePassword,
  updateStudent,
} from "../controllers/student.controller.js";
import IsUserLoggedIn from "../middleware/auth.middleware.js";
import { isStudentLoggedIn } from "../middleware/student.middleware.js";

const studentRouter = Router();

// get all students
studentRouter.get("/", allStudents);

// create student
studentRouter.post("/create", IsUserLoggedIn, createStudent);

// login student
studentRouter.post("/login", loginStudent);

// update admin student
studentRouter.put("/update/:id", IsUserLoggedIn, updateStudent);

// update password
studentRouter.put("/update", isStudentLoggedIn, updatePassword);

// delete Student
studentRouter.delete("/delete/:id", IsUserLoggedIn, deleteStudent);

export { studentRouter };
