import { semesterModel } from "../models/semester.model.js";
import ApiResponse from "../utils/api_response/api_response.js";

const allSemester = async (req, res) => {
  try {
    const allSemester = await semesterModel.findAll();
    const response = new ApiResponse(200, "all semseters", allSemester);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to get all students: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const createSemester = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { name, order } = req.body;

    if (!name || !order) {
      const response = new ApiResponse(400, "name & order is required");
      return res.status(response.statusCode).json(response);
    }

    const existSemester = await semesterModel.findOne({ where: { name } });

    if (existSemester) {
      const response = new ApiResponse(409, "semester already exist");
      return res.status(response.statusCode).json(response);
    }

    const created = await semesterModel.create({ name, order });

    const response = new ApiResponse(
      201,
      "semester created successfully",
      created
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to create semester: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;

    const existSemester = await semesterModel.findByPk(id);

    if (!existSemester) {
      const response = new ApiResponse(409, "semester can't exist");
      return res.status(response.statusCode).json(response);
    }

    const { name, order } = req.body;

    if (!name || !order) {
      const response = new ApiResponse(400, "name & order is required");
      return res.status(response.statusCode).json(response);
    }

    const [_, updated] = await semesterModel.update(
      { name, order },
      { where: { id: existSemester.id }, returning: true }
    );

    const response = new ApiResponse(
      200,
      "semester updated successfully",
      updated[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `failed to update semester: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;

    const existSemester = await semesterModel.findByPk(id);
    if (!existSemester) {
      const response = new ApiResponse(400, "Semester can't exist");
      return res.status(response.statusCode).json(response);
    }

    await semesterModel.destroy({ where: { id: existSemester.id } });

    const response = new ApiResponse(200, "Semester deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new ApiResponse(
      500,
      `Failed to delete semester: ${error.message}`
    );
    return res.status(response.statusCode).json(response);
  }
};

export { allSemester, createSemester, updateSemester, deleteSemester };
