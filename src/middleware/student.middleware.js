import { studentModel } from "../models/student.model.js";
import ApiError from "../utils/api_response/api_error.js";
import ApiResponse from "../utils/api_response/api_response.js";
import jwt from "jsonwebtoken";

export const isStudentLoggedIn = async (req, res, next) => {
  try {
    const studentToken =
      req.cookies.studentToken || req.headers.authorization?.split(" ")[1];

    if (!studentToken) {
      const response = new ApiResponse(401, "Authentication token required");
      return res.status(response.statusCode).json(response);
    }
    let verifyToken;
    try {
      verifyToken = await jwt.verify(
        studentToken,
        process.env.JWT_STUDENT_SECRET
      );
    } catch (error) {
      const response = new ApiResponse(400, `Unauthorized: ${error.message}`);
      return res.status(response.statusCode).json(response);
    }

    const student = await studentModel.findByPk(verifyToken.id);

    if (!student) {
      const response = new ApiResponse(401, "student can't exist");
      return res.status(response.statusCode).json(response);
    }

    if (!student.isActive || student.isGraduated || !student.isFeeCleared) {
      const response = new ApiResponse(403, "Access revoked by admin");
      return res.status(response.statusCode).json(response);
    }

    req.student = {
      id: student.id,
      userId: student.userId,
    };

    next();
  } catch (error) {
    throw new ApiError(
      417,
      `Server refused to process your request ${error.message}`
    );
  }
};
