import { announcementModel } from "../models/announcement.model.js";
import { announcementTarget } from "../models/announcement_target.model.js";
import { programModel } from "../models/program.model.js";
import { semesterModel } from "../models/semester.model.js";
import { studentModel } from "../models/student.model.js";
import ApiResponse from "../utils/api_response/api_response.js";

const allAnnouncementTarget = async (req, res) => {
  try {
    const announcements = await announcementTarget.findAll({
      include: [
        { model: announcementModel, as: "announcements" },
        { model: semesterModel, as: "semesters" },
        { model: programModel, as: "programs" },
        { model: studentModel, as: "students" },
      ],
      order: [["createdAt", "DESC"]],
    });
    const response = new ApiResponse(
      200,
      `all announcements target:`,
      announcements
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to get all announcements target: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const createAnnouncementTarget = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { announcementId, programId, studentId, semesterId } = req.body;

    if (!announcementId) {
      const response = new ApiResponse(404, "announcementId fields required");
      return res.status(response.statusCode).json(response);
    }

    const target = await announcementTarget.create({
      announcementId,
      programId: programId || null,
      studentId: studentId || null,
      semesterId: semesterId || null,
    });

    const response = new ApiResponse(
      201,
      "announcement created successfull",
      target
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to create announcement: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const updateAnnouncementTarget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = new ApiResponse(400, "id is required");
      return res.status(response.statusCode).json(response);
    }

    if (!req.body) {
      const response = new ApiResponse(400, "invalid request body");
      return res.status(response.statusCode).json(response);
    }

    const { announcementId, programId, studentId, semesterId } = req.body;

    // Check if target exists
    const existingTarget = await announcementTarget.findByPk(id);

    if (!existingTarget) {
      const response = new ApiResponse(404, "announcement target not found");
      return res.status(response.statusCode).json(response);
    }

    // Update only provided fields
    await existingTarget.update({
      announcementId:
        announcementId !== undefined
          ? announcementId
          : existingTarget.announcementId,
      programId: programId !== undefined ? programId : existingTarget.programId,
      studentId: studentId !== undefined ? studentId : existingTarget.studentId,
      semesterId:
        semesterId !== undefined ? semesterId : existingTarget.semesterId,
    });

    const response = new ApiResponse(
      200,
      "announcement target updated successfully",
      existingTarget
    );

    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to update announcement target: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const deleteAnnouncementTarget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response = new ApiResponse(400, "id is required");
      return res.status(response.statusCode).json(response);
    }

    const existingTarget = await announcementTarget.findByPk(id);

    if (!existingTarget) {
      const response = new ApiResponse(404, "announcement target not found");
      return res.status(response.statusCode).json(response);
    }

    await existingTarget.destroy();

    const response = new ApiResponse(
      200,
      "announcement target deleted successfully"
    );

    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to delete announcement target: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export {
  createAnnouncementTarget,
  allAnnouncementTarget,
  updateAnnouncementTarget,
  deleteAnnouncementTarget,
};
