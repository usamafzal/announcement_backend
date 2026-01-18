import { Router } from "express";
import {
  bulkPromoteWithGraduation,
  createStudentEnrollment,
  deleteStudentEnrollment,
  getAllEnrollments,
  updateStudentEnrollment,
} from "../controllers/student_enrollment.controller.js";

const studentEnrollment = Router();

// All Student Enrollments
studentEnrollment.get("/", getAllEnrollments);

// create student enrollment
studentEnrollment.post("/create", createStudentEnrollment);

// update student enrollment
studentEnrollment.put("/update/:id", updateStudentEnrollment);

// delete student enrollment
studentEnrollment.delete("/delete/:id", deleteStudentEnrollment);

// promote and graduate student
studentEnrollment.post("/promote", bulkPromoteWithGraduation);

export default studentEnrollment;
