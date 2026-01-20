import { Op } from "sequelize";
import { announcementModel } from "../models/announcement.model.js";
import { announcementTarget } from "../models/announcement_target.model.js";
import { studentModel } from "../models/student.model.js";
import { studentEnrollment } from "../models/student_enrollment.model.js";
import ApiResponse from "../utils/api_response/api_response.js";

const getAllAnnouncements = async (req, res) => {
  try {
    const { id: studentId } = req.student;

    if (!studentId) {
      const response = new ApiResponse(409, `invalid id`);
      return res.status(response.statusCode).json(response);
    }

    const enrollment = await studentEnrollment.findOne({
      where: { studentId, isActive: true },
    });

    if (!enrollment) {
      const response = new ApiResponse(404, "student is inactive or graduated");
      return res.status(response.statusCode).json(response);
    }

    const announcements = await announcementModel.findAll({
      include: [
        {
          model: announcementTarget,
          where: {
            [Op.or]: [
              { studentId },
              {
                programId: enrollment.programId,
                semesterId: enrollment.semesterId,
              },
              {
                programId: enrollment.programId,
                semesterId: null,
              },
              {
                programId: null,
                semesterId: null,
                studentId: null,
              },
            ],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const response = new ApiResponse(
      200,
      "Students announcements",
      announcements
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to get student announcement: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export default getAllAnnouncements;
