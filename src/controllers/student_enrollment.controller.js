import { Op, where } from "sequelize";
import { programModel } from "../models/program.model.js";
import { semesterModel } from "../models/semester.model.js";
import { studentModel } from "../models/student.model.js";
import { studentEnrollment } from "../models/student_enrollment.model.js";
import ApiResponse from "../utils/api_response/api_response.js";
import ConfigDB from "../db/db.js";

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await studentEnrollment.findAll({
      include: [
        { model: studentModel, as: "students" },
        { model: semesterModel, as: "semesters" },
        { model: programModel, as: "programs" },
      ],
      order: [["createdAt", "DESC"]],
    });
    const response = new ApiResponse(200, "all enrollments", enrollments);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to get all enrollments: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const createStudentEnrollment = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { studentId, programId, semesterId } = req.body;

    if (!studentId || !programId || !semesterId) {
      const response = new ApiResponse(
        409,
        "Student id, program id and semester id is required"
      );
      return res.status(response.statusCode).json(response);
    }

    const existEnrollment = await studentEnrollment.findOne({
      where: { studentId, programId, semesterId },
    });
    if (existEnrollment) {
      const response = new ApiResponse(
        409,
        "Student is already enrolled in this program for this semester"
      );
      return res.status(response.statusCode).json(response);
    }

    await studentEnrollment.update(
      { isActive: false },
      { where: { studentId, isActive: true } }
    );

    const enrollment = await studentEnrollment.create({
      studentId,
      programId,
      semesterId,
    });

    const response = new ApiResponse(
      201,
      "enrollment created successfully",
      enrollment
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to created enrollment: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const updateStudentEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const findEnrollment = await studentEnrollment.findByPk(id);

    if (!findEnrollment) {
      const response = new ApiResponse(404, "student enrollment not found");
      return res.status(response.statusCode).json(response);
    }

    const { studentId, programId, semesterId, isActive } = req.body;

    if (
      !studentId ||
      !programId ||
      !semesterId ||
      typeof isActive !== "boolean"
    ) {
      const response = new ApiResponse(
        400,
        "student id, program id and semester id is required"
      );
      return res.status(response.statusCode).json(response);
    }

    const existEnrollment = await studentEnrollment.findOne({
      where: {
        studentId,
        programId,
        semesterId,
        isActive: true,
        id: { [Op.ne]: id },
      },
    });
    if (existEnrollment) {
      const response = new ApiResponse(409, "student enrollment already exist");
      return res.status(response.statusCode).json(response);
    }

    const [_, updatedEnrollment] = await studentEnrollment.update(
      {
        semesterId,
        programId,
        semesterId,
        isActive,
      },
      { where: { id }, returning: true }
    );

    const response = new ApiResponse(
      200,
      "updated enrollment successfully",
      updatedEnrollment[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to updated enrollment: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const deleteStudentEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await studentEnrollment.findByPk(id);
    if (!enrollment) {
      const response = new ApiResponse(400, "student enrollment not found");
      return res.status(response.statusCode).json(response);
    }

    await enrollment.destroy();

    const response = new ApiResponse(
      200,
      "student enrollment deleted successfully"
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to delete student enrollment: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const bulkPromoteWithGraduation = async (req, res) => {
  let transaction;
  try {
    if (!req.body) {
      const response = new ApiResponse(200, "Invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { programId, fromSemesterOrder } = req.body;

    if (!programId || !fromSemesterOrder) {
      const response = new ApiResponse(
        409,
        "program id and current semester Order is required"
      );
      return res.status(response.statusCode).json(response);
    }

    transaction = await ConfigDB.transaction();

    const program = await programModel.findByPk(programId, { transaction });
    if (!program) {
      await transaction.rollback(); // Always rollback on early exit
      const response = new ApiResponse(404, "program not found");
      return res.status(response.statusCode).json(response);
    }

    // --- FIX 1: Transaction moved outside of 'where' ---
    const currentSemester = await semesterModel.findOne({
      where: { order: fromSemesterOrder },
      transaction,
    });

    if (!currentSemester) {
      await transaction.rollback();
      const response = new ApiResponse(404, "semester not found");
      return res.status(response.statusCode).json(response);
    }

    const enrollment = await studentEnrollment.findAll({
      where: {
        programId,
        semesterId: currentSemester.id,
        isActive: true,
      },
      transaction,
    });

    if (!enrollment.length) {
      await transaction.rollback();
      const response = new ApiResponse(409, "no student found");
      return res.status(response.statusCode).json(response);
    }

    const promotable = [];
    const isGraduatedIds = []; // Renamed for clarity

    for (const e of enrollment) {
      // --- FIX 2: Compare .order (number) vs .durationSemesters (number) ---
      if (currentSemester.order < program.durationSemesters) {
        promotable.push(e);
      } else {
        isGraduatedIds.push(e.studentId);
      }
    }

    // Deactivate current enrollments
    await studentEnrollment.update(
      { isActive: false },
      {
        where: { programId, semesterId: currentSemester.id, isActive: true },
        transaction,
      }
    );

    // Handle graduates
    if (isGraduatedIds.length) {
      await studentModel.update(
        { isGraduated: true },
        { where: { id: isGraduatedIds }, transaction }
      );
    }

    // Handle promotions
    if (promotable.length) {
      // --- FIX 3: Add to .order, not the object ---
      const nextSemester = await semesterModel.findOne({
        where: { order: currentSemester.order + 1 },
        transaction,
      });

      if (!nextSemester) {
        await transaction.rollback();
        const response = new ApiResponse(
          409,
          "next semester not found in database, cannot promote"
        );
        return res.status(response.statusCode).json(response);
      }

      const newEnrollment = promotable.map((e) => {
        return {
          studentId: e.studentId,
          programId: e.programId,
          semesterId: nextSemester.id,
          isActive: true,
        };
      });

      await studentEnrollment.bulkCreate(newEnrollment, { transaction });
    }

    await transaction.commit();

    res.json({
      message: "Promotion completed successfully",
      promoted: promotable.length,
      // --- FIX 4: Use the correct variable name ---
      graduated: isGraduatedIds.length,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    const response = new ApiResponse(
      500,
      `failed to execute task: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export {
  createStudentEnrollment,
  getAllEnrollments,
  updateStudentEnrollment,
  deleteStudentEnrollment,
  bulkPromoteWithGraduation,
};
