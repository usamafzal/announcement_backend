import { studentModel } from "../models/student.model.js";
import ApiError from "../utils/api_response/api_error.js";
import ApiResponse from "../utils/api_response/api_response.js";
import {
  studentLoginValidation,
  StudentValidation,
  updateStudentValidation,
} from "../utils/validation/student_validate.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

// Admin see all students
const allStudents = async (req, res) => {
  try {
    const students = await studentModel.findAll();
    const response = new ApiResponse(200, "all students", students);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `server failed to get students: ${error.message}`);
  }
};

// create admin student record
const createStudent = async (req, res) => {
  //id, name userId password isGraduated isFeeCleared isActive
  try {
    const studentValidate = StudentValidation(req.body);
    if (!studentValidate.valid) {
      const response = new ApiResponse(400, studentValidate.message);
      return res.status(response.statusCode).json(response);
    }

    const { name, userId, password } = req.body;

    const existUser = await studentModel.findOne({ where: { userId } });
    if (existUser) {
      const response = new ApiResponse(400, "student already exist");
      return res.status(response.statusCode).json(response);
    }

    const student = await studentModel.create({ name, userId, password });

    const { password: _, ...remaining } = student.toJSON();
    const response = new ApiResponse(
      201,
      "Student created successfully",
      remaining
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `Failed to create Student: ${error.message}`);
  }
};

// student logged in
const loginStudent = async (req, res) => {
  try {
    const validate = studentLoginValidation(req.body);

    if (!validate.valid) {
      const response = new ApiResponse(400, validate.message);
      return res.status(response.statusCode).json(response);
    }

    const { userId, password } = req.body;

    const existStudent = await studentModel.findOne({ where: { userId } });

    if (!existStudent) {
      const response = new ApiResponse(404, "student can't exist");
      return res.status(response.statusCode).json(response);
    }

    if (!existStudent.isActive) {
      const response = new ApiResponse(403, "account inactive");
      return res.status(response.statusCode).json(response);
    }

    if (!existStudent.isFeeCleared) {
      const response = new ApiResponse(
        403,
        "Pay pending dues to unlock account"
      );
      return res.status(response.statusCode).json(response);
    }

    if (existStudent.isGraduated) {
      const response = new ApiResponse(
        403,
        "Access denied. This account belongs to a graduated student."
      );
      return res.status(response.statusCode).json(response);
    }

    const verifyPassword = await bcrypt.compare(
      password,
      existStudent.password
    );

    if (!verifyPassword) {
      const response = new ApiResponse(400, "password incorrect");
      return res.status(response.statusCode).json(response);
    }

    const studentToken = await jwt.sign(
      { id: existStudent.id },
      process.env.JWT_STUDENT_SECRET
    );

    res.cookie("studentToken", studentToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const { password: _, ...remaining } = existStudent.toJSON();

    remaining.studentToken = studentToken;

    const response = new ApiResponse(
      200,
      "Student logged in successfully",
      remaining
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to logged in: ${error.message}`);
  }
};

// update admin student record
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const findStudent = await studentModel.findByPk(id);

    if (!findStudent) {
      const response = new ApiResponse(400, "student can't exist");
      return res.status(response.statusCode).json(response);
    }

    const validate = updateStudentValidation(req.body);

    if (!validate.valid) {
      const response = new ApiResponse(400, validate.message);
      return res.status(response.statusCode).json(response);
    }
    const { name, userId, password, isGraduated, isFeeCleared, isActive } =
      req.body;

    const [_, updated] = await studentModel.update(
      { name, userId, password, isGraduated, isFeeCleared, isActive },
      { where: { id: findStudent.id }, individualHooks: true }
    );
    const response = new ApiResponse(
      200,
      "student updated successfully",
      updated[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `Failed to update student: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

// Update Student password logic
const updatePassword = async (req, res) => {
  try {
    const id = req.student.id;

    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword || newPassword)) {
      const response = new ApiResponse(400, "old and new password is required");
      return res.status(response.statusCode).json(response);
    }

    if (newPassword.length < 6) {
      const response = new ApiResponse(
        400,
        "New Password must be at least 6 characters"
      );
      return res.status(response.statusCode).json(response);
    }

    const findStudent = await studentModel.findByPk(id);
    if (!findStudent) {
      const response = new ApiResponse(404, "student can't found");
      return res.status(response.statusCode).json(response);
    }

    const match = await bcrypt.compare(oldPassword, findStudent.password);
    if (!match) {
      const response = new ApiResponse(404, "incorrect password");
      return res.status(response.statusCode).json(response);
    }

    await studentModel.update(
      { password: newPassword },
      { where: { id: findStudent.id }, individualHooks: true }
    );
    const response = new ApiResponse(200, "Password updated successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to update Password: ${error.message}`);
  }
};

// delete students
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existStudent = await studentModel.findByPk(id);
    if (!existStudent) {
      const response = new ApiResponse(200, "student not exist");
      return res.status(response.statusCode).json(response);
    }

    await studentModel.destroy({ where: { id: existStudent.id } });

    const response = new ApiResponse(200, "student deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to delete student: ${error.message}`);
  }
};

export {
  createStudent,
  loginStudent,
  updateStudent,
  updatePassword,
  deleteStudent,
  allStudents,
};
